const lobby = {
    team1: [],
    team2: []
}

function sendUpdateMessage(ws) {
    ws.send(JSON.stringify({
        type: 'LOBBY_TEAMS_UPDATE',
        teams: lobby,
    }));
}

function checkIfLobbyIsReady(map) {
    for (let [id] of map.entries()) {
        if (!map.get(id).user.lobbyReady) {
            return;
        }
    }
    console.log('Lobby is ready');
    for (let [id] of map.entries()) {
        map.get(id).send(JSON.stringify({
            type: 'LOBBY_ALL_READY',
            teams: lobby,
        }));
    }
}

export function updateLobby(map, user, team) {
    const storedUser = map.get(user.id).user;
    const prevTeam = storedUser.team;
    if (prevTeam == team) {
        return;
    }
    if (typeof prevTeam !== 'undefined' && lobby[prevTeam]?.includes(storedUser)) {
        const index = lobby[prevTeam].indexOf(storedUser);
        lobby[prevTeam].splice(index, 1);
    }
    storedUser.team = team;
    lobby[team].push(storedUser);
    for (let [id] of map.entries()) {
        sendUpdateMessage(map.get(id));
    }
}

export function updateReadyStatus(map, user, ready) {
    const storedUser = map.get(user.id).user;
    const prevStatus = storedUser.lobbyReady;
    if (prevStatus == player.lobbyReady) {
        return;
    }
    storedUser.lobbyReady = player.lobbyReady;
    console.log(`player #${storedUser.id}<${storedUser.name}> is ${storedUser.lobbyReady ? "" : "NOT"} ready`);
    checkIfLobbyIsReady(map);
}