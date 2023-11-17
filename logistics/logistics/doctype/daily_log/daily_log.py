# Copyright (c) 2023, siva and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class DailyLog(Document):
    pass
    # def get_query(self, doc):
    #     return f"""
    #         SELECT
    #             name
    #         FROM
    #             `tabVehicles`
    #         WHERE
    #             driver = '{doc.driver}'
    #     """
