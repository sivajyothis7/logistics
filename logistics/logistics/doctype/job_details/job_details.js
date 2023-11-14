frappe.ui.form.on('Job Details', {
    refresh: function (frm) {
        if (frm.doc.__islocal) {
            // If the Job Details is unsaved, do nothing
            return;
        }

        // Call the set_dashboard_indicators method when the form is refreshed
        frm.events.set_dashboard_indicators(frm);

        // Add custom button for Accounting Ledger
        frm.add_custom_button(__('Accounting Ledger'), function () {
            frappe.set_route('query-report', 'Job Details Ledger',
                { party_type: 'Customer', party: frm.doc.customer, party_name: frm.doc.customer,custom_job_number: frm.doc.name});
        }, __('View'));
    },

    set_dashboard_indicators: function (frm) {
        // Fetch linked Sales Invoices related to the selected Job Details
        frappe.call({
            method: 'frappe.client.get_list',
            args: {
                doctype: 'Sales Invoice',
                filters: {
                    custom_job_number: frm.doc.name
                },
                fields: ['grand_total', 'outstanding_amount']
            },
            callback: function (response) {
                var invoices = response.message;
                var totalBilling = 0;
                var totalUnpaid = 0;
                if (invoices && invoices.length > 0) {
                    invoices.forEach(function (invoice) {
                        totalBilling += invoice.grand_total;
                        totalUnpaid += invoice.outstanding_amount;
                    });
                }

                // Add indicators using data from Sales Invoices related to the selected Job Details
                frm.dashboard.add_indicator(__('Total Billing: {0}', [format_currency(totalBilling, frm.doc.currency)]), 'blue');
                frm.dashboard.add_indicator(__('Total Unpaid: {0}', [format_currency(totalUnpaid, frm.doc.currency)]), totalUnpaid ? 'red' : 'green');
            }
        });
    }
});


//     refresh: function(frm) {
//         // Maintain a list of selected log names
//         const selectedLogs = [];
//         frm.add_custom_button(__('Select Daily Log'), function() {
//             // MultiSelectDialog for individual child selection
//             const dialog = new frappe.ui.form.MultiSelectDialog({
//                 doctype: "Daily Log",
//                 target: frm,
//                 setters: {
//                     company: null,
//                     date: null,
//                 },
//                 add_filters_group: 1,
//                 date_field: "transaction_date",
//                 columns: ["vehicle", "driver"],
//                 get_query() {
//                     return {
//                         filters: { docstatus: ['!=', 2] }
//                     };
//                 },
//                 primary_action_label: 'Get Details',
//                 action(selections, args) {
//                     // Iterate through selected items
//                     selections.forEach(selectedItem => {
//                         const logName = selectedItem;
//                         // Check if the log name is already in the list of selected logs
//                         // if (!selectedLogs.includes(logName)) {
//                             frappe.call({
//                                 method: 'frappe.client.get',
//                                 args: {
//                                     doctype: 'Daily Log',
//                                     name: logName,
//                                     filters: ['driver']
//                                 },
//                                 callback: function(response) {
//                                     if (response.message && (!selectedLogs.includes(logName))) {
//                                         console.log(response.message);
//                                         const driverData = response.message;
//                                         const daily_log = driverData.name;
//                                         const driver = driverData.driver;
//                                         const vehicle = driverData.vehicle_number;
//                                         const newRow = frm.add_child('vehicle');
//                                         newRow.daily_log = daily_log;
//                                         newRow.driver = driver;
//                                         newRow.vehicle_name = vehicle;
//                                         frm.refresh_field('vehicle');
//                                         // Add the log name to the list of selected logs
//                                         selectedLogs.push(logName);
//                                         frappe.show_alert(__('<span style="color: green;">Daily Log "{0}" added successfully.</span>', [logName]),6);
										
//                                     }else {
//                                         console.error('Error fetching Daily Log data.');
// 										frappe.show_alert(__('<span style="color: red;">Daily Log "{0}" already Exists.</span>', [logName]),6);

//                                     }
									
//                                 }
//                             });
                        
//                     });
//                     dialog.dialog.hide();				 
// 				   }
//             });
//         });
//     }
// });
