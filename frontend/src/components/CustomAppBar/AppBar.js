import React from 'react';
import { AppBarComponent } from '@syncfusion/ej2-react-navigations';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import './AppBar.css';
const AppBar = () => {
    return (
        <AppBarComponent colorMode='Primary'>

            {/* Center Section: Title */}
            <div className="appbar-section" style={{ flex: 2, textAlign: 'left' }}>
                <span className="appName">Home</span>
            </div>

            {/* Right Section: Icons/Buttons */}
            <div className="appbar-section" style={{ flex: 1, textAlign: 'right' }}>
                <ButtonComponent cssClass="small-btn">Login</ButtonComponent>
                <ButtonComponent cssClass="small-btn">Sign Up</ButtonComponent>
            </div>
        </AppBarComponent>
    );
};

export default AppBar;
