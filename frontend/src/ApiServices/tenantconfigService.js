import axios from 'axios';

const createTenant = async (user, tenantInfo) => {
    try {
        const response = await axios.post('/api/tenant', tenantInfo, {
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

export { createTenant };
