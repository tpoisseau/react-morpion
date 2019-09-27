import React from 'react';
import Square from './Square';

export default function Board({matrix, onCellClick}) {
    const cells = matrix.map((player, l, x, y) => <Square key={l} onClick={() => onCellClick(x, y)}>{player}</Square>).data;

    return (
        <div className="morpion" style={{gridTemplateColumns: `repeat(${matrix.xSize}, 34px)`}}>
            {cells}
        </div>
    );
}