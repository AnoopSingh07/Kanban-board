import React from 'react';
import '../styles/Card.css';

const priorityDescriptions = {
    0: "No Priority",
    1: "Low",
    2: "Medium",
    3: "High",
    4: "Urgent"
};

const priorityIcons = {
    0: '/assets/No-priority.svg',
    1: '/assets/Img - Low Priority.svg',
    2: '/assets/Img - Medium Priority.svg',
    3: '/assets/Img - High Priority.svg',
    4: '/assets/SVG - Urgent Priority colour.svg'
};

const Card = ({ ticket, avatar }) => {
    return (
        <div className="card">
            <div className="card-header">
                <span className="card-id">{ticket.id}</span>
                <span className="user-avatar">
                    <div
                        className="avatar"
                        style={{
                            backgroundColor: avatar?.backgroundColor || '#ccc',
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: '14px',
                        }}
                    >
                        {avatar?.initials || 'U'}
                    </div>
                </span>
            </div>
            <h4 className="card-title">{ticket.title}</h4>
            <div className="card-footer">
                <div className="priority-icon">
                    <img
                        src={priorityIcons[ticket.priority]}
                        alt={`${priorityDescriptions[ticket.priority]} Priority`}
                    />
                </div>
                {ticket.tag && ticket.tag.map(t => (
                    <span className={`tag ${t === 'Feature Request' ? 'feature-request' : ''}`} key={t}>
                        {t === 'Feature Request' && <span className="dot"></span>}
                        {t}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default Card;