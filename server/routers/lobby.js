import { Router } from 'express';
import { manager } from '../manager.js';
import { lobbyIsReady, selectLobby } from '../lobby.js';

const router = Router();

router.get('/teams', function (_, res) {
    res.send({
        teams: selectLobby(manager)
    })
});

router.get('/all', function (_, res) {
    res.send({
        users: Array.from(manager.users())
    })
});

router.get('/ready', (_, res) => {
    res.send({
        ready: lobbyIsReady(manager)
    })
});

export { router as lobbyRouter };