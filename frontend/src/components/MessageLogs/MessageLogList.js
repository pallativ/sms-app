import React, { useEffect, useState } from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Inject, Toolbar } from "@syncfusion/ej2-react-grids";



const MessageLogList = ({ logs }) => {
    const [messageLogs, setMessageLogs] = useState([]);
    useEffect(() => {
        console.log('MessageLogList:', logs);
        setMessageLogs(logs);
    },[logs]);
    return (
        <div>
            <h2>Message Logs</h2>
            <GridComponent
                dataSource={messageLogs}
                allowPaging={true} // Enables pagination
                toolbar={['Search']} // Adds a toolbar with search
                pageSettings={{ pageSize: 10 }} // Configures pagination (5 items per page)
                height={300}
            >
                {/* Define columns */}
                <ColumnsDirective>
                    <ColumnDirective field="Id" headerText="Message Id" textAlign="left" width="100" />
                    <ColumnDirective field="to" headerText="Sent To" width="50" />
                    <ColumnDirective field="from" headerText="Sent From" width="50" />
                    <ColumnDirective field="body" headerText="Message Text" width="100" />
                    <ColumnDirective field="status" headerText="Status" width="50" />
                    <ColumnDirective field="dateSent" headerText="Sent On" width="50" />
                </ColumnsDirective>

                {/* Inject required modules */}
                <Inject services={[Page, Toolbar]} />
            </GridComponent>
        </div >
    );
};

export default MessageLogList;
