import React from 'react';

export default function Square({onClick, children}) {
    return (
        <button
            className="cell"
            onClick={onClick}
        >
            {children}
        </button>
    );
}