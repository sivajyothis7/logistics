frappe.ui.form.on("Job Details", {
    refresh: function(frm) {
        add_custom_buttons(frm);
        frm.events.set_dashboard_indicators(frm);
    },

    set_dashboard_indicators: function(frm) {
        function process_invoices(invoices, includeOutstanding = false) {
            var totals = { grandTotal: 0, outstandingTotal: 0 };
            if (invoices && invoices.length > 0) {
                invoices.forEach(function(invoice) {
                    totals.grandTotal += invoice.base_grand_total;
                    if (includeOutstanding) {
                        totals.outstandingTotal += invoice.outstanding_amount;
                    }
                });
            }
            return totals;
        }

        function process_journal_entries(entries) {
            var totalDebit = 0;
            if (entries && entries.length > 0) {
                entries.forEach(function(entry) {
                    totalDebit += entry.total_debit;
                });
            }
            return totalDebit;
        }

        frappe.call({
            method: 'frappe.client.get_list',
            args: {
                doctype: 'Sales Invoice',
                filters: {
                    custom_job_number: frm.doc.name,
                    docstatus: 1
                },
                fields: ['base_grand_total', 'outstanding_amount']
            },
            callback: function(response) {
                var salesInvoiceTotals = process_invoices(response.message, true);

                frappe.call({
                    method: 'frappe.client.get_list',
                    args: {
                        doctype: 'Journal Entry',
                        filters: {
                            custom_job_details: frm.doc.name,
                            docstatus: 1
                        },
                        fields: ['total_debit']
                    },
                    callback: function(response) {
                        var journalEntryTotalDebit = process_journal_entries(response.message);

                        var totalExpenses = journalEntryTotalDebit;
                        var profitAndLoss = salesInvoiceTotals.grandTotal - totalExpenses;

                        frm.dashboard.add_indicator(
                            __('Total Sales Invoice: {0}', [format_currency(salesInvoiceTotals.grandTotal, frm.doc.currency)]), 
                            'blue'
                        );
                        frm.dashboard.add_indicator(
                            __('Total Expenses: {0}', [format_currency(journalEntryTotalDebit, frm.doc.currency)]), 
                            'purple'
                        );
                        frm.dashboard.add_indicator(
                            __('Profit & Loss: {0}', [format_currency(profitAndLoss, frm.doc.currency)]), 
                            profitAndLoss >= 0 ? 'green' : 'red'
                        );

                        frm.profit_and_loss = profitAndLoss;
                        frm.total_sales_invoice = salesInvoiceTotals.grandTotal;
                    }
                });
            }
        });
    },

    after_save: function(frm) {
        if (frm.doc.status === "Closed" && frm.profit_and_loss !== undefined && frm.total_sales_invoice !== undefined) {
            var threshold = 0.3 * frm.total_sales_invoice;

            if (frm.profit_and_loss < threshold) {
                frappe.msgprint(__('Profit & Loss is less than 30% of the total sales. Cannot save or close the form.'));
                frappe.validated = false;
            }
        }
    },

    status: function(frm) {
        if (frm.profit_and_loss !== undefined && frm.total_sales_invoice !== undefined) {
            var threshold = 0.3 * frm.total_sales_invoice;

            if (frm.profit_and_loss < threshold && frm.doc.status === "Closed") {
                frappe.msgprint(__('Profit & Loss is less than 30% of the total sales. Cannot mark the job as Closed.'));
                frm.set_value('status', 'In progress');
                setTimeout(function() {
                    frm.save();
                }, 3000);  
            }
        }
    }
});

function add_custom_buttons(frm) {
    frm.add_custom_button(__('Select Daily Logs'), function() {
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
                selections.forEach(selectedItem => {
                    const logName = selectedItem;
                    if (!frm.doc.vehicle) {
                        frm.doc.vehicle = [];
                    }
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
}
