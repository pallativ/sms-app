import React from "react";
import '../../styles/syncfusion'
import CreateContact from "../../components/Contacts/AddContact";

const ContactsPage = () => {
    return (
        <React.Fragment>
            <h1>Contacts</h1>
            <p>Welcome to the Contacts Page.</p>
            <div style={{ width: 400}}>
            <CreateContact />
            </div>
        </React.Fragment>
    );
};

export default ContactsPage;
