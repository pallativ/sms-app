import React, { useState } from "react";
import "../../styles/syncfusion";
import MessageBody from "../../components/Sms/MessageBody";
import SelectContact from "../../components/Contacts/SelectContact";

const WhatsupPage = () => {
    const [selectedPhone, setSelectedPhone] = useState(""); // Store selected phone
    return (
        <React.Fragment>
            <h1>WhatsupPage</h1>
            <p>Welcome to the WhatsupPage.</p>
            <SelectContact setSelectedPhone={setSelectedPhone} />
            <MessageBody selectedPhone={selectedPhone} />
        </React.Fragment>
    );
};

export default WhatsupPage;
