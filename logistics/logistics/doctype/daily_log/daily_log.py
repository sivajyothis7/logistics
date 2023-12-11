# Copyright (c) 2023, siva and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class DailyLog(Document):
    
    def before_save(self):
        self.validate_payment()

    def validate_payment(self):
        try:
            driver_doc = frappe.get_doc("Drivers", self.driver)
            
            existing_payment_data = next((data for data in driver_doc.payment_data if data.daily_log == self.name), None)

            if existing_payment_data:
                existing_payment_data.update({
                    "company_rate": self.company_rate,
                    "driver_rate": self.driver_rate,
                    "driver_advance": self.driver_advance,
                    "pending_driver_rate": self.pending_driver_rate,
                })
            else:
                payment_data = {
                    "daily_log": self.name,
                    "company_rate": self.company_rate,
                    "driver_rate": self.driver_rate,
                    "driver_advance": self.driver_advance,
                    "pending_driver_rate": self.pending_driver_rate,
                }
                driver_doc.append("payment_data", payment_data)

            driver_doc.save(ignore_permissions=True)
            frappe.msgprint("Driver Payment Data updated successfully for driver: {}".format(self.driver))
        except frappe.DoesNotExistError:
            frappe.msgprint("Error: Could not find Driver with name {}".format(self.driver))
        except Exception as e:
            frappe.msgprint("Error: {}".format(str(e)))


    # def get_query(self, doc):
    #     return f"""
    #         SELECT
    #             name
    #         FROM
    #             `tabVehicles`
    #         WHERE
    #             driver = '{doc.driver}'
    #     """
