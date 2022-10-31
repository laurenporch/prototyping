import React from 'react';
import ReactDOM from 'react-dom';
import Message from './js/Message';

import './css/style.css';

ReactDOM.render(
    <Message />,
    document.getElementById('react-container')
);

// Needed for Hot Module Replacement
if (typeof(module.hot) !== 'undefined') {
    module.hot.accept() // eslint-disable-line no-undef
}