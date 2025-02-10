import axios from 'axios';

const sendwhatsAppMessage = async (user, message) => {
    try {
        const response = await axios.post('/api/whatsup/send', {
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

export { sendwhatsAppMessage };
