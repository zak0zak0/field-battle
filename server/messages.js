import { updateLobby, updateReadyStatus } from './lobby.js';

export default function handleMessage(map, user) {
    return function message(dataJson) {
        const data = JSON.parse(dataJson);
        switch (data.type) {
            case 'SET_TEAM': {
                updateLobby(map, user, data.team);
                console.log(`player #${user.id}<${user.name}> has changed a team to ${user.team}`);
                return;
            }
            case 'LOBBY_READY': {
                updateReadyStatus(map, user, data.ready);
                return;
            }
        }
        console.log(`unprocessed message: ${dataJson}`);
    }
}