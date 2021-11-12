import { EventSource } from './eventsource';

let socket = null;
const eventSource = new EventSource()

export function isOpen() {
    return socket !== null;
}

export function startSockets() {
    if (socket) {
        return;
    }
    socket = new WebSocket(`ws://localhost:8080/websocket`)

    socket.onopen = function () {
        console.log('socket is open');
    }

    socket.onmessage = function (e) {
        const data = JSON.parse(e.data);
        console.log(`event received: ${e.data}`);
        switch (data.type) {
            case 'LOBBY_TEAMS_UPDATE': {
                eventSource.trigger('lobby-team-update', data.teams);
                break;
            }
            case 'LOBBY_ALL_READY': {
                eventSource.trigger('lobby-all-ready', data.teams);
                break;
            }
        }
    }

    socket.onclose = function (event) {
        if (event.wasClean) {
            console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
            // e.g. server process killed or network down
            // event.code is usually 1006 in this case
            console.warn(`[close] Connection died, code=${event.code} reason=${event.reason}`);
        }
    };

    socket.onerror = function (error) {
        console.error(`[error]`, error);
    };
}

export function sendMessage(message) {
    if (typeof message !== 'string') {
        message = JSON.stringify(message);
    }
    socket.send(message);
}

export { eventSource };