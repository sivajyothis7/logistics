import frappe
from frappe.model.document import Document

class DailyLog(Document):
    def on_update(self):
        self.update_driver_payment_data()

    def update_driver_payment_data(self):
        driver_doc = frappe.get_doc("Drivers", self.driver)
        
        existing_payment_data = next((data for data in driver_doc.payment_data if data.daily_log == self.name), None)

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

        driver_doc.save(ignore_permissions=True)
        frappe.db.commit()

        driver_link = frappe.utils.get_link_to_form(driver_doc.doctype, self.driver)
        frappe.msgprint(f"Driver Payment Data updated successfully for Driver: {driver_link}")

@frappe.whitelist()
def generate_waybill(daily_log):
    doc = frappe.get_doc("Daily Log", daily_log)
    if not doc.waybill_number:
        waybill = frappe.get_doc({
            "doctype": "Way Bill",
            "daily_log": doc.name,
        })
        waybill.insert(ignore_permissions=True)
        frappe.msgprint(f"Way Bill generated successfully: {waybill.name}")

        doc.waybill_number = waybill.name
        doc.save(ignore_permissions=True)
        return waybill.name
    else:
        frappe.throw(f"Way Bill already exists for this Daily Log: {doc.waybill_number}")
