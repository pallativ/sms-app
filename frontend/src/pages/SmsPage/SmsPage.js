import React from "react";
import SelectContact from "../../components/Contacts/SelectContact";

const SmsPage = () => {
    return (
        <>
            <div>
                <h1>SMS Page</h1>
                <p>
                    Welcome to the SMS Page. Here you can manage your SMS
                    messages.
                </p>
            </div>
            <div>
                <SelectContact />
            </div>
        </>
    );
};

export default SmsPage;
