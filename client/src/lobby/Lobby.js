import React, { useState } from 'react';
import useWebsockets from "../websockets/useWebsockets";
import './lobby.css';
import TeamList from './TeamList';

const Lobby = () => {
    const { sendMessage, eventSource } = useWebsockets();
    const [teams, setTeams] = useState({ team1: [], team2: [] });

    const onClick = (team) => {
        sendMessage({
            type: 'SET_TEAM',
            team
        });
    }

    eventSource.on('lobby-team-update', (teams) => {
        setTeams(teams);
    });

    console.log(teams);

    return (
        <div className='block'>
            <h2>Select a team</h2>
            <div>
                <TeamList usersData={teams.team1} />
                <button onClick={() => onClick('team1')}>Team 1</button>
                <button onClick={() => onClick('team2')}>Team 2</button>
                <TeamList usersData={teams.team2} />
            </div>
        </div>
    );
}

export default Lobby;