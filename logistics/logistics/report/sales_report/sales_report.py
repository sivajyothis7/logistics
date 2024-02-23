import frappe
from frappe import _, msgprint
from datetime import datetime

def execute(filters=None):
    if not filters:
        filters = {}

    data, columns = [], []

    columns = get_columns()
    cs_data = get_cs_data(filters)
    # chart = get_chart(cs_data)

    if not cs_data:
        msgprint(_('No records found'))
        return columns, cs_data,None

    total_company_rate = sum([float(row.get('company_rate') or 0) for row in cs_data])
    total_driver_rate = sum([float(row.get('driver_rate') or 0) for row in cs_data])
    total_vehicle_type = len(set([row['vehicle_type'] for row in cs_data if row.get('vehicle_type')]))

    for row in cs_data:
        company_rate = float(row.get('company_rate') or 0)
        driver_rate = float(row.get('driver_rate') or 0)
        row['profit_loss'] = company_rate - driver_rate


    total_profit_loss = sum([row['profit_loss'] for row in cs_data])

    cs_data.append({
        'name': 'TOTAL',
        'company_rate': total_company_rate,
        'driver_rate': total_driver_rate,
        'vehicle_type': total_vehicle_type,
        'profit_loss': total_profit_loss
    })

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
        {
            'fieldname': 'profit_loss',
            'label': _('Profit/Loss'),
            'fieldtype': 'Data',
            'width': '125'
        }
    ]

def get_cs_data(filters):
    conditions = get_conditions(filters)
    data = frappe.get_all(
        doctype='Daily Log',
        fields=['name', 'customer', 'driver', 'date', 'vehicle_type', 'company_rate', 'driver_rate'],
        filters=conditions,
        order_by='date desc'
    )

    return data

# def get_chart(data):
#     labels = []
#     values = []
#     for row in data:
#         if row['company_rate'] is not None:
#             labels.append(row['name'])
#             values.append(float(row['company_rate']))
#     return {
#         "data": {
#             "labels": labels,
#             "datasets": [{
#                 "name": "Company Rate",
#                 "values": values
#             }]
#         },
#         "type": "pie"
#     }

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

    if filters.get('vehicle_type'):
        conditions['vehicle_type'] = filters.get('vehicle_type')

    if filters.get('way_bill_collected'):
        conditions['way_bill_collected'] = filters.get('way_bill_collected')

    if filters.get('customer'):
        conditions['customer'] = filters.get('customer')

    if filters.get('company'):
        conditions['company'] = filters.get('company')

    return conditions
