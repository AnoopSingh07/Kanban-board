// src/components/DisplayMenu.js
import React, { useState, useRef, useEffect } from 'react';
import '../styles/DisplayMenu.css';

const Dropdown = ({ setGrouping, group, setOrdering, order }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleGroupingChange = (e) => {
        setGrouping(e.target.value);
    };

    const handleOrderingChange = (e) => {
        setOrdering(e.target.value);
    };

    const DisplayMenu = ({ grouping, ordering, handleGroupingChange, handleOrderingChange }) => {
        return (
            <div className="display-menu">
                <div className="menu-item">
                    <label htmlFor="grouping-select">Grouping:</label>
                    <select id="grouping-select" value={grouping} onChange={handleGroupingChange}>
                        <option value="status">Status</option>
                        <option value="user">User</option>
                        <option value="priority">Priority</option>
                    </select>
                </div>
                <div className="menu-item">
                    <label htmlFor="ordering-select">Ordering:</label>
                    <select id="ordering-select" value={ordering} onChange={handleOrderingChange}>
                        <option value="priority">Priority</option>
                        <option value="title">Title</option>
                    </select>
                </div>
            </div>
        );
    };

    return (
        <div className="dropdown" ref={dropdownRef}>
            <button className="dropdown-toggle" onClick={toggleDropdown}>
                <span className="filter-icon">⚙️</span> Display
                <span className="arrow">{isOpen ? '▲' : <img src={'/assets/down.svg'} alt='▼'/>}</span>
            </button>
            {isOpen && (
                <div className="dropdown-menu">
                    <DisplayMenu
                        grouping={group}
                        ordering={order}
                        handleGroupingChange={handleGroupingChange}
                        handleOrderingChange={handleOrderingChange}
                    />
                </div>
            )}
        </div>
    );
};

export default Dropdown;