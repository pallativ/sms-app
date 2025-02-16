import React from 'react';
import TenantForm from '../../components/Tenants/TenantForm';
import { createTenant } from '../../ApiServices/tenantconfigService';
import { useAuth } from "../../authentication/AuthContext";
import TenantsList from '../../components/Tenants/TenantsList';

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
            <TenantsList />
        </div>
    );
};

export default TenantCreationPage;
