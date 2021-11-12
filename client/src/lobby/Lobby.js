import React from 'react';
import useWebsockets from "../websockets/useWebsockets";

const Lobby = () => {
    useWebsockets();

    return (<div>Lobby</div>)
}

export default Lobby;