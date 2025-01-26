import React from 'react';
import { SplitterComponent, PanesDirective, PaneDirective } from '@syncfusion/ej2-react-layouts';
// import { useAuth } from "../../authentication/AuthContext";
import { Outlet } from "react-router-dom";
const HomePageContainer = () => {
    // const { user } = useAuth();

    return (
        <SplitterComponent height="100vh" width="100%" orientation="Horizontal">
            <PanesDirective>
                <PaneDirective
                    content={() => (
                        <div style={{ padding: '10px', textAlign: 'left' }}>
                            <Outlet /> {/* Render child routes */}
                        </div>
                    )}
                />
            </PanesDirective>
        </SplitterComponent>
    );
};

export default HomePageContainer;
