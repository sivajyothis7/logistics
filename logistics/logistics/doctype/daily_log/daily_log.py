import frappe
from frappe.model.document import Document

class DailyLog(Document):
    
    def on_update(self):
        # Get the driver document associated with this daily log
        driver_doc = frappe.get_doc("Drivers", self.driver)
        
        # Find if there is already payment data for this daily log in the driver document
        existing_payment_data = next((data for data in driver_doc.payment_data if data.daily_log == self.name), None)

        # Update existing payment data or create new payment data
        if existing_payment_data:
            existing_payment_data.update({
                "company_rate": self.company_rate,
                "driver_rate": self.driver_rate,
                "driver_advance": self.driver_advance,
                "pending_driver_rate": 0 if self.payment_status == "Cleared" else self.pending_driver_rate,
                "payment_status": "Cleared" if self.payment_status == "Cleared" else "Not Cleared",
            })
        else:
            payment_data = {
                "daily_log": self.name,
                "company_rate": self.company_rate,
                "driver_rate": self.driver_rate,
                "driver_advance": self.driver_advance,
                "pending_driver_rate": 0 if self.payment_status == "Cleared" else self.pending_driver_rate,
                "payment_status": "Cleared" if self.payment_status == "Cleared" else "Not Cleared",
            }
            driver_doc.append("payment_data", payment_data)

        # Save changes to the driver document
        driver_doc.save(ignore_permissions=True)
        frappe.db.commit()

        # Provide feedback to the user
        driver_link = frappe.utils.get_link_to_form(driver_doc.doctype, self.driver)
        frappe.msgprint(f"Driver Payment Data updated successfully for Driver: {driver_link}")

    
@frappe.whitelist()
def generate_waybilll(docname):
    if not docname:
        frappe.msgprint("Document name is required to generate the waybill.")
        return

    doc = frappe.get_doc("Daily Log", docname)

    if doc.waybill_number:
        frappe.throw(f"Way Bill already exists for this Daily Log: {doc.waybill_number}")
    else:
        data = frappe.get_doc({
            "doctype": "Way Bill",
            "daily_log": doc.name,
        })
        data.insert(ignore_permissions=True)
        frappe.msgprint(f"Way Bill generated successfully: {data.name}")

        doc.waybill_number = data.name
        doc.save(ignore_permissions=True)

        return doc.waybill_number

# waybilll