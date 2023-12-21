frappe.ui.form.on('Drivers', {
    refresh: function(frm) {
        if (!frm.doc.__islocal && !frm.__is_reloaded) {
            calculate_totals(frm);
        }
        add_custom_button(frm);
        frm.events.set_dashboard_indicators(frm);
    },
    set_dashboard_indicators: function (frm) {
        frappe.call({
            method: 'frappe.client.get_list',
            args: {
                doctype: 'Purchase Invoice',
                filters: {
                    custom_driver_name: frm.doc.name,
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
                        doctype: 'Drivers',
                        name: frm.doc.name
                    },
                    callback: function (jobDetailsResponse) {
                        console.log(jobDetailsResponse)
                        var jobDetails = jobDetailsResponse.message;
                        var totalRevenue = jobDetails ? jobDetails.custom_billing : 0;
                        var totalExpense = jobDetails ? jobDetails.total_pending_rate : 0;
                        var profitAndLoss = totalExpense - totalBilling;
                        frm.dashboard.add_indicator(__('Total Billing: {0}', [format_currency(totalBilling, frm.doc.currency)]), 'blue');
                        frm.dashboard.add_indicator(__('Total Unpaid: {0}', [format_currency(totalUnpaid, frm.doc.currency)]), totalUnpaid ? 'red' : 'green');
                        frm.dashboard.add_indicator(__('Remaining: {0}', [format_currency(profitAndLoss, frm.doc.currency)]), profitAndLoss >= 0 ? 'green' : 'red');
                    }
                });
            }
        });
    }
});
function calculate_totals(frm) {
    frappe.call({
        method: 'logistics.logistics.doctype.drivers.drivers.get_totals',
        args: {
            docname: frm.doc.name
        },
        callback: function(response) {
            if (response.message) {
                frm.set_value('total_driver_rate', response.message.total_driver_rate);
                frm.set_value('total_pending_rate', response.message.total_pending_rate);
                frm.refresh_field('total_driver_rate');
                frm.refresh_field('total_pending_rate');
                frm.__is_reloaded = true;
            }
        }
    });
}
function add_custom_button(frm) {
    frm.add_custom_button('Create Supplier', function() {
        frappe.call({
            method: 'logistics.logistics.doctype.drivers.drivers.create_supplier',
            args: {
                docname: frm.doc.name
            },
            callback: function(response) {
                if (response.message) {
                    frappe.msgprint(response.message);
                    frm.reload_doc();
                }
            }
        });
    });
}












