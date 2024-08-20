// Copyright (c) 2024, siva and contributors
// For license information, please see license.txt

frappe.query_reports["Cargo Log Report"] = {
    "filters": [
        {
            "fieldname": "mode_of_transport",
            "label": __("Mode of Transport"),
            "fieldtype": "Select",
            "options": "\nAir\nSea",
            "default": ""  
        },
        {
            "fieldname": "from_date",
            "label": __("From Date"),
            "fieldtype": "Date",
            "default": frappe.datetime.add_days(frappe.datetime.nowdate(), -30)  
        },
        {
            "fieldname": "to_date",
            "label": __("To Date"),
            "fieldtype": "Date",
            "default": frappe.datetime.nowdate() 
        },
    ],

    "onload": function(report) {
        report.page.add_inner_button(__("Refresh"), function() {
            report.refresh();
        });
    },

    "formatter": function(value, row, column, data, default_formatter) {
        value = default_formatter(value, row, column, data);

        if (column.fieldname === "total_profit") {
            if (data.total_profit < 0) {
                value = `<span style="color:red;">${value}</span>`;
            } else {
                value = `<span style="color:green;">${value}</span>`;
            }
        }

        return value;
    },

    "get_data": function(filters) {
        return frappe.call({
            method: "frappe.desk.query_report.get_data",
            args: {
                report_name: "Cargo Log Report",
                filters: filters
            }
        }).then(function(response) {
            return response.message;
        });
    }
};
