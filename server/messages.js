import { updateLobby, updateReadyStatus } from './lobby.js';
import { placeUnit } from './unitsmanager.js';

export function handleMessage(manager, id) {
    return function message(dataJson) {
        const user = manager.get(id);
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
            case 'TRY_PLACE_UNIT': {
                placeUnit(manager, user, data.unit, data.x, data.y);
                return;
            }
        }
        console.log(`unprocessed message: ${dataJson}`);
    }
}