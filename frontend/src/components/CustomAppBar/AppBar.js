import React from 'react';
import { AppBarComponent, MenuComponent, MenuItemModel } from '@syncfusion/ej2-react-navigations';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import './AppBar.css';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../authentication/AuthContext";
const AppBar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <AppBarComponent colorMode='Primary'>

            <div style={{ flex: 3, textAlign: 'left' }}>
                <span style={{paddingRight:40}}>Home</span>
                <ButtonComponent isPrimary="true" cssClass="small-btn">SMS</ButtonComponent>
                <ButtonComponent isPrimary="true" cssClass="small-btn">Whatsup</ButtonComponent>
                <ButtonComponent isPrimary="true" cssClass="small-btn">Contacts</ButtonComponent>
                <ButtonComponent isPrimary="true" cssClass="small-btn">About</ButtonComponent>
            </div>

            {/* Right Section: Icons/Buttons */}
            <div style={{ flex: 1, textAlign: 'Right' }}>
                <ButtonComponent onClick={handleLogout} isPrimary="true" cssClass="small-btn">LogOut</ButtonComponent>
            </div>
        </AppBarComponent>
    );
};

export default AppBar;
