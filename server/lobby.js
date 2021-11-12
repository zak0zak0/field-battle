import { gameManager } from "./gamemanager.js";
import { gameState } from '../common/gamestate.js';

export function selectLobby(manager) {
    const lobby = {
        team1: [],
        team2: []
    }
    for (let user of manager.users()) {
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

export function lobbyIsReady(manager) {
    for (let user of manager.users()) {
        if (!user.ready) {
            return false;
        }
    }
    const length = Array.from(manager.users()).length;
    return length >= 2;
}

function sendLobbyReadyMessage(manager, lobby) {
    for (let ws of manager.sockets()) {
        ws.send(JSON.stringify({
            type: 'LOBBY_ALL_READY',
            teams: lobby,
        }));
    }
}

export function updateLobby(manager, user, team) {
    if (user.team == team) {
        return;
    }
    user.team = team;
    for (let ws of manager.sockets()) {
        sendUpdateMessage(ws, selectLobby(manager));
    }
}

export function updateReadyStatus(manager, user, ready) {
    if (user.ready == ready) {
        return;
    }
    user.ready = ready;
    console.log(`User ${user} is ${user.ready ? "" : "NOT"} ready`);
    for (let ws of manager.sockets()) {
        sendUpdateMessage(ws, selectLobby(manager));
    }
    if (lobbyIsReady(manager)) {
        console.log('Lobby is ready');
        gameManager.state = gameState.PLACEMENT;
        sendLobbyReadyMessage(manager, selectLobby(manager));
    }
}