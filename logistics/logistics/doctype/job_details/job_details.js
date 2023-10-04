frappe.ui.form.on('Job Details', {
    refresh: function(frm) {
        frm.add_custom_button(__('Select Driver'), function() {
            // Create a custom dialog
            var dialog = new frappe.ui.Dialog({
                title: __('Select Driver and Vehicle'),
                fields: [
                    {
                        fieldtype: 'Link',
                        fieldname: 'selected_driver',
                        label: __('Select Driver'),
                        options: 'Drivers',
                        reqd: true,
						
                        
                    },
                    {
                        fieldtype: 'Link',
                        label: __('Select Vehicle'),
                        fieldname: 'selected_vehicle',
                        options: 'Vehicles',
						get_query() {
							return {
								filters: { current_driver: dialog.get_value('selected_driver') }
							}
						}, 
                        reqd: true
                    }
                ],
                primary_action: function() {
                    // Handle the selected driver and vehicle here
                    var selected_driver = dialog.get_value('selected_driver');
                    var selected_vehicle = dialog.get_value('selected_vehicle');
					var vehicle_table = frm.doc.vehicle || [];
                    var row = frappe.model.add_child(frm.doc, 'vehicle');
                    row.driver = selected_driver;
                    row.vehicle_name = selected_vehicle;
                    frm.refresh_field('vehicle');
                    dialog.hide();
                },
                primary_action_label: __('Submit')
            });

            // Show the dialog
            dialog.show();
        });
    }
});