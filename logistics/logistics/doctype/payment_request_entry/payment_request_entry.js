// Copyright (c) 2024, siva and contributors
// For license information, please see license.txt

frappe.ui.form.on('Payment Request Entry', {
    refresh: calculate_total_amount,
    onload_post_render: calculate_total_amount,
    validate: calculate_total_amount,
});

frappe.ui.form.on('Payment Request Details', {
    amount: calculate_total_amount,
    payment_request_details_remove: calculate_total_amount,
    payment_request_details_add: calculate_total_amount,
});

function calculate_total_amount(frm) {
    const total = (frm.doc.payment_request_details || []).reduce((sum, row) => sum + (row.amount || 0), 0);
    frm.set_value('final_amount', total);
}
