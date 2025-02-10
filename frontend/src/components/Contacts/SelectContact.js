import * as React from "react";
import {
    MultiColumnComboBoxComponent,
    ColumnsDirective,
    ColumnDirective,
} from "@syncfusion/ej2-react-multicolumn-combobox";
import { useEffect, useState } from "react";
import { getAllContacts } from "../../ApiServices/ContactApiService";
import { useAuth } from "../../authentication/AuthContext";


const SelectContact = ({ setSelectedPhone }) => {
    const [value, setValue] = useState(null);
    const [text, setText] = useState(""); // Store the first name and phone number
    const [dataSource, setdataSource] = useState([]);
    const { user } = useAuth();
    const fields = { text: "displayText", value: "phoneNumber" };

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const data = await getAllContacts(user);
                var result = data.map((member) => ({
                    ...member,
                    displayText: `${member.firstName} - (${member.phoneNumber})`,
                }));
                console.log('All Contacts:', result);
                setdataSource(result);
            } catch (error) {
                console.error('Error fetching contacts:', error);
            }
        };
        if (user) {
            fetchContacts();
        }
    }, [user]);


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
                        {dataSource.length > 0 && < MultiColumnComboBoxComponent
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
                                    field="phoneNumber"
                                    header="Phone"
                                    width={150}
                                ></ColumnDirective>
                            </ColumnsDirective>
                        </MultiColumnComboBoxComponent>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectContact;
