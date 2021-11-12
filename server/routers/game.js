import { Router } from 'express';
import { gameManager } from '../gamemanager.js';

const router = Router();

router.get('/', function (req, res) {
    res.send({
        gameState: gameManager.state
    })
});

export { router as gameRouter };