import React, { useRef, useEffect } from "react";
import { FormValidator } from "@syncfusion/ej2-react-inputs";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { TextBoxComponent, NumericTextBoxComponent } from "@syncfusion/ej2-react-inputs";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import { CheckBoxComponent, SwitchComponent } from "@syncfusion/ej2-react-buttons";
import { TextAreaComponent } from "@syncfusion/ej2-react-inputs";
import "./dynamic-form.css";

const DynamicForm = ({ layout = "single" }) => {
  const formRef = useRef(null);
  const validatorRef = useRef(null);

  const fields = [
    { code: "firstName", name: "First Name", type: "text", required: true, minLength: 3, value: "Veera" },
    { code: "lastName", name: "Last Name", type: "text", required: true, minLength: 3, value: "Pallati" },
    { code: "phoneNumber", name: "Phone Number", type: "text", required: true, pattern: "\\d{10}", value: "" },
    { code: "email", name: "Email", type: "email", required: true, email: true, value: "pkondalu@gmail.com"},
    { code: "password", name: "Password", type: "password", required: true, minLength: 6, value: "123456" },
    { code: "confirmPassword", name: "Confirm Password", type: "password", required: true, minLength: 6, value: "123456" },
    { code: "dob", name: "Date of Birth", type: "date", required: false, value: "18/04/2025" },
    { code: "gender", name: "Gender", type: "enum", required: true, options: ["Male", "Female", "Other"], value :"Male" },
    { code: "age", name: "Age", type: "number", required: true, min: 18, max: 100, value: 30 },
    { code: "subscribe", name: "Subscribe to Newsletter", type: "boolean", required: false, useSwitch: true, value: true },
    { code: "subscribe2", name: "Subscribe to Newsletter", type: "boolean", required: false, useSwitch: false, value: true },
    { code: "comments", name: "Comments", type: "textArea", required: false, maxLength: 200, value: "This is a sample comment." },
  ];

  useEffect(() => {
    if (formRef.current) {
      const rules = fields.reduce((acc, field) => {
        const fieldRules = {};
        if (field.required) fieldRules.required = true;
        if (field.minLength) fieldRules.minLength = field.minLength;
        if (field.maxLength) fieldRules.maxLength = field.maxLength;
        if (field.email) fieldRules.email = true;
        if (field.min !== undefined) fieldRules.range = [field.min, field.max];

        acc[field.code] = fieldRules;
        return acc;
      }, {});

      validatorRef.current = new FormValidator(formRef.current, { rules });
    }

    return () => {
      if (validatorRef.current) {
        validatorRef.current.destroy();
      }
    };
  }, [fields]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validatorRef.current.validate()) {
      const formData = new FormData(formRef.current);
      const data = Object.fromEntries(formData.entries());
      console.log("Form Data:", data);
    }
  };

  const renderField = (field) => {
    switch (field.type) {
      case "text":
      case "email":
      case "password":
        return (
          <TextBoxComponent
            floatLabelType="Auto"
            id={field.code}
            name={field.code}
            placeholder={field.name}
            type={field.type}
            cssClass="e-outline"
            value={field.value || ""} // Bind the value from the field
          />
        );
      case "date":
        return (
          <DatePickerComponent
            id={field.code}
            name={field.code}
            cssClass="e-outline"
            floatLabelType="Auto"
            placeholder={field.name}
            value={field.value || null} // Bind the value from the field
          />
        );
      case "enum":
        return (
          <DropDownListComponent
            id={field.code}
            name={field.code}
            floatLabelType="Auto"
            cssClass="e-outline"
            dataSource={field.options}
            placeholder={field.name}
            value={field.value || null} // Bind the value from the field
          />
        );
      case "number":
        return (
          <NumericTextBoxComponent
            id={field.code}
            name={field.code}
            floatLabelType="Auto"
            cssClass="e-outline"
            placeholder={field.name}
            value={field.value || null} // Bind the value from the field
          />
        );
      case "boolean":
        return field.useSwitch ? (
          <div className="switch-container">
            <label htmlFor={field.code} className="switch-label">{field.name}</label>
            <SwitchComponent
              id={field.code}
              name={field.code}
              checked={field.value || false} // Bind the value from the field
              onLabel="Yes"
              offLabel="No"
            />
          </div>
        ) : (
          <CheckBoxComponent
            id={field.code}
            name={field.code}
            label={field.name}
            checked={field.value || false} // Bind the value from the field
          />
        );
      case "textArea":
        return (
          <TextAreaComponent
            name={field.code}
            placeholder={field.name}
            floatLabelType="Auto"
            cssClass="e-outline"
            rows="4"
            cols="240"
            value={field.value || ""} // Bind the value from the field
          ></TextAreaComponent>
        );
      default:
        return null;
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className={`dynamic-form ${layout}`}>
      {fields.map((field) => (
        <div key={field.code} className="form-group">
          {renderField(field)}
        </div>
      ))}
      <div className="submit-button-container">
        <ButtonComponent type="submit" cssClass="e-primary">Submit</ButtonComponent>
      </div>
    </form>
  );
};

export default DynamicForm;



