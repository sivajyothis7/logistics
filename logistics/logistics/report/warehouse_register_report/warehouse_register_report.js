// Copyright (c) 2024, siva and contributors
// For license information, please see license.txt

frappe.query_reports["Warehouse Register Report"] = {
    "filters": [
        {
            "fieldname": "warehouse_name",
            "label": __("Warehouse Name"),
            "fieldtype": "Data",
            "reqd": 0
        },
        {
            "fieldname": "customer",
            "label": __("Customer"),
            "fieldtype": "Link",
			"options": "Customer",

            "default": "",
            "reqd": 0
        },
        {
            "fieldname": "posting_date",
            "label": __("Date"),
            "fieldtype": "Date",
            "default": frappe.datetime.get_today(),
            "reqd": 0
        }
    ],
    "onload": function(report) {
        console.log("Report Loaded: Warehouse Register Report");
    },
    "formatter": function(value, row, column, data, default_formatter) {
        value = default_formatter(value, row, column, data);
        return value;
    },
    "get_data": function(filters) {
        frappe.call({
            method: "frappe.desk.query_report.run",
            args: {
                report_name: "Warehouse Register Report",
                filters: filters
            },
            callback: function(r) {
                if (r.message) {
                    console.log("Report Data", r.message);
                }
            }
        });
    }
};
