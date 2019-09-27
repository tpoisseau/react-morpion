import React from 'react';
import ReactDOM from 'react-dom';
import Game from './Game';

import './index.css';

ReactDOM.render(
    <Game x={8} y={6} winLength={3} />,
    document.getElementById('root'),
);
