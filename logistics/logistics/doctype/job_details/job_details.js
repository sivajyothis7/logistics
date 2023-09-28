frappe.ui.form.on('Job Details', {
    refresh: function(frm) {
        frm.add_custom_button(__('Select Vehicle'), function() {
            frappe.call({
                method: 'frappe.client.get_list',
                args: {
                    doctype: 'Vehicles',
                    fields: ['name', 'name1'],
					filters: {
                        'active': 1 
                    }
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

                        frappe.prompt({
                            fieldname: 'selected_vehicle',
                            label: __('Please Select Vehicle'),
                            fieldtype: 'Select',
                            options: vehicle_options,
                        }, function(values) {
                            var selected_vehicle = values.selected_vehicle;
                            var selected_name1 = vehicle_options.find(option => option.value === selected_vehicle).name1;
                            
                            var existing_vehicles = frm.doc.vehicle || [];
                            if (!existing_vehicles.some(vehicle => vehicle.data === selected_vehicle)) {
                                var row = frm.add_child('vehicle', {});
                                row.data = selected_vehicle;
                                row.vehicle_name = selected_name1; 
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
