import './styles/App.css';
import React from "react";
// import useAuth from './authentication/auth-state';
import LoginPage from "./components/LoginPage";
import HomePage from "./pages/HomePage/HomePage";
import { AuthProvider, useAuth } from "./authentication/AuthContext";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ContactsPage from "./pages/ContactPage/ContactPage";
import SmsPage from './pages/SmsPage/SmsPage';
import WhatsupPage from './pages/WhatsupPage/WhatsupPage';
import AboutPage from './pages/AboutPage/AboutPage';
import SendSms from './components/Sms/SendSms';
import MessageLogList from './components/MessageLogs/MessageLogList';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/home"
                        element={
                            <RequireAuth>
                                <HomePage />
                            </RequireAuth>
                        }
                    >
                        <Route index element={<Navigate to="contacts" />} />
                        <Route path="contacts" element={<ContactsPage />} />
                        <Route path="sms" element={<SmsPage />}>
                            <Route index element={<Navigate to="sendSms" />} />
                            <Route path="sendSms" element={<SendSms />} />
                            <Route path="messageLogs" element={<MessageLogList />} />
                        </Route>
                        <Route path="whatsup" element={<WhatsupPage />} />
                        <Route path="about" element={<AboutPage />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

// Redirects unauthenticated users to login
const RequireAuth = ({ children }) => {
    const { user } = useAuth();
    console.log("RequireAuth", user);
    return user ? children : <Navigate to="/" />;
};


export default App;
