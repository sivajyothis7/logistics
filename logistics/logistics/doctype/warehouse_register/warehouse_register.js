frappe.ui.form.on('Warehouse Register', {
    validate: function(frm) {
        let total_in = 0; 
        let total_out = 0; 

        (frm.doc.activities || []).forEach(function(row) {
            if (row.activity === 'IN') {
                total_in += row.billing_space || 0;
            } else if (row.activity === 'OUT') {
                total_out += row.billing_space || 0;
            }
        });

        let total_billing_space_used = total_in - total_out;

        console.log("Total IN:", total_in, "Total OUT:", total_out, "Billing Space Used:", total_billing_space_used);

        frm.set_value('total_billing_space_used', total_billing_space_used);
    }
});
