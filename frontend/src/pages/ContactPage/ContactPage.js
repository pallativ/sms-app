import React from "react";
import "../../styles/syncfusion";
import CreateContact from "../../components/Contacts/CreateContact";
import ContactCardView from "../../components/Contacts/ContactCardView";
import ContactList from "../../components/Contacts/ContactList";

const ContactsPage = () => {
    return (
        <React.Fragment>
            <h1>Contacts</h1>
            <p>Welcome to the Contacts Page.</p>
            <div style={{ width: 400}}>
            <CreateContact />
            <ContactCardView contact={{ name: "John Doe", position: "Software Developer", email: "pkondalu@gmail.com", phone: "123-456-7890" }} />
            </div>
        </React.Fragment>
    );
};

export default ContactsPage;
