import React from "react";
import "../../styles/syncfusion";
import ContactList from "../../components/Contacts/ContactList";
import { useEffect, useState } from 'react';
import { useAuth } from "../../authentication/AuthContext";
import { getAllContacts } from "../../ApiServices/ContactApiService";


const ContactsPage = () => {
    const [contacts, setContacts] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const data = await getAllContacts(user);
                setContacts(data);
            } catch (error) {
                console.error('Error fetching contacts:', error);
            }
        };
        if (user) {
            fetchContacts();
        }
    }, [user]);


    return (
        <React.Fragment>
            <h1>Contacts</h1>
            <p>Welcome to the Contacts Page.</p>
            {contacts.length > 0 && <ContactList contacts={contacts} />}
        </React.Fragment>
    );
};

export default ContactsPage;
