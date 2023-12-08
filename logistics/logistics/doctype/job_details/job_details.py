import frappe
from frappe.model.document import Document
from frappe.utils import cint

class JobDetails(Document):
    pass

def calculate_and_display_total_revenue(doc, method):
    sales_invoices = frappe.get_all('Sales Invoice', filters={'custom_job_number': doc.name,'docstatus': 1}, fields=['grand_total'])
    total_revenue = sum(row['grand_total'] for row in sales_invoices)
    frappe.db.set_value('Job Details', doc.name, 'total_revenue', total_revenue)

def update_total_expense(doc, method):
    journal_entry = frappe.get_all('Journal Entry', filters={'custom_job_details': doc.name,'docstatus': 1}, fields=['total_debit'])
    total_expense = sum(row['total_debit'] for row in journal_entry)
    frappe.db.set_value('Job Details', doc.name, 'total_expense', total_expense)

@frappe.whitelist()
def calculate_and_get_total_revenue(docname):
    doc = frappe.get_doc('Job Details', docname)
    calculate_and_display_total_revenue(doc, method=None)
    # Call the function to update total_expense
    update_total_expense(doc, method=None)
    return {'total_revenue': doc.total_revenue, 'total_expense': doc.total_expense}


    # def before_save(self):
    #     if self.is_new():
    #         self.set_name_for_new_document()
    #     else:
    #         self.rename_document()

    # def set_name_for_new_document(self):
    #     customer = self.customer
    #     mode_of_transport = self.mode_of_transport

    #     existing_job_details = frappe.get_all(
    #         "Job Details",
    #         filters={
    #             "customer": customer,
    #             "mode_of_transport": mode_of_transport,
    #         },
    #         fields=["name"],
    #         order_by="name DESC",
    #         limit_page_length=1,
    #     )

    #     new_number = 1 if not existing_job_details else cint(existing_job_details[0]["name"].split("-")[-1]) + 1

    #     new_name = f"JOB-{customer}-{mode_of_transport}-{new_number:04d}"

    #     self.name = new_name

    # def rename_document(self):
    #     if self.customer != self.get_db_value("customer") or self.mode_of_transport != self.get_db_value("mode_of_transport"):
    #         customer = self.customer
    #         mode_of_transport = self.mode_of_transport

    #         existing_job_details = frappe.get_all(
    #             "Job Details",
    #             filters={
    #                 "customer": customer,
    #                 "mode_of_transport": mode_of_transport,
    #             },
    #             fields=["name"],
    #             order_by="name DESC",
    #             limit_page_length=1,
    #         )

    #         new_number = 1 if not existing_job_details else cint(existing_job_details[0]["name"].split("-")[-1]) + 1

    #         new_name = f"JOB-{customer}-{mode_of_transport}-{new_number:04d}"

    #         self.name = frappe.rename_doc(self.doctype, self.name, new_name)
    #         frappe.db.commit()
    #         frappe.msgprint(f"Document renamed to {new_name}")
