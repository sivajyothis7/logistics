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
                                value: vehicle.name,
                                name1: vehicle.name1,
                            };
                        });

                        // Show a select field with vehicle options
                        frappe.prompt({
                            fieldname: 'selected_vehicle',
                            label: __('Please Select Vehicle'),
                            fieldtype: 'Select',
                            options: vehicle_options,
                        }, function(values) {
                            // Handle the selected vehicle here
                            var selected_vehicle = values.selected_vehicle;
                            var selected_name1 = vehicle_options.find(option => option.value === selected_vehicle).name1;
                            
                            // Check if the selected vehicle already exists in the child table
                            var existing_vehicles = frm.doc.vehicle || [];
                            if (!existing_vehicles.some(vehicle => vehicle.data === selected_vehicle)) {
                                var row = frm.add_child('vehicle', {});
                                row.data = selected_vehicle;
                                row.vehicle_name = selected_name1; // Set row.vehicle_name to the name1 field
                                frm.refresh_field('vehicle');
                            } else {
                                frappe.msgprint(__('Selected vehicle already exists in Vehicles Data.'));
                            }
                        }, __('Select Vehicle'));
                    }
                }
            });
        });
    }
});
