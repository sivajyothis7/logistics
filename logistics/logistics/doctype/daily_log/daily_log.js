// Copyright (c) 2023, siva and contributors
// For license information, please see license.txt

frappe.ui.form.on('Daily Log', {
    refresh: function(frm) {
        frm.fields_dict['vehicle'].get_query = function(doc) {
            return {
                filters: [
                    ['current_driver', '=', doc.driver]
                ]
            };
        };
    }
});
