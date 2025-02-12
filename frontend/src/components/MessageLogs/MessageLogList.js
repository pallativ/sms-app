import React, { useEffect, useState } from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Inject, Toolbar } from "@syncfusion/ej2-react-grids";
import { ToDateTime } from '../../utilities/Utilities';

// Function to convert Unix seconds to formatted date
const dateSentTemplate = (item) => {
    return <span>{ToDateTime(item.dateSent._seconds, "dd-MMM-yyyy hh:mm a")}</span>;
};
const dateUpdatedTemplate = (item) => {
    return <span>{ToDateTime(item.updatedAt._seconds, "dd-MMM-yyyy hh:mm a")}</span>;
};

const statusTemplate = (item) => {
    const status = item.status.toUpperCase();
    const isDelivered = status === "DELIVERED";

    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "5px 12px",
                borderRadius: "12px",
                // fontWeight: "bold",
                //textTransform: "uppercase",
                backgroundColor: isDelivered ? "#d4edda" : "#f8d7da",
                color: isDelivered ? "#155724" : "#721c24"
            }}
        >
            {isDelivered ? "✅ Delivered" : "❌ Failure"}
        </span>
    );
};


const MessageLogList = ({ logs }) => {
    const [messageLogs, setMessageLogs] = useState([]);
    useEffect(() => {
        console.log('MessageLogList:', logs);
        setMessageLogs(logs);
    }, [logs]);
    return (
        <div>
            <h2>Message Logs</h2>
            <GridComponent
                dataSource={messageLogs}
                allowPaging={true} // Enables pagination
                toolbar={['Search']} // Adds a toolbar with search
                pageSettings={{ pageSize: 10 }} // Configures pagination (5 items per page)
                height="100%"
            >
                {/* Define columns */}
                <ColumnsDirective>
                    {/* <ColumnDirective field="Id" headerText="Message Id" textAlign="left" width="100" /> */}
                    <ColumnDirective field="from" headerText="Sent From" width="50" />
                    <ColumnDirective field="to" headerText="Sent To" width="50" />
                    <ColumnDirective field="body" headerText="Message Text" width="100" />
                    <ColumnDirective field="status" textAlign="center" headerText="Status" width="50" template={statusTemplate} />
                    <ColumnDirective field="dateSent" textAlign="Center" headerText="Sent On" width="50" template={dateSentTemplate} />
                    <ColumnDirective field="updatedAt" textAlign="Center" headerText="Last Update" width="50" template={dateUpdatedTemplate} />
                </ColumnsDirective>

                {/* Inject required modules */}
                <Inject services={[Page, Toolbar]} />
            </GridComponent>
        </div >
    );
};

export default MessageLogList;

