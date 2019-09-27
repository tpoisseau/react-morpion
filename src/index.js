import React from 'react';
import ReactDOM from 'react-dom';
import Game from './Game';

import './index.css';

ReactDOM.render(
    <Game x={8} y={6} winLength={4} />,
    document.getElementById('root'),
);
