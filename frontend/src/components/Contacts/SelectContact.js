import * as React from "react";
import {
    MultiColumnComboBoxComponent,
    ColumnsDirective,
    ColumnDirective,
} from "@syncfusion/ej2-react-multicolumn-combobox";
import { useState } from "react";

const members = [
    {
        id: 1,
        firstName: "John",
        email: "john@example.com",
        phone: "123-456-7890",
    },
    {
        id: 2,
        firstName: "Jane",
        email: "jane@example.com",
        phone: "987-654-3210",
    },
    {
        id: 3,
        firstName: "Mike",
        email: "mike@example.com",
        phone: "555-555-5555",
    },
    {
        id: 4,
        firstName: "Emma",
        email: "emma@example.com",
        phone: "111-222-3333",
    },
    {
        id: 5,
        firstName: "David",
        email: "david@example.com",
        phone: "444-555-6666",
    },
    {
        id: 6,
        firstName: "Sarah",
        email: "sarah@example.com",
        phone: "777-888-9999",
    },
    {
        id: 7,
        firstName: "Michael",
        email: "michael@example.com",
        phone: "101-112-1314",
    },
    {
        id: 8,
        firstName: "Emily",
        email: "emily@example.com",
        phone: "1516-1718-1920",
    },
    {
        id: 9,
        firstName: "Kevin",
        email: "kevin@example.com",
        phone: "2122-2324-2526",
    },
    {
        id: 10,
        firstName: "Ashley",
        email: "ashley@example.com",
        phone: "2728-2930-3132",
    },
];

const SelectContact = ({ setSelectedPhone }) => {
    const [value, setValue] = useState(null);
    const [text, setText] = useState(""); // Store the first name and phone number
    const fields = { text: "displayText", value: "phone" };

    // Add a new field "displayText" combining firstName and phone
    const dataSource = members.map((member) => ({
        ...member,
        displayText: `${member.firstName} (${member.phone})`,
    }));

    const valueChange = (args) => {
        setValue(args.itemData?.id || null);
        setText(args.itemData?.displayText || "");
        setSelectedPhone(args.itemData?.value); // Ensure phone is updated
    };

    return (
        <div className="control-section">
            <div className="col-lg-8">
                <div className="control-wrapper multicolumn">
                    <div>
                        <label>
                            <h2>Select a member: </h2>
                        </label>
                        {"  "}
                        <MultiColumnComboBoxComponent
                            dataSource={dataSource}
                            fields={fields} // Use concatenated firstName and phone for display
                            popupHeight={"230px"}
                            popupWidth={"520px"}
                            width={"520px"}
                            placeholder="Select any member"
                            value={value} // Bind to the ID
                            text={text} // Bind to the concatenated text
                            change={valueChange}
                            showClearButton={true}
                        >
                            <ColumnsDirective>
                                <ColumnDirective
                                    field="firstName"
                                    header="First Name"
                                    width={110}
                                ></ColumnDirective>
                                <ColumnDirective
                                    field="phone"
                                    header="Phone"
                                    width={150}
                                ></ColumnDirective>
                            </ColumnsDirective>
                        </MultiColumnComboBoxComponent>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectContact;
