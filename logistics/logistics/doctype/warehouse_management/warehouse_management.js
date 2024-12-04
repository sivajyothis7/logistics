// Copyright (c) 2024, siva and contributors
// For license information, please see license.txt

frappe.ui.form.on('Warehouse Management', {
    refresh: function(frm) {
        // Automatically calculate total rent when the form is refreshed
        frm.trigger('calculate_total_rent');
        frm.save()
    },

    // This will trigger on saving the document, after any changes to the child table
    validate: function(frm) {
        frm.trigger('calculate_total_rent');
    },

    // Calculate the total rent based on the child table 'rental_details'
    calculate_total_rent: function(frm) {
        let total_rent = 0;

        // Loop through the rental_details child table to sum up total_amount
        frm.doc.rental_details.forEach(function(row) {
            total_rent += row.total_amount || 0;
        });

        // Update the total_rent field in the Warehouse Management form
        frm.set_value('total_rent', total_rent);
    }
});
