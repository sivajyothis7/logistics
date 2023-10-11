frappe.ui.form.on('Job Details', {
    refresh: function(frm) {
        // Maintain a list of selected log names
        const selectedLogs = [];
        frm.add_custom_button(__('Select Daily Log'), function() {
            // MultiSelectDialog for individual child selection
            const dialog = new frappe.ui.form.MultiSelectDialog({
                doctype: "Daily Log",
                target: frm,
                setters: {
                    company: null,
                    date: null,
                },
                add_filters_group: 1,
                date_field: "transaction_date",
                columns: ["vehicle", "driver"],
                get_query() {
                    return {
                        filters: { docstatus: ['!=', 2] }
                    };
                },
                primary_action_label: 'Get Details',
                action(selections, args) {
                    // Iterate through selected items
                    selections.forEach(selectedItem => {
                        const logName = selectedItem;
                        // Check if the log name is already in the list of selected logs
                        // if (!selectedLogs.includes(logName)) {
                            frappe.call({
                                method: 'frappe.client.get',
                                args: {
                                    doctype: 'Daily Log',
                                    name: logName,
                                    filters: ['driver']
                                },
                                callback: function(response) {
                                    if (response.message && (!selectedLogs.includes(logName))) {
                                        console.log(response.message);
                                        const driverData = response.message;
                                        const daily_log = driverData.name;
                                        const driver = driverData.driver;
                                        const vehicle = driverData.vehicle_number;
                                        const newRow = frm.add_child('vehicle');
                                        newRow.daily_log = daily_log;
                                        newRow.driver = driver;
                                        newRow.vehicle_name = vehicle;
                                        frm.refresh_field('vehicle');
                                        // Add the log name to the list of selected logs
                                        selectedLogs.push(logName);
                                        frappe.show_alert(__('<span style="color: green;">Daily Log "{0}" added successfully.</span>', [logName]),5);
										
                                    }else {
                                        console.error('Error fetching Daily Log data.');
										frappe.show_alert(__('<span style="color: red;">Daily Log "{0}" already Exists.</span>', [logName]),3);

                                    }
									
                                }
                            });
                        
                    });
                    dialog.dialog.hide();				    }
            });
        });
    }
});
