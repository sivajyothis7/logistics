frappe.ui.form.on('Drivers', {
    refresh: function(frm) {
        if (!frm.doc.__islocal && !frm.__is_reloaded) {
            calculate_totals(frm);
        }

        add_custom_button(frm);
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

frappe.ui.form.on('Drivers', {
    refresh: function(frm) {
        if (!frm.doc.__islocal && !frm.__is_reloaded) {
            calculate_totals(frm);
            add_custom_button(frm);
        }
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
