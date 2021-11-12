import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { manager } from "./server/manager.js";
import { handleMessage } from "./server/messages.js";
import { User } from "./common/user.js";

export function startServer(app, sessionParser) {

    const server = createServer(app);
    const wss = new WebSocketServer({ clientTracking: false, noServer: true, path: '/websocket' });

    server.on('upgrade', function (request, socket, head) {
        console.log('Parsing session from request...');

        sessionParser(request, {}, () => {
            if (!request.session.user) {
                socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
                socket.destroy();
                return;
            }

            console.log('Session is parsed!');

            wss.handleUpgrade(request, socket, head, function (ws) {
                wss.emit('connection', ws, request);
            });
        });
    });

    wss.on('connection', function (ws, request) {
        const { user } = request.session;
        Object.setPrototypeOf(user, User.prototype);
        const { id } = user;

        manager.user(id, user);
        manager.set(id, ws);

        ws.on('message', handleMessage(manager, user));

        ws.on('close', function () {
            manager.delete(id, ws);
            console.log(`Socket for user ${user} was closed`);
        });
    });

    server.listen(8080, function () {
        console.log('http://localhost:8080');
    });
}