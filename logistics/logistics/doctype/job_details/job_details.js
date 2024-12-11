frappe.ui.form.on("Job Details", {
    refresh: function (frm) {
        add_custom_buttons(frm);
        frm.events.set_dashboard_indicators(frm);
    },

    set_dashboard_indicators: function (frm) {
        function process_invoices(invoices, includeOutstanding = false, totalField = 'base_total') {
            let totals = { grandTotal: 0, outstandingTotal: 0 };
            if (invoices && invoices.length > 0) {
                invoices.forEach((invoice) => {
                    totals.grandTotal += invoice[totalField] || 0;
                    if (includeOutstanding) {
                        totals.outstandingTotal += invoice.outstanding_amount || 0;
                    }
                });
            }
            return totals;
        }

        function process_journal_entries(entries) {
            let totalDebit = 0;
            if (entries && entries.length > 0) {
                entries.forEach((entry) => {
                    totalDebit += entry.total_debit || 0;
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
                    docstatus: 1,
                },
                fields: ['base_total', 'outstanding_amount'],
            },
            callback: function (response) {
                let salesInvoiceTotals = process_invoices(response.message, true, 'base_total');

                frappe.call({
                    method: 'frappe.client.get_list',
                    args: {
                        doctype: 'Purchase Invoice',
                        filters: {
                            custom_job_number: frm.doc.name,
                            docstatus: 1,
                        },
                        fields: ['base_grand_total', 'outstanding_amount'],
                    },
                    callback: function (response) {
                        let purchaseInvoiceTotals = process_invoices(response.message, true, 'base_grand_total');

                        frappe.call({
                            method: 'frappe.client.get_list',
                            args: {
                                doctype: 'Journal Entry',
                                filters: {
                                    custom_job_details: frm.doc.name,
                                    docstatus: 1,
                                },
                                fields: ['total_debit'],
                            },
                            callback: function (response) {
                                let journalEntryTotalDebit = process_journal_entries(response.message);

                                let totalExpenses = purchaseInvoiceTotals.grandTotal + journalEntryTotalDebit;
                                let profitAndLoss = salesInvoiceTotals.grandTotal - totalExpenses;

                                frm.dashboard.add_indicator(
                                    __('Total Sales Invoice: {0}', [format_currency(salesInvoiceTotals.grandTotal, frm.doc.currency)]),
                                    'blue'
                                );
                                frm.dashboard.add_indicator(
                                    __('Total Purchase Invoice: {0}', [format_currency(purchaseInvoiceTotals.grandTotal, frm.doc.currency)]),
                                    'orange'
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
                            },
                        });
                    },
                });
            },
        });
    },

    after_save: function (frm) {
        if (frm.doc.status === "Closed" && frm.profit_and_loss !== undefined && frm.total_sales_invoice !== undefined) {
            let threshold = 0.3 * frm.total_sales_invoice;

            if (frm.profit_and_loss < threshold) {
                frappe.msgprint(__('Profit & Loss is less than 30% of the total sales. Cannot save or close the form.'));
                frappe.validated = false;
            }
        }
    },

    status: function (frm) {
        if (frm.profit_and_loss !== undefined && frm.total_sales_invoice !== undefined) {
            let threshold = 0.2 * frm.total_sales_invoice;

            if (frm.profit_and_loss < threshold && frm.doc.status === "Closed") {
                frappe.msgprint(__('Profit & Loss is less than 20% of the total sales. Cannot mark the job as Closed.'));
                frm.set_value('status', 'In progress');
                setTimeout(function () {
                    frm.save();
                }, 3000);
            }
        }
    },
});

function add_custom_buttons(frm) {
    frm.add_custom_button(__('Select Daily Logs'), function () {
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
                    filters: { docstatus: ['!=', 2] },
                };
            },
            primary_action_label: 'Get Details',
            action(selections) {
                selections.forEach((selectedItem) => {
                    const logName = selectedItem;
                    if (!frm.doc.vehicle) {
                        frm.doc.vehicle = [];
                    }
                    if (!frm.doc.vehicle.some((vehicle) => vehicle.daily_log === logName)) {
                        frappe.call({
                            method: 'frappe.client.get',
                            args: {
                                doctype: 'Daily Log',
                                name: logName,
                            },
                            callback: function (response) {
                                if (response.message) {
                                    const { name, driver, vehicle_type } = response.message;
                                    let newRow = frappe.model.add_child(frm.doc, 'Vehicle', 'vehicle');
                                    newRow.daily_log = name;
                                    newRow.driver = driver;
                                    newRow.vehicle_name = vehicle_type;
                                    frm.refresh_field('vehicle');
                                    frappe.show_alert(
                                        __('Daily Log "{0}" added successfully.', [logName]),
                                        6
                                    );
                                } else {
                                    frappe.show_alert(
                                        __('Error fetching Daily Log data for "{0}".', [logName]),
                                        6
                                    );
                                }
                            },
                        });
                    } else {
                        frappe.show_alert(
                            __('Daily Log "{0}" already exists in the list.', [logName]),
                            6
                        );
                    }
                });
                dialog.dialog.hide();
            },
        });
    });
}
