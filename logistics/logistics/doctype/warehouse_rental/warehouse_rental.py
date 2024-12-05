import frappe
from frappe.utils import date_diff
from frappe.model.document import Document

class WarehouseRental(Document):
    def calculate_total_amount(self):
        months_rented = frappe.utils.date_diff(self.rent_end_date, self.rent_start_date) / 30.0
        self.months_rented = months_rented
        self.total_amount = self.rental_rate * self.rent_space * months_rented

    def validate(self):
        if self.warehouse:
            warehouse_mgmt = frappe.get_doc('Warehouse Management', self.warehouse)
            if warehouse_mgmt:
                if self.rent_space > warehouse_mgmt.remaining_space:
                    frappe.throw(f"The rent space {self.rent_space} exceeds the available space in Warehouse Management ({warehouse_mgmt.remaining_space}). Please adjust the rent space.")

        self.calculate_total_amount()

@frappe.whitelist()
def generate_invoice(docname):
    if not docname:
        frappe.msgprint("Document name is required to generate the invoice.")
        return

    doc = frappe.get_doc("Warehouse Rental", docname)

    if doc.status == "Occupied":
        if doc.invoice_number:
            return {"error": f"Sales Invoice already exists for this Warehouse Rental: {doc.invoice_number}"}
        else:
            doc.calculate_total_amount()

            invoice = frappe.get_doc({
                "doctype": "Sales Invoice",
                "customer": doc.customer,
                "custom_job_number": doc.job_details,
                "posting_date": frappe.utils.today(),
                "due_date": frappe.utils.add_days(frappe.utils.today(), 30),
                "items": [
                    {
                        "item_code": doc.warehouse_space_item,
                        "qty": 1,
                        "rate": doc.total_amount,
                        "amount": doc.total_amount
                    }
                ]
            })

            invoice.insert(ignore_permissions=True)
            frappe.msgprint(f"Sales Invoice generated successfully: {invoice.name}")

            doc.invoice_number = invoice.name
            doc.save(ignore_permissions=True)

            if doc.warehouse:
                warehouse_mgmt = frappe.get_doc('Warehouse Management', doc.warehouse)

                if warehouse_mgmt:
                    warehouse_mgmt.append('rental_details', {
                        'warehouse_rental': doc.name,  
                        'total_amount': doc.total_amount,  
                        'invoice_number': invoice.name,
                        'rent_space': doc.rent_space,
                        'current_status': doc.status, 
                    })

                    warehouse_mgmt.save()

                    frappe.msgprint(f"Rental details added to Warehouse Management. Total Rent: {doc.total_amount}, Invoice: {invoice.name}")

            return doc.invoice_number
    else:
        frappe.msgprint("Invoice generation is only allowed for 'Occupied' status.")
