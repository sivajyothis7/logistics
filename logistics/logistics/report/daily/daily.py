import frappe
from frappe import _

def execute(filters=None):
    columns = [
        _("Date") + ":Date:90",
        _("Driver") + ":Link/Driver:120",
       
       
        
    ]

    # Construct the SQL query with a WHERE clause for filtering
    conditions = []
    if filters:
        if filters.get("from_date"):
            conditions.append(f"`Date` >= '{filters['from_date']}'")
        if filters.get("to_date"):
            conditions.append(f"`Date` <= '{filters['to_date']}'")

    condition_str = " AND ".join(conditions) if conditions else ""

    data = frappe.db.sql(
        f"""
        SELECT Date, Driver, Vehicle, `From`, `To`, 
        FROM `tabDaily Log`
        WHERE {condition_str}
        # ORDER BY Date DESC
        """,
        as_dict=True,  # Assuming you want the result as a list of dictionaries
    )

    return columns, data
