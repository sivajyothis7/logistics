frappe.query_reports["Daily Log Report"] = {
    "filters": [
        
        {
            "fieldname": "customer",
            "label": __("Customer"),
            "fieldtype": "Link",
            "options": "Customer",
        },
        {
            "fieldname": "driver",
            "label": __("Driver"),
            "fieldtype": "Link",
            "options": "Drivers",
        },
       
        {
            "fieldname": "from_date",
            "label": __("From Date"),
            "fieldtype": "Date",
        },
        {
            "fieldname": "to_date",
            "label": __("To Date"),
            "fieldtype": "Date",
        },
          
        {
            "fieldname": "vehicle_type",
            "label": __("Vehicle Type"),
            "fieldtype": "Data", 
        },
       
        {
            "fieldname": "from",
            "label": __("From Location"),
            "fieldtype": "Data", 
        },
        {
            "fieldname": "to",
            "label": __("To Location"),
            "fieldtype": "Data", 
        },
		{
            "fieldname": "company",
            "label": __("Company"),
            "fieldtype": "Link",
            "options": "Company",
            "default": frappe.defaults.get_user_default("company")
        },
        {
            "fieldname": "way_bill_collected",
            "label": __("Way bill collected?"),
            "fieldtype": "Check",
        },
        
    
    ],
};
