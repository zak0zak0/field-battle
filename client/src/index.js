import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import AuthProvider from './auth';
import './index.css';

// Opt-in to Webpack hot module replacement
if (process.env.NODE_ENV === 'development') {
    if (module.hot) module.hot.accept();
}


/* eslint-disable no-undef */
ReactDOM.render(
    <AuthProvider>
        <App />
    </AuthProvider>,
    document.getElementById('app'),
);