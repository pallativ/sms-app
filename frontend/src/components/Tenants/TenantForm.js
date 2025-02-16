import React, { useState } from "react";
import { TextBoxComponent } from "@syncfusion/ej2-react-inputs";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";

const TenantForm = ({ onFormSubmit }) => {
    const [formData, setFormData] = useState({
        tenantCode: "",
        tenantName: "",
        adminEmail: "",
    });

    const handleChange = (args) => {
        const name = args?.element?.name || args.target.name; // Robust name access
        const value = args?.value || args.target.value; // Robust value access
        setFormData({ ...formData, [name]: value });

    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        await onFormSubmit(formData);
        setFormData({
            tenantCode: "",
            tenantName: "",
            adminEmail: "",
        })
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-bold">Tenant Registration</h2>

            <form onSubmit={handleSubmit}>
                <TextBoxComponent
                    name="code"
                    placeholder="Tenant Code"
                    floatLabelType="Auto"
                    onChange={handleChange} // Use onChange
                    cssClass="e-outline"
                />
                <br />
                <br />

                <TextBoxComponent
                    name="name"
                    placeholder="Tenant Name"
                    floatLabelType="Auto"
                    onChange={handleChange} // Use onChange
                    cssClass="e-outline"
                />
                <br />
                <br />

                <TextBoxComponent
                    name="adminEmail"
                    placeholder="Admin Email"
                    floatLabelType="Auto"
                    type="email"
                    onChange={handleChange} // Use onChange
                    cssClass="e-outline"
                />
                <br />
                <br />

                <ButtonComponent cssClass="e-primary" type="submit">
                    Submit
                </ButtonComponent>
            </form>
        </div>
    );
};

export default TenantForm;
