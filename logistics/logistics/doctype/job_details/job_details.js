frappe.ui.form.on('Job Details', {
    refresh: function(frm) {
		let d;
        frm.add_custom_button(__('Select Daily Log'), function() {
            // MultiSelectDialog for individual child selection
			 d = new frappe.ui.form.MultiSelectDialog({
				doctype: "Daily Log",
				target: frm,
				setters: {
					// schedule_date: null,
					company:null,
                    date:null,
					
					
					
				},
				add_filters_group: 1,
				date_field: "transaction_date",
				columns: ["vehicle", "driver"],
				get_query() {
					return {
						filters: { docstatus: ['!=', 2] }
					}
				},
				primary_action_label: 'Get Details',
				action(selections, args) {
					// Iterate through selected items
					selections.forEach(selectedItem => {
						const logName = selectedItem; 
						// Fetch the driver data for the selected Daily Log
						frappe.call({
							method: 'frappe.client.get',
							args: {
								doctype: 'Daily Log',
								name: logName,
								filters: ['driver'] 
							},
							callback: function(response) {
								if (response.message) {
									console.log(response.message)
									const driverData = response.message;
									const daily_log = driverData.name
									const driver = driverData.driver;
									const vehicle = driverData.vehicle_number
									const newRow = frm.add_child('vehicle');
									newRow.daily_log = daily_log 
									newRow.driver = driver;
									newRow.vehicle_name = vehicle;
								
								frm.refresh_field('vehicle');
								
								
								} else {
									console.error('Error fetching Daily Log data.');
								}
							}
						});
					});
					
				}
			});	
			
        });
		
    }
	
});

