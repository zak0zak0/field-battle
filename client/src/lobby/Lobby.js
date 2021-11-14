import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import useWebsockets from "../websockets/useWebsockets";
import './lobby.css';
import TeamList from './TeamList';

const Lobby = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const { sendMessage, eventSource } = useWebsockets();
    const [teams, setTeams] = useState({ team1: [], team2: [] });

    const onClick = (team) => {
        sendMessage({
            type: 'SET_TEAM',
            team
        });
    }

    useEffect(async () => {
        const response = await fetch('/lobby/teams');
        const { teams } = await response.json();
        setTeams(teams);

        eventSource.on('lobby-team-update', (teams) => {
            setTeams(teams);
        });

        eventSource.on('lobby-all-ready', () => {
            navigate('/warzone');
        });
    }, []);



    const onReadyClick = () => {
        sendMessage({
            type: 'LOBBY_READY',
            ready: !user.ready
        });
        setUser({
            ...user,
            ready: !user.ready
        })
    }

    return (
        <div className='block'>
            <h2>Select a team</h2>
            <div>
                <TeamList usersData={teams.team1} />
                <button onClick={() => onClick('team1')}>Team 1</button>
                <button onClick={() => onClick('team2')}>Team 2</button>
                <TeamList usersData={teams.team2} />
            </div>
            <button onClick={onReadyClick}>{!!user.ready ? "Not ready" : "Ready"}</button>
        </div>
    );
}

export default Lobby;