frappe.ui.form.on('Way Bill', {
    refresh: function(frm) {
        frm.add_custom_button(__('Generate E-Way Bill'), function() {
            var objWindowOpenResult = window.open(frappe.urllib.get_full_url("/printview?"
                + "doctype=" + encodeURIComponent("Way Bill")
                + "&name=" + encodeURIComponent(frm.doc.name)
                + "&trigger_print=0"
                + "&format=Waybill"
                + "&no_letterhead=0"
                + "&_lang=en"
            ));

            if (!objWindowOpenResult) {
                frappe.msgprint(__("Please set permission for pop-up windows in your browser!"));
                return;
            }
        });
    }
});
