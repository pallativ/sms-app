import React from "react";
import "../../styles/syncfusion";
import ContactList from "../../components/Contacts/ContactList";

const ContactsPage = () => {
    return (
        <React.Fragment>
            <h1>Contacts</h1>
            <p>Welcome to the Contacts Page.</p>
            <ContactList />
        </React.Fragment>
    );
};

export default ContactsPage;
