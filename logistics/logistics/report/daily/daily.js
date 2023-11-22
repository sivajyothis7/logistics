frappe.query_reports["Daily"] = {
    "filters": [
        {
            "fieldname": "company",
            "label": __("Company"),
            "fieldtype": "Link",
            "options": "Company",
            "default": frappe.defaults.get_user_default("company")
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
            "fieldname": "from",
            "label": __("From Location"),
            "fieldtype": "Data", 
        },
        {
            "fieldname": "to",
            "label": __("To Location"),
            "fieldtype": "Data", 
        },
        
    
    ],
};
