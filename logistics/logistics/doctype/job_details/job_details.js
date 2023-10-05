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
                    date:null
					
					// status: 'Pending'
				},
				add_filters_group: 1,
				date_field: "transaction_date",
				get_query() {
					return {
						filters: { docstatus: ['!=', 1] }
					}
				},
				action(selections) {
					selections.forEach(selectedItem => {
                        const driver = selectedItem.data.some_field; // Replace "some_field" with the actual field name in "Daily Log"
                        const vehicleName = selectedItem.data.another_field; // Replace "another_field" with the actual field name in "Daily Log"

                        // Append a new row to the "vehicle" table
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
