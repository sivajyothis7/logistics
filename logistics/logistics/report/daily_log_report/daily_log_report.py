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
            'fieldname': 'name',
            'label': _('Name'),
            'fieldtype': 'Link',
            'options': 'Daily Log',
            'width': '225'
        },
        # {
        #     'fieldname': 'company',
        #     'label': _('Company'),
        #     'fieldtype': 'Data',
        #     'width': '175'
        # },
        {
            'fieldname': 'customer',
            'label': _('Customer'),
            'fieldtype': 'Data',
            'width': '125'
        },
        {
            'fieldname': 'driver',
            'label': _('Driver'),
            'fieldtype': 'Data',
            'width': '125'
        },
        {
            'fieldname': 'date',
            'label': _('Date'),
            'fieldtype': 'Data',
            'width': '125'
        },
        {
            'fieldname': 'vehicle_type',
            'label': _('Vehicle Type'),
            'fieldtype': 'Data',
            'width': '125'
        },
        {
            'fieldname': 'from',
            'label': _('From'),
            'fieldtype': 'Data',  
            'width': '125'
        },
        {
            'fieldname': 'to',
            'label': _('To'),
            'fieldtype': 'Data',  
            'width': '125'
        },
        {
            'fieldname': 'company_rate',
            'label': _('Company Rate'),
            'fieldtype': 'Data',  
            'width': '125'
        },
        {
            'fieldname': 'driver_rate',
            'label': _('Driver Rate'),
            'fieldtype': 'Data',  
            'width': '125'
        },
    ]

def get_cs_data(filters):
    conditions = get_conditions(filters)
    data = frappe.get_all(
        doctype='Daily Log',
        fields=['name', 'company','customer','driver', 'date', 'from', 'to', 'company_rate', 'driver_rate','vehicle_type'],
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

    if filters.get('customer'):
        conditions['customer'] = filters.get('customer')

    if filters.get('company'):
        conditions['company'] = filters.get('company')

    if filters.get('from'):
        conditions['from'] = ['=', filters.get('from')]
    if filters.get('to'):
        conditions['to'] = ['=', filters.get('to')]

    return conditions
