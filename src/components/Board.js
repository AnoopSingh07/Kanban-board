// src/components/Board.js
import React, { useState, useEffect } from 'react';
import { fetchTickets } from '../api';
import Card from './Card';
import DisplayMenu from './DisplayMenu';
import '../styles/Board.css';

const Board = () => {
    const [tickets, setTickets] = useState([]);
    const [users, setUsers] = useState([]);
    
    // Initialize state from localStorage, with fallbacks to default values.
    const [grouping, setGrouping] = useState(localStorage.getItem('grouping') || 'status');
    const [ordering, setOrdering] = useState(localStorage.getItem('ordering') || 'priority');
    
    const [avatars, setAvatars] = useState({});

    const priority = {
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

    const statusIcons = {
        'In progress': '/assets/in-progress.svg',
        'Done': '/assets/Done.svg',
        'Todo': '/assets/To-do.svg',
        'Backlog': '/assets/Backlog.svg',
        'Cancelled': '/assets/Cancelled.svg'
    };

    const colors = ['#e57373', '#81c784', '#64b5f6', '#ffb74d', '#a1887f'];

    const statuses = ['Todo', 'In progress', 'Done', 'Backlog', 'Cancelled'];

    useEffect(() => {
        const loadTickets = async () => {
            try {
                const data = await fetchTickets();
                console.log('API Data:', data);
                setTickets(data.tickets || []);
                setUsers(data.users || []);

                const newAvatars = {};
                data.users.forEach(user => {
                    if (!newAvatars[user.id]) {
                        newAvatars[user.id] = generateAvatar(user.name);
                    }
                });
                setAvatars(newAvatars);

            } catch (error) {
                console.error('Error fetching tickets:', error);
            }
        };

        loadTickets();
    }, []);

    // Save grouping and ordering to localStorage whenever they change.
    useEffect(() => {
        localStorage.setItem('grouping', grouping);
    }, [grouping]);

    useEffect(() => {
        localStorage.setItem('ordering', ordering);
    }, [ordering]);

    const generateAvatar = (name) => {
        const initials = name.split(' ').map(word => word[0]).join('');
        const backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        return { initials, backgroundColor };
    };

    const groupTickets = () => {
        if (!Array.isArray(tickets)) {
            return {};
        }

        switch (grouping) {
            case 'user':
                return tickets.reduce((acc, ticket) => {
                    const user_id = ticket.userId;
                    const user_name = users.find(user => user.id === user_id)?.name || 'Unassigned';
                    const user = user_name;
                    if (!acc[user]) acc[user] = [];
                    acc[user].push(ticket);
                    return acc;
                }, {});
            case 'priority':
                return tickets.reduce((acc, ticket) => {
                    if (!acc[ticket.priority]) acc[ticket.priority] = [];
                    acc[ticket.priority].push(ticket);
                    return acc;
                }, {});
            default: // Group by status
                const groupedByStatus = statuses.reduce((acc, status) => {
                    acc[status] = [];
                    return acc;
                }, {});
                return tickets.reduce((acc, ticket) => {
                    if (!acc[ticket.status]) acc[ticket.status] = [];
                    acc[ticket.status].push(ticket);
                    return acc;
                }, groupedByStatus);
        }
    };

    const groupedTickets = groupTickets();

    return (
        <div>
            <div className="nav">
                <div className="dropdown">
                    <DisplayMenu setGrouping={setGrouping} group={grouping} setOrdering={setOrdering} order={ordering} />
                </div>
            </div>
            <div className="board-container">
                <div className="board">
                    <div className="columns">
                        {Object.keys(groupedTickets).map((key, index) => (
                            <div key={index} className={`column ${groupedTickets[key].length === 0 ? 'empty' : ''}`}>
                                <div className="column-header">
                                    <div className="column-header-left">
                                        <div className="column-user-info">
                                            {grouping === 'user' && (
                                                <div className="user-avatar">
                                                    <div
                                                        className="avatar-small"
                                                        style={{
                                                            backgroundColor: avatars[groupedTickets[key][0]?.userId]?.backgroundColor || '#ccc',
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            color: '#fff',
                                                            fontWeight: 'bold',
                                                            fontSize: '14px',
                                                            marginRight: '10px'
                                                        }}
                                                    >
                                                        {avatars[groupedTickets[key][0]?.userId]?.initials || 'U'}
                                                    </div>
                                                    <h3>{key}</h3>
                                                </div>
                                            )}
                                            {grouping === "priority" && (
                                                <>
                                                    <img src={priorityIcons[key]} alt={`${priority[key]} Priority`} style={{ marginRight: '10px' }} />
                                                    <h3>{priority[key]}</h3>
                                                </>
                                            )}
                                            {grouping === "status" && (
                                                <>
                                                    <img src={statusIcons[key]} alt={`${key} status`} style={{ marginRight: '10px' }} />
                                                    <h3>{key}</h3>
                                                </>
                                            )}
                                            <span className="ticket-count">{groupedTickets[key].length}</span>
                                        </div>
                                    </div>
                                    <div className="column-header-right">
                                        <div className="icon-group">
                                            <img src={'/assets/add.svg'} alt='Add' className="icon"/>
                                            <img src={'/assets/3 dot menu.svg'} alt='Options' className="icon"/>
                                        </div>
                                    </div>     
                                </div>
                                {groupedTickets[key].sort((a, b) => {
                                    if (ordering === 'priority') return b.priority - a.priority;
                                    return a.title.localeCompare(b.title);
                                }).map(ticket => (
                                    <Card key={ticket.id} ticket={ticket} avatar={avatars[ticket.userId]} />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>           
        </div>
    );
};

export default Board;