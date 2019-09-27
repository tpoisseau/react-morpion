import React from 'react';
import {useHistory} from './hooks';
import Board from './Board';
import Matrix2D from './Matrix';
import calculateWinner from './calculateWinner';

export default function Game({x, y, winLength}) {
    const {current: {matrix, next, winner}, history, appendState, rewindState, resetState} = useHistory({
        matrix: new Matrix2D(x, y),
        next: 'X',
        winner: null,
    });

    function handleCellClick(x, y) {
        if (matrix.get(x, y) !== null) return; // disable click if case already checked
        if (winner !== null) return; // disable click if game terminated

        let _matrix = matrix.set(x, y, next);
        let _winner = calculateWinner(_matrix, x, y, winLength);
  
        appendState({
            matrix: _matrix,
            next: next === 'X' ? 'O' : 'X',
            winner: _winner,
        });
    }

    const status = winner === null
        ? `Joueur suivant: ${next}`
        : `${winner} a gagné !`;

    return (
        <div className="game">
            <div className="game-board">
                <p className="rules">
                    Le jeu est une grille de {x} par {y}<br />
                    Pour le gagner il faut aligner {winLength} jetons
                </p>
                <p>
                    <button onClick={resetState}>Réinitialiser le jeu ?</button>
                </p>
                <Board
                    matrix={matrix}
                    onCellClick={handleCellClick}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>{history.map(({rewind=false}, i) => (
                    <li key={i}>
                        <button onClick={() => rewindState(i)}>
                            {i > 0 ? `Revenir au tour n°${i}` : 'Revenir au début de la partie'}
                        </button>
                        {rewind !== false ? <span>embranchement du tour n° {rewind}</span> : ''}
                    </li>
                ))}</ol>
            </div>
        </div>
    );
}