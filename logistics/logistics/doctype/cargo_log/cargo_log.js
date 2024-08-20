// Copyright (c) 2024, siva and contributors
// For license information, please see license.txt

frappe.ui.form.on('Cargo Log', {
    charges: function(frm) {
        calculate_profit(frm);
    },
    cost_price: function(frm) {
        calculate_profit(frm);
    }
});

function calculate_profit(frm) {
    if (frm.doc.cost_price && frm.doc.charges) {
        frm.set_value('profit', frm.doc.cost_price - frm.doc.charges);
    }
}
