frappe.ui.form.on('Daily Log', {
    refresh: function(frm) {
    },

    driver_rate: function(frm) {
        calculateDriverPendingRate(frm);
    },

    driver_advance: function(frm) {
        calculateDriverPendingRate(frm);
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
