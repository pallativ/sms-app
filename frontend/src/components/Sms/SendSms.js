import React, { useState } from 'react';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { FormValidator } from "@syncfusion/ej2-inputs";

const SendSms = () => {
    const [formValidator, setFormValidator] = useState(null);
    const [smsData, setSmsData] = useState({
        from: "",
        to: "",
        message: ""
    });
    const [charCount, setCharCount] = useState(0);

    // Handle text change and update character count
    const handleTextChange = (args, field) => {
        setSmsData({ ...smsData, [field]: args.value });
        if (field === "message")
            setCharCount(args.value.length);
        // ✅ Trigger validation in real-time
        if (formValidator) {
            formValidator.validate(field);
        }

    };

    React.useEffect(() => {
        const validator = new FormValidator("#smsForm", {
            rules: {
                from: { required: true, regex: /^[0-9]{10,15}$/ }, // 10-15 digit phone number
                to: { required: true, regex: /^[0-9]{10,15}$/ }, // 10-15 digit phone number
                message: { required: true, maxLength: 160 }
            }
        });
        setFormValidator(validator);
    }, []);

    const handleSend = () => {
        console.log(smsData);
        if (formValidator.validate()) {
            alert("SMS Sent Successfully!\n" + JSON.stringify(smsData, null, 2));
        }
        // Implement SMS sending logic here
        // console.log(`From: ${from}, To: ${to}, Message: ${message}`);
    };

    return (
        <div style={{ width: '500px' }}>
            <form id="smsForm">
                <h2>Send SMS</h2>
                <div >
                    <TextBoxComponent cssClass="e-outline" floatLabelType="Auto"
                        placeholder="From"
                        name="from"
                        // value={from}
                        input={(e) => handleTextChange(e, "from")}
                        style={{ width: '100%' }}
                    />
                </div>
                <div style={{ marginTop: '20px' }}>
                    <TextBoxComponent cssClass="e-outline" floatLabelType="Auto"
                        placeholder="To"
                        name="to"
                        // value={to}
                        input={(e) => handleTextChange(e, "to")}
                        style={{ width: '100%' }}
                    />
                </div>
                <div style={{ marginTop: '20px' }}>
                    <TextBoxComponent cssClass="e-outline" floatLabelType="Auto"
                        placeholder="Message"
                        name="message"
                        // value={message}
                        input={(e) => handleTextChange(e, "message")}
                        multiline={true}
                        maxLength={160}
                        rows={6}
                        style={{ width: '300px' }}
                    />
                    <p style={{ marginTop: "10px", fontSize: "12px", color: "#aaa" }}>
                        Character Count: {charCount}
                    </p>
                </div>
                <div style={{ marginTop: '30px' }}>
                    <ButtonComponent cssClass="e-primary" onClick={handleSend} style={{ width: '100px' }}>Send</ButtonComponent>
                </div>
            </form>
        </div >
    );
};

export default SendSms;
