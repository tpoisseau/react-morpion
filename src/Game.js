import React, {useReducer} from 'react';
import {useHistory} from './hooks';
import Board from './Board';
import Matrix2D from './Matrix';
import calculateWinner from './calculateWinner';

function reducer(oldState, newState) {
    return {...oldState, ...newState};
}

export default function Game(props) {
    const [{x, y, winLength}, dispatch] = useReducer(reducer, props);

    const {current: {matrix, next, winner}, history, appendState, rewindState, resetState} = useHistory({
        matrix: new Matrix2D(x, y),
        next: 'X',
        winner: null,
    });

    function buildDimensionChange(dim) {
        return ({target: {value}}) => dispatch({[dim]: Number(value)});
    }

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
                <form>
                    <label>
                        xSize:
                        <input value={x} onChange={buildDimensionChange('x')}/>
                    </label><br/>
                    <label>
                        ySize:
                        <input value={y} onChange={buildDimensionChange('y')}/>
                    </label><br/>
                    <label>
                        winLength:
                        <input value={winLength} onChange={buildDimensionChange('winLength')}/>
                    </label><br/>
                </form>
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