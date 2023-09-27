# Copyright (c) 2023, siva and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class Vehicles(Document):
	def validate(self):
		# frappe.db.set_value("Drivers",{'name':self.reg_number},'vehicle_number',self.reg_number)
		frappe.db.set_value("Drivers",{'name':self.current_driver},'current_vehicle',self.name)
