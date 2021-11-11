import React from 'react'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from "react-router-dom";
import Lobby from './lobby';
import Login from './login';
import Warzone from './warzone';
import AuthProvider, { RequireAuth } from './auth';

const App = ({ props }) => (
    <AuthProvider>
        <Router>
            <Routes >
                <Route path="/warzone" element={<RequireAuth><Warzone /></RequireAuth>} />
                <Route path="/lobby" element={<RequireAuth><Lobby /></RequireAuth>} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Login />} />
            </Routes >
        </Router>
    </AuthProvider>
)

export default App