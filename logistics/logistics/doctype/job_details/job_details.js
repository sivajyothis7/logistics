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
                        reqd: true,
                        get_query: function() {
                            const selectedDriver = dialog.get_value('selected_driver');
                            return {
                                filters: [
                                    ['active', '=', 1], // Only select vehicles with the "Active" checkbox checked
                                    ['current_driver', '=', selectedDriver]
                                ]
                            };
                        }
                    }
                ],
                primary_action: function() {
                    // Handle the selected driver and vehicle here
                    var selected_driver = dialog.get_value('selected_driver');
                    var selected_vehicle = dialog.get_value('selected_vehicle');
                    var vehicle_table = frm.doc.vehicle || [];

                    var exists = vehicle_table.some(function(row) {
                        return row.driver === selected_driver && row.vehicle_name === selected_vehicle;
                    });

                    if (!exists) {
                        var row = frappe.model.add_child(frm.doc, 'vehicle');
                        row.driver = selected_driver;
                        row.vehicle_name = selected_vehicle;
                        frm.refresh_field('vehicle');
                        dialog.hide();
                        frappe.msgprint(__('Driver and vehicle added successfully.'), 'Success');
                    } else {
                        frappe.msgprint(__('This driver-vehicle combination already exists.'));
                    }
                },
                primary_action_label: __('Submit')
            });

            // Show the dialog
            dialog.show();
        });
    }
});
