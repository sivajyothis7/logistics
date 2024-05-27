import frappe
from frappe.model.document import Document

class DailyLog(Document):
    def on_update(self):
        try:
            self.update_driver_payment_data()
            self.generate_waybill_if_needed()
        except Exception as e:
            frappe.log_error(message=str(e), title="DailyLog on_update Error")
            frappe.throw(f"Error in on_update: {str(e)}")

    def update_driver_payment_data(self):
        try:
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
        except Exception as e:
            frappe.log_error(message=str(e), title="update_driver_payment_data Error")
            frappe.throw(f"Error in update_driver_payment_data: {str(e)}")

    def generate_waybill_if_needed(self):
        try:
            if not self.waybill_number:
                waybill = frappe.get_doc({
                    "doctype": "Way Bill",
                    "daily_log": self.name,
                })
                waybill.insert(ignore_permissions=True)
                frappe.msgprint(f"Way Bill generated successfully: {waybill.name}")

                self.waybill_number = waybill.name
                self.save(ignore_permissions=True)
        except Exception as e:
            frappe.log_error(message=str(e), title="generate_waybill_if_needed Error")
            frappe.throw(f"Error in generate_waybill_if_needed: {str(e)}")
