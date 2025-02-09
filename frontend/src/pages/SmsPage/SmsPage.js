import React from "react";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Outlet } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import './SmsPage.css';
const SmsPage = () => {
    const [messageLogs, setMessageLogs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMessageLogs = async () => {
            try {
                const response = await axios.get('/api/sms/messageLogs');
                setMessageLogs(response.data.logs);
            } catch (error) {
                console.error('Error fetching message logs:', error);
            }
        };

        fetchMessageLogs();
    }, []);

    return (
        <div>
            <h1>SMS Page</h1>
            <button onClick={() =>  navigate('/home/sms/messageLogs')}>Go to Message Log</button>
            <Outlet />
        </div>
    );
};

export default SmsPage;
