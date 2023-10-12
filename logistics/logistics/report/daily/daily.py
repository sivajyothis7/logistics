# Copyright (c) 2023, siva and contributors
# For license information, please see license.txt

import frappe
from frappe import _

def execute(filters=None):
    columns = [
        _("Date") + ":Date:90",
        _("Driver") + ":Link/Driver:120",
        _("Driver Name") + ":Data:150",
        _("Vehicle Number") + ":Data:120",
        _("Starting Location") + ":Data:150",
        _("Destination") + ":Data:150",
        _("Company Rate") + ":Data:120",
        _("Driver Rate") + ":Data:120",
    ]

    data = frappe.db.sql(
        """
        SELECT Date, Driver, Driver_Name, Vehicle, `From`, `To`, Company_Rate, Driver_Rate
        FROM `tabDaily Log`
        # ORDER BY Date DESC
        # """.format(filters and f"AND Date = '{filters.date}'" or ''),
        # as_dict=True,
    )

    return columns, data
