import frappe
from frappe.model.document import Document

class DailyLog(Document):
    
    def on_update(self):
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
        frappe.msgprint("Driver Payment Data updated successfully for Driver: {}".format(driver_link))