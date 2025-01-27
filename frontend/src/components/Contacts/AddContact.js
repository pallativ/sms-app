import React, { useState, useRef } from 'react';

import { TextBoxComponent } from "@syncfusion/ej2-react-inputs";
import { MaskedTextBoxComponent } from "@syncfusion/ej2-react-inputs";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";


const CreateContact = ({ addContact }) => {
    const formRef = useRef(null);
    const [formData, setFormData] = useState({
        firstName: "",
        email: "",
        phoneNumber: "",
    });
    const [errors, setErrors] = useState({
        email: false,
        firstName: false,
        phoneNumber: false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        setErrors({
            ...errors,
            [name]: false,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if the form is valid using Syncfusion's validation
        const isValid = formRef.current.ej2_instances[0].validate();
        if (isValid) {
            alert(
                `Form submitted!\nFirst Name: ${formData.firstName}\nEmail: ${formData.email}\nPhone Number: ${formData.phoneNumber}`
            );

            setFormData({
                firstName: "",
                email: "",
                phoneNumber: "",
            });
            setErrors({
                firstName: false,
                email: false,
                phoneNumber: false,
            });
        } else {
            alert("Please fill all required fields!");
        }
    };
    return (
        <div className="container" style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
            <h2 className="e-title">Add Contact</h2>
            <form ref={formRef} onSubmit={handleSubmit} >
                <div >
                    <div className="row">
                        <div className="col-lg-4"> <label htmlFor="email" style={{ display: 'block', marginBottom: '0px', fontWeight: 'bold' }}>
                            Email:
                        </label> </div>
                        <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6">
                            <TextBoxComponent
                                id="email"
                                name="email"
                                value={formData.email}
                                placeholder="Enter Email"
                                onChange={handleChange}
                                required
                            />
                            {errors.email && (
                                <span className="e-error">Email is required</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="form-group e-input-group">
                    {/* <label htmlFor="firstName" >
                        First Name:
                    </label> */}
                    <TextBoxComponent
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        placeholder="Enter First Name"
                        onChange={handleChange}
                        required
                    />
                    {errors.firstName && (
                        <span className="e-error">
                            First Name is required
                        </span>
                    )}
                </div>

                <div className="form-group e-input-group">
                    {/* <label htmlFor="phoneNumber" className="e-label">
                        Phone Number :
                    </label> */}
                    <MaskedTextBoxComponent
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        mask="999 000 0000"
                        placeholder="Enter Phone Number"
                        onChange={handleChange}
                        required
                    />
                    {errors.phoneNumber && (
                        <span className="e-error">
                            Phone Number is required
                        </span>
                    )}
                </div>

                <div className="form-group e-btn-group">
                    <ButtonComponent
                        type="submit"
                        content="Submit"
                        cssClass="e-primary"
                    />
                </div>
            </form>
        </div>
    );
};

export default CreateContact;
