frappe.query_reports["Sales Report"] = {
    "filters": [
        
        // {
        //     "fieldname": "customer",
        //     "label": __("Customer"),
        //     "fieldtype": "Link",
        //     "options": "Customer",
        // },
        // {
        //     "fieldname": "driver",
        //     "label": __("Driver"),
        //     "fieldtype": "Link",
        //     "options": "Drivers",
        // },
       
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
          
        // {
        //     "fieldname": "vehicle_type",
        //     "label": __("Vehicle Type"),
        //     "fieldtype": "Data", 
        // },
       
		{
            "fieldname": "company",
            "label": __("Company"),
            "fieldtype": "Link",
            "options": "Company",
            "default": frappe.defaults.get_user_default("company")
        },
        
    
    ],
};
