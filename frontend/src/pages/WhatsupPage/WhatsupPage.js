import React, { useState } from "react";
import "../../styles/syncfusion";
import MessageBody from "../../components/Sms/MessageBody";
import SelectContact from "../../components/Contacts/SelectContact";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { sendwhatsAppMessage } from "../../ApiServices/WhatsupApiService";
import { useAuth } from "../../authentication/AuthContext";

const WhatsupPage = () => {
    const [selectedPhone, setSelectedPhone] = useState(""); // Store selected phone
    const [messageContent, setmessageContent] = useState("");
    const { user } = useAuth();
    const sendMessage = () => {
        console.log("Sending message");
        sendwhatsAppMessage(user, { phoneNumber: selectedPhone, message: messageContent });
    }
    return (
        <React.Fragment>
            <h1>WhatsupPage</h1>
            <p>Welcome to the WhatsupPage.</p>
            <SelectContact setSelectedPhone={setSelectedPhone} />
            <MessageBody selectedPhone={selectedPhone}
                onMessageChange={(message) => setmessageContent(message)} />
            <ButtonComponent
                type="button"
                cssClass="e-primary"
                style={{ margin: "10px" }}
                onClick={sendMessage}
            >
                Send
            </ButtonComponent>
        </React.Fragment>
    );
};

export default WhatsupPage;
