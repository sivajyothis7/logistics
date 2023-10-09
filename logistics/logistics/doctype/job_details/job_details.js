frappe.ui.form.on('Job Details', {
    refresh: function(frm) {
        frm.add_custom_button(__('Select Daily Log'), function() {
            // MultiSelectDialog for individual child selection
			new frappe.ui.form.MultiSelectDialog({
				doctype: "Daily Log",
				target: frm,
				setters: {
					// schedule_date: null,
					company:null,
                    date:null,
					
					
				},
				add_filters_group: 1,
				date_field: "transaction_date",
				allow_child_item_selection: 1,
				child_fieldname: "driver",
				get_query() {
					return {
						filters: { docstatus: ['!=', 2] }
					}
				},
				primary_action_label: 'Get Details',
				action(selections) {
					console.log(selections)
					selections.forEach(selectedItem => {
						console.log(selectedItem)
                        const driver = selectedItem.driver; 
                        const vehicleName = selectedItem.vehicle; 

                        // Append a new row to the "vehicle" table
						console.log(frm.doc.driver)
                        const newRow = frm.add_child('vehicle');
                        newRow.driver = driver;
                        newRow.vehicle_name = vehicleName;
                    });

                    // Refresh the "vehicle" table to display the new data
                    frm.refresh_field('vehicle');
				}
			});
			
			
		
			
        });
    }
});
