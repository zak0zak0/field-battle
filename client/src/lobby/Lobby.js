import React, { useEffect } from 'react';
import { startSockets } from "../websockets";
import { useAuth } from '../auth/AuthProvider';

const Lobby = () => {
    const auth = useAuth();
    useEffect(() => {
        if (auth.user) {
            startSockets();
        }
    }, []);

    return (<div>Lobby</div>)
}

export default Lobby;