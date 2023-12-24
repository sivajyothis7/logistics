# Copyright (c) 2023, siva and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class WayBill(Document):
    def before_save(self):
        if not self.get('waybill'):
            last_way_bill = frappe.get_all('Way Bill', filters={}, fields=['waybill'], order_by='cast(waybill as unsigned) DESC', limit_page_length=1)

            last_way_bill_value = last_way_bill[0].get('waybill') if last_way_bill else None

            next_way_bill_number = int(last_way_bill_value) + 1 if last_way_bill_value is not None else 1

            next_way_bill_number_formatted = '{:06}'.format(next_way_bill_number)

            self.waybill = str(next_way_bill_number_formatted)
