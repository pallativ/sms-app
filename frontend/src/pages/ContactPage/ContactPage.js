import React from "react";
import "../../styles/syncfusion";
import ContactList from "../../components/Contacts/ContactList";
import { useEffect, useState } from "react";
import { useAuth } from "../../authentication/AuthContext";
import { getAllContacts } from "../../ApiServices/ContactApiService";
import GenericForm from "../../components/Library/GenericForm";
import TenantForm from "../../components/Tenants/TenantForm";

const ContactsPage = () => {
    const [contacts, setContacts] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const data = await getAllContacts(user);
                setContacts(data);
            } catch (error) {
                console.error("Error fetching contacts:", error);
            }
        };
        if (user) {
            fetchContacts();
        }
    }, [user]);

    const formFields = [
        {
            name: "firstName",
            label: "First Name",
            type: "text",
            placeholder: "Enter first name",
        },
        {
            name: "lastName",
            label: "Last Name",
            type: "text",
            placeholder: "Enter last name",
        },
        { name: "DOB", label: "DOB", type: "date", placeholder: "Enter DOB" },
        {
            name: "gender",
            label: "Gender",
            type: "dropdown",
            placeholder: "Select Gender",
            options: ["Male", "Female", "Other"],
        },
    ];

    const handleSubmit = (data) => {
        console.log("Form Data:", data);
    };

    return (
        <React.Fragment>
            <h1>Contacts</h1>
            <p>Welcome to the Contacts Page.</p>
            {contacts.length > 0 && <ContactList contacts={contacts} />}

            <div className="p-8" style={{ width: "400px" }}>
                <h2 className="text-xl font-bold mb-4">
                    Dynamic Form with Syncfusion
                </h2>
                <GenericForm formFields={formFields} onSubmit={handleSubmit} />
                <TenantForm />
            </div>
        </React.Fragment>
    );
};

export default ContactsPage;
