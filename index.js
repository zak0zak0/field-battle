'use strict';

import session from 'express-session';
import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import { authRouter } from './server/auth.js';
import handleMessage from './server/messages.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const map = new Map();

const sessionParser = session({
    saveUninitialized: false,
    secret: '$eCuRiTy',
    resave: false
});

app.use(express.static('client/dist'));
app.use(sessionParser);
app.use(express.json());
app.use(authRouter);
app.use(function (_, res) {
    res.sendFile(path.resolve(__dirname, 'client/dist/index.html'));
});

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
    ws.user = request.session.user;
    const { id } = ws.user;

    map.set(id, ws);


    ws.on('message', handleMessage(map, ws.user));

    ws.on('close', function () {
        map.delete(id);
        console.log(`Socket for user "${ws.user.name}" id=${id} was closed`);
    });
});

server.listen(8080, function () {
    console.log('http://localhost:8080');
});