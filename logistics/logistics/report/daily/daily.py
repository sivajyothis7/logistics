import frappe
from frappe import _, msgprint
from datetime import datetime

def execute(filters=None):
    if not filters:
        filters = {}

    data, columns = [], []

    columns = get_columns()
    cs_data = get_cs_data(filters)

    if not cs_data:
        msgprint(_('No records found'))
        return columns, cs_data

    return columns, cs_data, None

def get_columns():
    return [
        {
            'fieldname': 'company',
            'label': _('Company'),
            'fieldtype': 'Data',
            'width': '275'
        },
        {
            'fieldname': 'driver',
            'label': _('Driver'),
            'fieldtype': 'Data',
            'width': '275'
        },
        {
            'fieldname': 'date',
            'label': _('Date'),
            'fieldtype': 'Data',
            'width': '275'
        }
    ]

def get_cs_data(filters):
    conditions = get_conditions(filters)
    data = frappe.get_all(
        doctype='Daily Log',
        fields=['company', 'driver', 'date'],
        filters=conditions,
        order_by='date desc'
    )

    return data

def get_conditions(filters):
    conditions = {}
    
    if filters.get('from_date') and filters.get('to_date'):
        conditions['date'] = ['between', [filters.get('from_date'), filters.get('to_date')]]
    elif filters.get('from_date'):
        conditions['date'] = ['>=', filters.get('from_date')]
    elif filters.get('to_date'):
        conditions['date'] = ['<=', filters.get('to_date')]
    
    if filters.get('driver'):
        conditions['driver'] = filters.get('driver')
    
    if filters.get('company'):
        conditions['company'] = filters.get('company')

    return conditions
