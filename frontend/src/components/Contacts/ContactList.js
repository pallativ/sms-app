import React, { useEffect, useState } from "react";
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
import { createContact } from "../../ApiServices/ContactApiService";
import { useAuth } from "../../authentication/AuthContext";

const ContactList = ({ contacts }) => {
    const filterSettings = { type: "Excel" };
    const [data, setData] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        setData(contacts);
        console.log('Contacts List from contact List component:', contacts);
    }, [contacts]);

    const handleActionBegin = (args) => {
        if (args.requestType === "save") {
            const newData = args.data;

            const isDuplicate = data.some(
                (row) => row.email === newData.email && args.action === "add"
            );

            if (isDuplicate) {
                args.cancel = true;
                alert("Duplicate entry detected. Please use unique values.");
            } else {
                if (args.action === "add") {
                    setData((prevData) => [...prevData, newData]);
                    createContact(user, newData);
                } else if (args.action === "edit") {
                    setData((prevData) =>
                        prevData.map((row) =>
                            row.email === newData.email ? newData : row
                        )
                    );
                }
            }
        }
    };

    // Custom template for First Name column with icon
    const firstNameTemplate = (props) => (
        <div style={{ display: "flex", alignItems: "center" }}>
            <img
                src="/avatar.png"
                alt="User"
                style={{ width: "20px", height: "20px", marginRight: "5px" }}
            />
            <span>{props.firstName}</span>
        </div>
    );

    // Custom template for Phone Number column with icon
    const phoneTemplate = (props) => (
        <div style={{ display: "flex", alignItems: "center" }}>
            <img
                src="/contact.png"
                alt="Phone"
                style={{ width: "20px", height: "20px", marginRight: "5px" }}
            />
            <span>{props.phoneNumber}</span>
        </div>
    );

    const emailTemplate = (props) => (
        <div style={{ display: "flex", alignItems: "center" }}>
            <img
                src="/maillogo.png"
                alt="Phone"
                style={{ width: "20px", height: "20px", marginRight: "5px" }}
            />
            <span>{props.email}</span>
        </div>
    );


    return (
        <div className="control-section">
            <GridComponent
                dataSource={data}
                height="200"
                width={"750px"}
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
                        field="id"
                        headerText="ID"
                        isPrimaryKey={true}
                        visible={false}
                    />
                    <ColumnDirective
                        field="firstName"
                        headerText="First Name"
                        width="150"
                        template={firstNameTemplate}
                        validationRules={{ required: true }}
                    />
                    <ColumnDirective
                        field="email"
                        headerText="Email"
                        width="200"
                        template={emailTemplate}
                        validationRules={{
                            required: true,
                            email: true,
                        }}
                    />
                    <ColumnDirective
                        field="phoneNumber"
                        headerText="Phone Number"
                        width="150"
                        template={phoneTemplate}
                        validationRules={{
                            required: true,
                            minLength: 10,
                            maxLength: 10,
                        }}
                    />
                </ColumnsDirective>
                <Inject services={[Sort, Filter, Toolbar, Edit]} />
            </GridComponent>
        </div>
    );
};

export default ContactList;
