import React from "react";
import { TextBoxComponent, NumericTextBoxComponent } from "@syncfusion/ej2-react-inputs";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import "./GenericForm.css"; // Import the module

const GenericForm = ({ formFields, onSubmit }) => {
    const formData = {};

    const handleChange = (field, value) => {
        formData[field] = value;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 space-y-4 bg-white shadow-md rounded-md">
            {formFields.map((field) => (
                <div key={field.name} style={{ marginTop: "15px" }}>
                    {/* <label className="font-medium">{field.label}</label> */}
                    {field.type === "text" && (
                        <TextBoxComponent
                            placeholder={field.placeholder}
                            cssClass="e-outline"
                            change={(e) => handleChange(field.name, e.value)}
                        />
                    )}
                    {field.type === "dropdown" && (
                        <DropDownListComponent
                            dataSource={field.options}
                            cssClass="e-outline"
                            placeholder={field.placeholder}
                            change={(e) => handleChange(field.name, e.value)}
                        />
                    )}
                    {field.type === "number" && (
                        <NumericTextBoxComponent
                            placeholder={field.placeholder}
                            cssClass="e-outline"
                            change={(e) => handleChange(field.name, e.value)}
                        />
                    )}
                    {field.type === "date" && (
                        <DatePickerComponent
                            placeholder={field.placeholder}
                            cssClass="e-outline e-small"
                            change={(e) => handleChange(field.name, e.value)}
                        />
                    )}
                </div>
            ))}
            <ButtonComponent style={{marginTop: "12px"}} type="submit" cssClass="e-primary">Submit</ButtonComponent>
        </form>
    );
};

export default GenericForm;
