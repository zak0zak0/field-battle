import React, { useState, useEffect } from 'react'
import {
    Routes,
    Route,
    useNavigate
} from "react-router-dom";
import Lobby from './lobby';
import Login from './login';
import Warzone from './warzone';
import { RequireAuth, useAuth } from './auth';
import { authService } from './auth/service';

const App = ({ props }) => {
    const auth = useAuth();
    const navigate = useNavigate();
    const [loaded, setLoaded] = useState(false);

    useEffect(async () => {
        const user = await authService.loaduser();
        if (user) {
            auth.setUser(user);
            navigate('/lobby');
        }
        setLoaded(true);
    }, []);

    return (
        <div className='container'>
            {
                loaded
                    ?
                    <Routes >
                        <Route path="/warzone" element={<RequireAuth><Warzone /></RequireAuth>} />
                        <Route path="/lobby" element={<RequireAuth><Lobby /></RequireAuth>} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={<Login />} />
                    </Routes >
                    : "loading..."
            }
        </div>
    )

}

export default App