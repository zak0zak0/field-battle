import { updateLobby, updateReadyStatus } from './lobby.js';

export default function handleMessage(manager, user) {
    return function message(dataJson) {
        const data = JSON.parse(dataJson);
        switch (data.type) {
            case 'SET_TEAM': {
                updateLobby(manager, user, data.team);
                console.log(`User ${user} has changed his team to ${user.team}`);
                return;
            }
            case 'LOBBY_READY': {
                updateReadyStatus(manager, user, data.ready);
                return;
            }
        }
        console.log(`unprocessed message: ${dataJson}`);
    }
}