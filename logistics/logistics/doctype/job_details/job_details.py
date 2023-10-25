import frappe
from frappe.model.document import Document
from frappe.utils import cint

class JobDetails(Document):
    def before_save(self):
        if self.is_new():
            self.set_name_for_new_document()
        else:
            self.rename_document()

    def set_name_for_new_document(self):
        customer = self.customer
        mode_of_transport = self.mode_of_transport

        existing_job_details = frappe.get_all(
            "Job Details",
            filters={
                "customer": customer,
                "mode_of_transport": mode_of_transport,
            },
            fields=["name"],
            order_by="name DESC",
            limit_page_length=1,
        )

        new_number = 1 if not existing_job_details else cint(existing_job_details[0]["name"].split("-")[-1]) + 1

        new_name = f"JOB-{customer}-{mode_of_transport}-{new_number:04d}"

        self.name = new_name

    def rename_document(self):
        if self.customer != self.get_db_value("customer") or self.mode_of_transport != self.get_db_value("mode_of_transport"):
            customer = self.customer
            mode_of_transport = self.mode_of_transport

            existing_job_details = frappe.get_all(
                "Job Details",
                filters={
                    "customer": customer,
                    "mode_of_transport": mode_of_transport,
                },
                fields=["name"],
                order_by="name DESC",
                limit_page_length=1,
            )

            new_number = 1 if not existing_job_details else cint(existing_job_details[0]["name"].split("-")[-1]) + 1

            new_name = f"JOB-{customer}-{mode_of_transport}-{new_number:04d}"

            self.name = frappe.rename_doc(self.doctype, self.name, new_name)
            frappe.db.commit()
            frappe.msgprint(f"Document renamed to {new_name}")
