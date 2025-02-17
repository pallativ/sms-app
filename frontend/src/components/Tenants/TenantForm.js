import React, { useState, useRef, useEffect } from "react";
import { TextBoxComponent } from "@syncfusion/ej2-react-inputs";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import {
    GridComponent,
    ColumnsDirective,
    ColumnDirective,
    Inject,
    Sort,
    Filter,
    Toolbar,
    Edit,
} from "@syncfusion/ej2-react-grids";
import { FormValidator } from "@syncfusion/ej2-inputs";

const TenantForm = () => {
    const [formData, setFormData] = useState({
        tenantCode: "",
        tenantName: "",
        adminEmail: "",
    });

    const formRef = useRef(null);
    const validatorRef = useRef(null);
    const [submittedData, setSubmittedData] = useState([]);
    const filterSettings = { type: "Excel" };

    // required fields ONLY FOR TENANT REGISTRATION
    useEffect(() => {
        if (formRef.current) {
            validatorRef.current = new FormValidator(formRef.current, {
                rules: {
                    tenantCode: { required: true },
                    tenantName: { required: true },
                    adminEmail: { email: true, required: true },
                },
                errorPlacement: (error, element) => {
                    element.parentElement.appendChild(error);
                },
            });
        }
    }, []);

    const handleChange = (args) => {
        const name = args?.element?.name || args.target.name;
        const value = args?.value || args.target.value || "";

        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validatorRef.current.validate()) {
            // Check for duplicate tenantCode before submitting
            const isDuplicate = submittedData.some(
                (row) => row.tenantCode === formData.tenantCode
            );

            if (isDuplicate) {
                alert("Duplicate entry detected. Please use unique values.");
                return;
            }

            setSubmittedData([...submittedData, { ...formData }]);
            setFormData({ tenantCode: "", tenantName: "", adminEmail: "" });
            validatorRef.current.reset();
            alert("Form Submitted Successfully!");
        } else {
            alert("Please correct the errors before submitting.");
        }
    };

    const handleActionBegin = (args) => {
        if (args.requestType === "save") {
            const newData = args.data;

            // Check if the tenantCode already exists in another row
            const isDuplicate = submittedData.some(
                (row) =>
                    row.tenantCode === newData.tenantCode &&
                    row !== args.previousData
            );

            if (isDuplicate) {
                args.cancel = true;
                alert(
                    "Duplicate Tenant Code detected. Please use a unique code."
                );
            } else {
                if (args.action === "add") {
                    setSubmittedData((prevData) => [...prevData, newData]);
                } else if (args.action === "edit") {
                    setSubmittedData((prevData) =>
                        prevData.map((row) =>
                            row.tenantCode === args.previousData.tenantCode
                                ? newData
                                : row
                        )
                    );
                }
            }
        }
    };

    return (
        <>
            <div
                className="control-section"
                style={{
                    maxWidth: "400px",
                    padding: "10px",
                }}
            >
                <h2 className="text-xl font-bold">Tenant Registration</h2>

                <form ref={formRef} onSubmit={handleSubmit}>
                    <TextBoxComponent
                        name="tenantCode"
                        placeholder="Tenant Code"
                        floatLabelType="Auto"
                        onChange={handleChange}
                        cssClass="e-outline"
                    />
                    <br />
                    <br />

                    <TextBoxComponent
                        name="tenantName"
                        placeholder="Tenant Name"
                        floatLabelType="Auto"
                        onChange={handleChange}
                        cssClass="e-outline"
                    />
                    <br />
                    <br />

                    <TextBoxComponent
                        name="adminEmail"
                        placeholder="Admin Email"
                        floatLabelType="Auto"
                        type="email"
                        onChange={handleChange}
                        cssClass="e-outline"
                    />
                    <br />
                    <br />

                    <ButtonComponent cssClass="e-primary" type="submit">
                        Submit
                    </ButtonComponent>
                    <br />
                    <br />
                    <ButtonComponent cssClass="e-danger" type="reset">
                        reset
                    </ButtonComponent>
                </form>
            </div>

            <div className="control-section">
                <h3 className="font-semibold">Submitted Data:</h3>
                <GridComponent
                    dataSource={submittedData}
                    height="200"
                    width={"100%"}
                    allowSorting={true}
                    allowFiltering={true}
                    filterSettings={filterSettings}
                    editSettings={{
                        allowEditing: true,
                        allowAdding: true,
                        allowDeleting: true,
                    }}
                    toolbar={["Add", "Edit", "Delete", "Update", "Cancel"]}
                    actionBegin={handleActionBegin}
                >
                    <ColumnsDirective>
                        <ColumnDirective
                            field="tenantCode"
                            headerText="Tenant Code"
                            width="100"
                            textAlign="Center"
                            validationRules={{ required: true }}
                        />
                        <ColumnDirective
                            field="tenantName"
                            headerText="Tenant Name"
                            width="150"
                            textAlign="Center"
                            validationRules={{ required: true }}
                        />
                        <ColumnDirective
                            field="adminEmail"
                            headerText="Admin Email"
                            width="200"
                            textAlign="Center"
                            validationRules={{
                                required: true,
                                email: true,
                            }}
                        />
                    </ColumnsDirective>
                    <Inject services={[Sort, Filter, Toolbar, Edit]} />
                </GridComponent>
            </div>
        </>
    );
};

export default TenantForm;
