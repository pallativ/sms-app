import './styles/App.css';
import React from "react";
// import useAuth from './authentication/auth-state';
import LoginPage from "./components/LoginPage";
import HomePage from "./pages/HomePage/HomePage";
import { AuthProvider, useAuth } from "./authentication/auth-context";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";


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
                    />
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
