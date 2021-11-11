import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import AuthProvider from './auth';
import './index.css';
import './components/index.css';

// Opt-in to Webpack hot module replacement
if (process.env.NODE_ENV === 'development') {
    if (module.hot) module.hot.accept();
}


/* eslint-disable no-undef */
ReactDOM.render(
    <AuthProvider>
        <Router>
            <App />
        </Router>
    </AuthProvider>,
    document.getElementById('app'),
);