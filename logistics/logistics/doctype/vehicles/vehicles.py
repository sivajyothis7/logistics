# Copyright (c) 2023, siva and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class Vehicles(Document):
    def validate(self):
        if self.current_driver:
            frappe.db.set_value("Drivers", {'name': self.current_driver}, 'status', 'Vehicle Assigned')    
            frappe.db.set_value("Drivers", {'name': self.current_driver}, 'current_vehicle', self.name)
        else:
            driver_name = frappe.db.get_value("Drivers", {"current_vehicle": self.name}, "name")
            if driver_name:
                frappe.db.set_value("Drivers", {'name': driver_name}, 'status', 'Vehicle Not Assigned')    
                frappe.db.set_value("Drivers", {'name': driver_name}, 'current_vehicle', '')