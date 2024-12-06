frappe.ui.form.on('Warehouse Management', {
    refresh: function (frm) {
        frm.trigger('calculate_total_rent');
        frm.trigger('calculate_occupied_space');
    },

    validate: function (frm) {
        frm.trigger('calculate_total_rent');
        frm.trigger('calculate_occupied_space');
    },

    calculate_total_rent: function (frm) {
        let total_rent = 0;

        (frm.doc.rental_details || []).forEach(function (row) {
            total_rent += row.total_amount || 0;
        });

        frm.set_value('total_rent', total_rent);
    },

    calculate_occupied_space: function (frm) {
        let total_occupied_space = 0;

        (frm.doc.rental_details || []).forEach(function (row) {
            if (row.current_status === 'Occupied') {
                total_occupied_space += row.rent_space || 0;
            }
        });

        frm.set_value('occupied_space', total_occupied_space);

        let remaining_space = (frm.doc.total_space || 0) - total_occupied_space;
        frm.set_value('remaining_space', remaining_space);
    }
});
