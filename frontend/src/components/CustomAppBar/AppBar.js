import React from 'react';
import { AppBarComponent } from '@syncfusion/ej2-react-navigations';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import './AppBar.css';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../authentication/AuthContext";
const AppBar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <AppBarComponent colorMode='Primary'>

            <div style={{ flex: 3, textAlign: 'left' }}>
                <span onClick={() => navigate('contacts')} style={{paddingRight:40}}>Home</span>
                <ButtonComponent isPrimary="true" onClick={() => navigate('sms')} cssClass="small-btn">SMS</ButtonComponent>
                <ButtonComponent isPrimary="true" onClick={() => navigate('whatsup')} cssClass="small-btn">Whatsup</ButtonComponent>
                <ButtonComponent isPrimary="true" onClick={() => navigate('contacts')} cssClass="small-btn">Contacts</ButtonComponent>
                <ButtonComponent isPrimary="true" onClick={() => navigate('tenant-configuration')} cssClass="small-btn">Tenant Config</ButtonComponent>
                <ButtonComponent isPrimary="true" onClick={() => navigate('about')} cssClass="small-btn">About</ButtonComponent>
            </div>

            {/* Right Section: Icons/Buttons */}
            <div style={{ flex: 1, textAlign: 'Right' }}>
                <ButtonComponent onClick={handleLogout} isPrimary="true" cssClass="small-btn">LogOut</ButtonComponent>
            </div>
        </AppBarComponent>
    );
};

export default AppBar;
