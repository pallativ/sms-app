import React, { useEffect } from 'react';

const MessageLogList = ({ logs }) => {
    useEffect(() => {
        console.log('MessageLogList:', logs);
    })
    return (
        <div>
            <h2>Message Logs</h2>

        </div>
    );
};

export default MessageLogList;
