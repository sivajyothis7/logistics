from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class Drivers(Document):
    def calculate_totals(self):
        self.total_driver_rate = sum(self.get_numeric_value(row.driver_rate) for row in self.get("payment_data"))
        self.total_pending_rate = sum(self.get_numeric_value(row.pending_driver_rate) for row in self.get("payment_data"))
        self.save()

    def get_numeric_value(self, value):
        return float(value) if value else 0.0

@frappe.whitelist()
def get_totals(docname):
    doc = frappe.get_doc("Drivers", docname)
    doc.calculate_totals()
    return {
        "total_driver_rate": doc.total_driver_rate,
        "total_pending_rate": doc.total_pending_rate
    }

@frappe.whitelist()
def create_supplier(docname):
    doc = frappe.get_doc("Drivers", docname)
    existing_supplier = frappe.db.get_value("Supplier", {"supplier_name": doc.name1})
    if existing_supplier:
        frappe.throw(f"Supplier already exists with the name: {doc.name1}", frappe.DuplicateEntryError)

    supplier = frappe.get_doc({
        "doctype": "Supplier",
        "supplier_name": doc.name1,
        "custom_driver_reference": doc.name1,
    })

    supplier.flags.ignore_permissions = True
    supplier.save()
    supplier_link = frappe.utils.get_link_to_form(supplier.doctype, supplier.name)

    frappe.msgprint("Supplier generated successfully: {}".format(supplier_link))
