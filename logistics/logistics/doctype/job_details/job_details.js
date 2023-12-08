frappe.ui.form.on('Job Details', {
    refresh: function(frm) {
        // Call the set_dashboard_indicators method when the form is refreshed
        frm.events.set_dashboard_indicators(frm);

        // Add custom button for Accounting Ledger
        frm.add_custom_button(__('Accounting Ledger'), function() {
            frappe.set_route('query-report', 'Job Details Ledger', {
                company: frm.doc.company,
                party_type: 'Customer',
                party: frm.doc.customer,
                party_name: frm.doc.customer,
                custom_job_number: frm.doc.name
            });
        }, __('View'));

        // Add custom button to select Daily Logs without ADD
        frm.add_custom_button(__('Select Daily Logs'), function() {
            // MultiSelectDialog for individual child selection
            const dialog = new frappe.ui.form.MultiSelectDialog({
                doctype: "Daily Log",
                target: frm,
                setters: {
                    customer: frm.doc.customer,
                    date: null,
                },
                add_filters_group: 1,
                date_field: "transaction_date",
                columns: ["vehicle", "driver"],
                get_query() {
                    return {
                        filters: { docstatus: ['!=', 2] }
                    };
                },
                primary_action_label: 'Get Details',
                action(selections, args) {
                    // Iterate through selected items
                    selections.forEach(selectedItem => {
                        const logName = selectedItem;

                        // Check if the vehicle field is defined in the form
                        if (!frm.doc.vehicle) {
                            frm.doc.vehicle = [];
                        }

                        // Check if the log name is already in the list of selected logs
                        if (!frm.doc.vehicle.some(vehicle => vehicle.daily_log === logName)) {
                            frappe.call({
                                method: 'frappe.client.get',
                                args: {
                                    doctype: 'Daily Log',
                                    name: logName,
                                    filters: ['driver']
                                },
                                callback: function(response) {
                                    if (response.message) {
                                        const driverData = response.message;
                                        const daily_log = driverData.name;
                                        const driver = driverData.driver;
                                        const vehicle = driverData.vehicle_type;

                                        const newRow = frappe.model.add_child(frm.doc, 'Vehicle', 'vehicle');
                                        newRow.daily_log = daily_log;
                                        newRow.driver = driver;
                                        newRow.vehicle_name = vehicle;

                                        frm.refresh_field('vehicle');
                                        frappe.show_alert(__('<span style="color: green;">Daily Log "{0}" added successfully.</span>', [logName]), 6);
                                    } else {
                                        console.error('Error fetching Daily Log data.');
                                        frappe.show_alert(__('<span style="color: red;">Error fetching Daily Log data for "{0}".</span>', [logName]), 6);
                                    }
                                }
                            });
                        } else {
                            frappe.show_alert(__('<span style="color: red;">Daily Log "{0}" already exists in the list.</span>', [logName]), 6);
                        }
                    });

                    dialog.dialog.hide();
                }
            });
        });

        // Update Total Revenue and Expense logic
        frappe.call({
            method: 'logistics.logistics.doctype.job_details.job_details.calculate_and_get_total_revenue',
            args: {
                docname: frm.doc.name,
                filters: {
                    docstatus: 1
                }
            },
            callback: function(response) {
                if (response.message) {
                    const updatedTotalRevenue = response.message.total_revenue;
                    const updatedTotalExpense = response.message.total_expense;

                    frm.set_value('total_revenue', updatedTotalRevenue);
                    frm.set_value('total_expense', updatedTotalExpense);

                    frm.refresh_field('total_revenue');
                    frm.refresh_field('total_expense');

                    frappe.msgprint(
                        __('Total Revenue and Expense Updated Successfully.\nNew Total Revenue: {0}\nNew Total Expense: {1}', [
                            format_currency(updatedTotalRevenue, frm.doc.currency),
                            format_currency(updatedTotalExpense, frm.doc.currency)
                        ])
                    );
                } else {
                    console.error('Error updating total revenue and expense.');
                    frappe.msgprint(__('Error updating total revenue and expense.'));
                }
            }
        });

        // Rest of the code...
    },
    
    set_dashboard_indicators: function (frm) {
        frappe.call({
            method: 'frappe.client.get_list',
            args: {
                doctype: 'Sales Invoice',
                filters: {
                    custom_job_number: frm.doc.name,
                    docstatus: 1
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

                frappe.call({
                    method: 'frappe.client.get',
                    args: {
                        doctype: 'Job Details',
                        name: frm.doc.name
                    },
                    callback: function (jobDetailsResponse) {
                        var jobDetails = jobDetailsResponse.message;
    
                        var totalRevenue = jobDetails ? jobDetails.total_revenue : 0;
                        var totalExpense = jobDetails ? jobDetails.total_expense : 0;
                        var profitAndLoss = totalRevenue - totalExpense;
    
                        frm.dashboard.add_indicator(__('Total Billing: {0}', [format_currency(totalBilling, frm.doc.currency)]), 'blue');
                        frm.dashboard.add_indicator(__('Total Unpaid: {0}', [format_currency(totalUnpaid, frm.doc.currency)]), totalUnpaid ? 'red' : 'green');
                        frm.dashboard.add_indicator(__('Profit & Loss: {0}', [format_currency(profitAndLoss, frm.doc.currency)]), profitAndLoss >= 0 ? 'green' : 'red');
                    }
                });
                // Add indicators using data from Sales Invoices related to the selected Job Details
                // frm.dashboard.add_indicator(__('Total Billing: {0}', [format_currency(totalBilling, frm.doc.currency)]), 'blue');
                // frm.dashboard.add_indicator(__('Total Unpaid: {0}', [format_currency(totalUnpaid, frm.doc.currency)]), totalUnpaid ? 'red' : 'green');
            }
        });
    }
});
