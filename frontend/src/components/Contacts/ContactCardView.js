import React from 'react';


const ContactCardView = ({ contact }) => {
    return (
        <React.Fragment>
            <div className='e-card profile' style={{ justifyContent: 'flex-start' }}>
                <div className="e-card-header">
                    <div className="e-card-header-image football e-card-corner" />
                    <div className="e-card-header-caption">
                        <div className="e-card-header-title">{contact.name}</div>
                        <div className="e-card-sub-title">{contact.position}</div>
                    </div>
                </div>
                <div className="e-card-content">
                    <p>Email: {contact.email}</p>
                    <p>Phone: {contact.phone}</p>
                </div>
                <div className="e-card-separator"></div>
                <div className="e-card-actions">
                    <button className="e-btn e-outline e-primary">View details</button>
                </div>
            </div>
        </React.Fragment>
    );
};

export default ContactCardView;
