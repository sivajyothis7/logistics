frappe.ui.form.on('Daily Log', {
    refresh: function(frm) {
        if (!frm.is_new()) {
            add_custom_button(frm);
        }
    },

    driver_rate: function(frm) {
        calculateDriverPendingRate(frm);
    },

    driver_advance: function(frm) {
        calculateDriverPendingRate(frm);
    },

    payment_status: function(frm) {
        if (frm.doc.payment_status === 'Cleared') {
            frm.set_value('pending_driver_rate', 0);
            frm.set_df_property('pending_driver_rate', 'read_only', false);
        } else {
            calculateDriverPendingRate(frm);
        }
    },

    before_save: function(frm) {
        if (frm.doc.pending_driver_rate < 0) {
            frappe.msgprint(__('Driver Pending Rate cannot be a negative value.'));
            frappe.validated = false;
            return;
        }
    },
});

function calculateDriverPendingRate(frm) {
    var driverRate = frm.doc.driver_rate || 0;
    var driverAdvance = frm.doc.driver_advance || 0;

    var driverPendingRate = driverRate - driverAdvance;

    frm.set_value('pending_driver_rate', driverPendingRate);
}

function add_custom_button(frm) {
    frm.add_custom_button(__('Generate Waybill'), function() {
        frappe.call({
            method: 'logistics.logistics.doctype.daily_log.daily_log.generate_waybill',
            args: {
                daily_log: frm.doc.name
            },
            callback: function(response) {
                if (response.message) {
                    frm.set_value('waybill_number', response.message);
                    frm.reload_doc();
                    frappe.msgprint(__('Waybill generated successfully.'));
                }
            }
        });
    });
}
