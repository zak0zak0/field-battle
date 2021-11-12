function selectLobby(map) {
    const lobby = {
        team1: [],
        team2: []
    }
    for (let [id] of map.entries()) {
        const user = map.get(id).user;
        if (user.team) {
            lobby[user.team].push(user);
        }
    }
    return lobby;
}

function sendUpdateMessage(ws, lobby) {
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
    const lobby = selectLobby(map);
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
    storedUser.team = team;
    for (let [id] of map.entries()) {
        sendUpdateMessage(map.get(id), selectLobby(map));
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