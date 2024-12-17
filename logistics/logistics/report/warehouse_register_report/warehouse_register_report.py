# Copyright (c) 2024, siva and contributors
# For license information, please see license.txt

import frappe
from frappe import _

def execute(filters=None):
    columns, data = [], []
    columns = get_columns()
    data = get_data(filters)
    return columns, data

def get_columns():
    return [
        {"label": _("Warehouse Name"), "fieldtype": "Data", "options": "Warehouse Register", "width": 180},
        {"label": _("Customer"), "fieldtype": "Data", "width": 150},
        {"label": _("Date"), "fieldtype": "Date", "width": 120},
        {"label": _("Total IN"), "fieldtype": "Float", "width": 100},
        {"label": _("Total OUT"), "fieldtype": "Float", "width": 100},
        {"label": _("Net Billing Space"), "fieldtype": "Float", "width": 150}
    ]

def get_data(filters):
    conditions = ""
    values = []

    if filters.get("warehouse_name"):
        conditions += "AND wr.warehouse_name = %s "
        values.append(filters.get("warehouse_name"))
    if filters.get("customer"):
        conditions += "AND wr.customer = %s "
        values.append(filters.get("customer"))
    if filters.get("posting_date"):
        conditions += "AND wr.posting_date = %s "
        values.append(filters.get("posting_date"))

    data = []
    warehouse_registers = frappe.db.sql("""
        SELECT 
            wr.name, wr.warehouse_name, wr.customer, wr.posting_date
        FROM `tabWarehouse Register` wr
        WHERE 1=1 {conditions}
    """.format(conditions=conditions), values, as_dict=True)

    for wr in warehouse_registers:
        total_in = 0
        total_out = 0

        activities = frappe.get_all("Warehouse Activity",
            filters={"parent": wr.name},
            fields=["activity", "billing_space"]
        )

        for activity in activities:
            if activity.activity == "IN":
                total_in += activity.billing_space or 0
            elif activity.activity == "OUT":
                total_out += activity.billing_space or 0

        net_billing_space = total_in - total_out

        data.append([
            wr.warehouse_name,
            wr.customer,
            wr.posting_date,
            total_in,
            total_out,
            net_billing_space
        ])

    return data
