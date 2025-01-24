import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../authentication/auth-context";

const HomePage = () => {
    useEffect(() => {
        console.log("HomePage");
    }, []);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (

        <div style={{ padding: "20px" }}>
            <h1>Welcome, {user.email}</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default HomePage;
