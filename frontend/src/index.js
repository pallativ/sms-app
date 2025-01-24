import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './styles/syncfusion'
import { registerLicense } from '@syncfusion/ej2-base';

if(process.env.REACT_APP_SYNCFUSION_LICENSE_KEY.length === 0) {
    console.error("REACT_APP_SYNCFUSION_LICENSE_KEY is not set");
}

registerLicense(process.env.REACT_APP_SYNCFUSION_LICENSE_KEY);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

