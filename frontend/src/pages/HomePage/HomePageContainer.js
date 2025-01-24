import React from 'react';
import { SplitterComponent, PanesDirective, PaneDirective } from '@syncfusion/ej2-react-layouts';
import { useAuth } from "../../authentication/AuthContext";

const HomePageContainer = () => {
    const { user } = useAuth();

    return (
        <SplitterComponent height="100vh" width="100%" orientation="Horizontal">
            <PanesDirective>
                <PaneDirective
                    content={() => (
                        <div style={{ padding: '10px', textAlign: 'left' }}>

                            <h2>Welcome to the Home Page </h2>
                            <h3>{user.email}</h3>
                            <p>Main content goes here!</p>
                        </div>
                    )}
                />
            </PanesDirective>
        </SplitterComponent>
    );
};

export default HomePageContainer;
