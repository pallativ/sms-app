import axios from 'axios';

const getAllContacts = async (user) => {
    try {
        const response = await axios.get('/api/contacts', {
            headers: {
                Authorization: `Bearer ${user.accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching contacts:', error);
        throw error;
    }
}

const createContact = async (user, contactData) => {
    try {
        const response = await axios.post('/api/contacts', contactData, {
            headers: {
                Authorization: `Bearer ${user.accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating contact:', error);
        throw error;
    }
}

export { createContact, getAllContacts };
