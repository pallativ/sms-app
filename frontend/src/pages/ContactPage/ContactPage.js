import React from "react";
import "../../styles/syncfusion";
import ContactList from "../../components/Contacts/ContactList";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from "../../authentication/AuthContext";

const ContactsPage = () => {
    const [contacts, setContacts] = useState([]);
    const { login, user } = useAuth();

    useEffect(() => {
        const fetchMessageLogs = async () => {
            try {
                const response = await axios.get('/api/contacts', {
                    headers: {
                        Authorization: `Bearer ${user.accessToken}`
                    }
                });

                setContacts(response.data);
            } catch (error) {
                console.error('Error fetching message logs:', error);
            }
        };

        fetchMessageLogs();
    }, []);


    return (
        <React.Fragment>
            <h1>Contacts</h1>
            <p>Welcome to the Contacts Page.</p>
            <ContactList contacts={contacts} />
        </React.Fragment>
    );
};

export default ContactsPage;
