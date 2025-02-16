import React from 'react';
import TenantForm from '../../components/Tenants/TenantForm';
import { createTenant } from '../../ApiServices/tenantconfigService';
import { useAuth } from "../../authentication/AuthContext";

const TenantCreationPage = () => {
    const { user } = useAuth();
    const handleFormSubmit = async (formData) => {
        await createTenant(user, formData);
    };

    return (
        <div>
            <div style={{ width: "25%" }}>
                <TenantForm onFormSubmit={handleFormSubmit} />
            </div>
        </div>
    );
};

export default TenantCreationPage;
