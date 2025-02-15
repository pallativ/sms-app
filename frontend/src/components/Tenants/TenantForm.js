import React, { useState } from "react";
import { TextBoxComponent } from "@syncfusion/ej2-react-inputs";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";

const TenantForm = () => {
    const [formData, setFormData] = useState({
        tenantCode: "",
        tenantName: "",
        adminEmail: "",
    });

    const handleChange = (args) => {
        const { name, value } = args?.target || {};
        if (name) {
            setFormData((prevData) => ({ ...prevData, [name]: value }));
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Submitted Data:", formData);
        alert("Form Submitted Successfully!");
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md"
        >
            <h2 className="text-xl font-bold">Tenant Registration</h2>

            <TextBoxComponent
                name="tenantCode"
                placeholder="Tenant Code"
                floatLabelType="Auto"
                change={handleChange}
                cssClass="e-outline"
            />
            <br />
            <br />

            <TextBoxComponent
                name="tenantName"
                placeholder="Tenant Name"
                floatLabelType="Auto"
                change={handleChange}
                cssClass="e-outline"
            />
            <br />
            <br />

            <TextBoxComponent
                name="adminEmail"
                placeholder="Admin Email"
                floatLabelType="Auto"
                type="email"
                change={handleChange}
                cssClass="e-outline"
            />
            <br />
            <br />

            <ButtonComponent cssClass="e-primary" type="submit">
                Submit
            </ButtonComponent>
        </form>
    );
};

export default TenantForm;
