import React, { useState } from "react";
import { TextBoxComponent } from "@syncfusion/ej2-react-inputs";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";

const TenantForm = () => {
    const [formData, setFormData] = useState({
        tenantCode: "",
        tenantName: "",
        adminEmail: "",
    });

    const [submittedData, setSubmittedData] = useState(null);
    const [showData, setShowData] = useState(false);

    const handleChange = (args) => {
        const name = args?.element?.name || args.target.name; // Robust name access
        const value = args?.value || args.target.value; // Robust value access

        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmittedData({ ...formData });
        setShowData(true);
        alert("Form Submitted Successfully!");
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-bold">Tenant Registration</h2>

            <form onSubmit={handleSubmit}>
                <TextBoxComponent
                    name="tenantCode"
                    placeholder="Tenant Code"
                    floatLabelType="Auto"
                    onChange={handleChange} // Use onChange
                    cssClass="e-outline"
                />
                <br />
                <br />

                <TextBoxComponent
                    name="tenantName"
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

            {submittedData && (
                <>
                    <br />
                    <ButtonComponent
                        cssClass="e-outline"
                        onClick={() => setShowData(!showData)}
                    >
                        {showData
                            ? "Hide Submitted Data"
                            : "Show Submitted Data"}
                    </ButtonComponent>
                </>
            )}

            {showData && submittedData && (
                <div className="mt-4 p-4 bg-gray-100 rounded-md">
                    <h3 className="font-semibold">Submitted Data:</h3>
                    <p>
                        <strong>Tenant Code:</strong> {submittedData.tenantCode}
                    </p>
                    <p>
                        <strong>Tenant Name:</strong> {submittedData.tenantName}
                    </p>
                    <p>
                        <strong>Admin Email:</strong> {submittedData.adminEmail}
                    </p>
                </div>
            )}
        </div>
    );
};

export default TenantForm;
