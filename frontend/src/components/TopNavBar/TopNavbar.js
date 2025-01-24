import React from 'react';
import { ToolbarComponent, ItemsDirective, ItemDirective } from '@syncfusion/ej2-react-navigations';
import { useAuth } from "../../authentication/AuthContext";
import './TopNavbar';

const TopNavbar = () => {
    const { user } = useAuth();
    return (
        <ToolbarComponent cssClass="custom-navbar">
            <ItemsDirective>
                {/* Add the logo */}
                <ItemDirective prefixIcon="e-icons e-home" text="" align="Left" />

                {/* Add navigation links */}
                <ItemDirective text="Contacts" align="left" />
                <ItemDirective text="Sms" align="left" />
                <ItemDirective text="Contact" align="left" />
                <ItemDirective text={user.email} align="right" />

                {/* Add user profile or settings */}
                <ItemDirective prefixIcon="e-icons e-user" align="Right" tooltipText="Profile" />
                <ItemDirective prefixIcon="e-icons e-settings" align="Right" tooltipText="Settings" />
            </ItemsDirective>
        </ToolbarComponent>
    );
};
export default TopNavbar;
