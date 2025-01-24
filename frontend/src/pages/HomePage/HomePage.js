import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../authentication/AuthContext";
import '../../styles/syncfusion'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import TopNavbar from "../../components/TopNavbar";
import HomePageContainer from "./HomePageContainer";

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
        <div>
            <TopNavbar />
            <HomePageContainer />
            <h1>Welcome, {user.email}</h1>
            <ButtonComponent onClick={handleLogout} cssClass="e-primary">Logout</ButtonComponent>
        </div>
    );
};

export default HomePage;
