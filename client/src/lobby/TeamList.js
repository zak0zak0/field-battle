import React from "react";
import { useAuth } from '../auth/AuthProvider';

export default function TeamList({ usersData }) {
    const { user } = useAuth();

    return (
        <div className="team-list">
            {usersData?.map(({ id, name, color, ready }) => (
                <div className={
                    `team-list-entry ${id === user.id ? "active-player" : ""}`}
                    key={id}
                >
                    <span className="player-color" style={{ backgroundColor: color }}></span>
                    <span className={`${ready ? "ready" : ""}`}>
                        {name}
                    </span>
                </div>
            ))}
        </div>
    );
}