'use strict';

import session from 'express-session';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { authRouter } from './server/routers/auth.js';
import { lobbyRouter } from './server/routers/lobby.js';
import { startServer } from './server_start.js';
import { gameRouter } from './server/routers/game.js';
import { unitsRouter } from './server/routers/units.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const sessionParser = session({
    saveUninitialized: false,
    secret: '$eCuRiTy',
    resave: false
});

app.use(express.static('client/dist'));
app.use(sessionParser);
app.use(express.json());
app.use(authRouter);
app.use('/lobby', lobbyRouter);
app.use('/game', gameRouter);
app.use('/units', unitsRouter);
app.use(function (_, res) {
    res.sendFile(path.resolve(__dirname, 'client/dist/index.html'));
});

startServer(app, sessionParser);