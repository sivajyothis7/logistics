import frappe
from frappe.model.document import Document

class DailyLog(Document):

    def on_update(self):
        try:
            driver_doc = frappe.get_doc("Drivers", self.pay_to)

            existing_payment_data = next(
                (data for data in driver_doc.payment_data if data.daily_log == self.name), None)

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

            driver_link = frappe.utils.get_link_to_form(driver_doc.doctype, self.pay_to)
            frappe.msgprint("Driver Payment Data updated successfully for Driver: {}".format(driver_link))

            self.generate_way_bill()

        except Exception as e:
            frappe.msgprint(f"Error updating Driver Payment Data: {str(e)}")

    def generate_way_bill(self):
        if self.way_bill_collected:
            try:
                if not self.waybill_number:
                    way_bill = frappe.get_doc({
                        "doctype": "Way Bill",
                        "daily_log": self.name,
                        "date": frappe.utils.today(),
                    })

                    way_bill.insert(ignore_permissions=True)
                    frappe.msgprint(f"Way Bill generated successfully: {way_bill.name}")

                    self.waybill_number = way_bill.name
                    self.save(ignore_permissions=True)
                else:
                    way_bill = frappe.get_doc("Way Bill", self.waybill_number)
                    way_bill.update({
                        "daily_log": self.name,
                        "date": frappe.utils.today(),
                    })

                    way_bill.save(ignore_permissions=True)
                    frappe.msgprint(f"Way Bill updated successfully: {way_bill.name}")

            except Exception as e:
                frappe.msgprint(f"Error generating/updating Way Bill: {str(e)}")

        else:
            frappe.msgprint("Way Bill generation is only allowed if Way bill collected is Checked.")


# @frappe.whitelist()
# def generate_wayy_bill(docname):
#     doc = frappe.get_doc("Daily Log", docname)
#     doc.generate_way_bill()
