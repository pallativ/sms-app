import React from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Toolbar, Edit, Inject } from '@syncfusion/ej2-react-grids';
import { useRef } from 'react';



const TenantsList = () => {
    const toolbarOptions = ['Add'];
    const gridRef = useRef(null);

    const handleToolbarClick = (args) => {
        // if (args.item.id.includes('Add')) {
        //     alert('Add button clicked');
        //     // Add your custom logic here
        // }
    };

    const actionBegin = (args) => {
        if (args.requestType === 'save') {
            alert('Saving Record:', args.data);

            // Custom logic before saving
            if (!args.data.CustomerName) {
                alert('Customer Name is required!');
                args.cancel = true; // Prevents saving if validation fails
            }
        }
    };

    const tenantsData = [
        { tenantCode: 'T001', tenantName: 'Tenant One', adminEmail: 'pkondalu@gmail.com' },
        { tenantCode: 'T002', tenantName: 'Tenant Two', adminEmail: 'veera@msgrouter.in' },
        // Add more tenant data here
    ];

    return (
        <div>
            <GridComponent dataSource={tenantsData} editSettings={{
                allowEditing: true, allowAdding: true, allowDeleting: true,
                mode: 'Dialog'
            }}
                ref={gridRef}
                toolbar={toolbarOptions}
                actionBegin={actionBegin} // Handle Save
                toolbarClick={handleToolbarClick}>
                <ColumnsDirective>
                    <ColumnDirective field='tenantCode' headerText='Tenant Code' isPrimaryKey={true} width='150' textAlign='left' />
                    <ColumnDirective field='tenantName' headerText='Tenant Name' width='200' textAlign='left' />
                    <ColumnDirective field='adminEmail' headerText='Admin Email' width='250' textAlign='Left' />
                </ColumnsDirective>
                <Inject services={[Edit, Toolbar]} />
            </GridComponent>
        </div>
    );
};

export default TenantsList;

