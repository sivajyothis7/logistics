import frappe
from frappe.model.naming import getseries
from frappe.model.document import Document

class JobDetails(Document):
	pass
    # def autoname(self):
    #         # Fetch values from fields
    #         customer = self.customer
    #         mode_of_transport = self.mode_of_transport

    #         # Generate the name based on the format
    #         name_format = f'JOB-[{customer}]-[{mode_of_transport}]-####'

    #         # Use make_autoname to generate the name with an auto-incremented number
    #         self.name = frappe.model.naming.make_autoname(name_format, doc=self)