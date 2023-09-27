frappe.ui.form.on('Job Details', {
    refresh: function(frm) {
        // Add a custom button to fetch and display vehicle list
        frm.add_custom_button(__('Select Vehicle'), function() {
            // Fetch the list of vehicles from the "Vehicles" doctype
            frappe.call({
                method: 'frappe.client.get_list',
                args: {
                    doctype: 'Vehicles',
                    fields: ['name', 'name1'],
                },
                callback: function(r) {
                    if (r.message) {
                        var vehicle_options = r.message.map(function(vehicle) {
                            return {
                                label: vehicle.name,
                                value: vehicle.name1,
                            };
                        });

                        // Show a select field with vehicle options
                        frappe.prompt({
                            fieldname: 'selected_vehicle',
                            label: __('Select Vehicle'),
                            fieldtype: 'Select',
                            options: vehicle_options,
                        }, function(values) {
                            // Handle the selected vehicle here
							var selected_vehicle = values.selected_vehicle;
							var row = frm.add_child('vehicle', {});
                            row.vehicle_name = selected_vehicle;
							row.data=selected_vehicle.id
                            frm.refresh_field('vehicle');


                           
                            // frm.set_value('selected_vehicle', selected_vehicle);
                        }, __('Select Vehicle'));
                    }
                }
            });
        });
    }
});