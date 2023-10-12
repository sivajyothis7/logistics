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
        }
    ],
    "onload": function(report) {
        // Get filter values
        const filters = report.get_values();
        const company = filters.company;
        const driver = filters.driver;
        const from_date = filters.from_date;
        const to_date = filters.to_date;

        // Construct a condition to filter the report data
        const condition = [];
        if (company) {
            condition.push(`company="${company}"`);
        }
        if (driver) {
            condition.push(`driver="${driver}"`);
        }
        if (from_date) {
            condition.push(`transaction_date >= '${from_date}'`);
        }
        if (to_date) {
            condition.push(`transaction_date <= '${to_date}'`);
        }

        // Combine conditions with 'AND'
        const combined_condition = condition.join(" AND ");

        // Set the report condition
        report.conditions = combined_condition;
		console.log('Filters:', filters);
console.log('Condition:', combined_condition);
console.log('Report Conditions:', report.conditions);

        // Refresh the report to apply the filters
        report.refresh();
    }
};
