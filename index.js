'use strict';

import session from 'express-session';
import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import { authRouter } from './server/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const map = new Map();

//
// We need the same instance of the session parser in express and
// WebSocket server.
//
const sessionParser = session({
    saveUninitialized: false,
    secret: '$eCuRiTy',
    resave: false
});

//
// Serve static files from the 'public' folder.
//
app.use(express.static('client/dist'));
app.use(sessionParser);
app.use(express.json());
app.use(authRouter);
app.use(function (_, res) {
    res.sendFile(path.resolve(__dirname, 'client/dist/index.html'));
});

//
// Create an HTTP server.
//
const server = createServer(app);

//
// Create a WebSocket server completely detached from the HTTP server.
//
const wss = new WebSocketServer({ clientTracking: false, noServer: true });

server.on('upgrade', function (request, socket, head) {
    console.log('Parsing session from request...');

    sessionParser(request, {}, () => {
        if (!request.session.userId) {
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
    const userId = request.session.userId;

    map.set(userId, ws);

    ws.on('message', function (message) {
        //
        // Here we can now use session parameters.
        //
        console.log(`Received message ${message} from user ${userId}`);
    });

    ws.on('close', function () {
        map.delete(userId);
    });
});

//
// Start the server.
//
server.listen(8080, function () {
    console.log('http://localhost:8080');
});