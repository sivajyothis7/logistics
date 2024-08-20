# Copyright (c) 2024, siva and contributors
# For license information, please see license.txt

import frappe
from frappe import _

def get_conditions(filters):
    conditions = {}

    if filters.get('from_date') and filters.get('to_date'):
        conditions['date'] = ['between', [filters.get('from_date'), filters.get('to_date')]]
    elif filters.get('from_date'):
        conditions['date'] = ['>=', filters.get('from_date')]
    elif filters.get('to_date'):
        conditions['date'] = ['<=', filters.get('to_date')]

    if filters.get('mode_of_transport'):
        conditions['mode_of_transport'] = filters.get('mode_of_transport')

    return conditions

def execute(filters=None):
    columns = [
        {"label": "Mode of Transport", "fieldname": "mode_of_transport", "fieldtype": "Data", "width": 200},
        {"label": "Total Cost", "fieldname": "total_cost", "fieldtype": "Currency", "width": 150},
        {"label": "Total Profit", "fieldname": "total_profit", "fieldtype": "Currency", "width": 150},
        {"label": "Total Charges", "fieldname": "total_charge", "fieldtype": "Currency", "width": 150},
    ]

    conditions = get_conditions(filters)

    data = frappe.get_all(
        'Cargo Log',
        fields=[
            'mode_of_transport',
            'SUM(cost_price) as total_cost',
            'SUM(profit) as total_profit',
            'SUM(charges) as total_charge'
        ],
        filters=conditions,
        group_by='mode_of_transport',
        # as_dict=True
    )

    if not data:
        frappe.msgprint(_('No records found'))

    return columns, data
