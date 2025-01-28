import React from 'react';
import MessageLogList from '../../components/MessageLogs/MessageLogList';
import { useEffect, useState } from 'react';
import axios from 'axios';

const SmsPage = () => {
    const [messageLogs, setMessageLogs] = useState([]);

    useEffect(() => {
        const fetchMessageLogs = async () => {
            try {
                const response = await axios.get('/api/sms/messageLogs');
                setMessageLogs(response.data);
            } catch (error) {
                console.error('Error fetching message logs:', error);
            }
        };

        fetchMessageLogs();
    }, []);

    return (
        <div>
            <h1>SMS Page</h1>
            <p>Welcome to the SMS Page. Here you can manage your SMS messages.</p>
            <MessageLogList logs={messageLogs} />
        </div>
    );
};

export default SmsPage;
