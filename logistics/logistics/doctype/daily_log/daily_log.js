frappe.ui.form.on('Daily Log', {
    refresh: function(frm) {
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
    }
});

function calculateDriverPendingRate(frm) {
    var driverRate = frm.doc.driver_rate || 0;
    var driverAdvance = frm.doc.driver_advance || 0;
    
    var driverPendingRate = driverRate - driverAdvance;

    frm.set_value('pending_driver_rate', driverPendingRate);
}

// 