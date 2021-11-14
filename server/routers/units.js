import { Router } from 'express';
import { manager } from '../manager.js';
import { placeUnit, getUnitsByTeam } from '../unitsManager.js';

const router = Router();

router.post('/place', function (req, res) {
    const user = manager.get(req.session.userId);
    const data = req.body;
    placeUnit(manager, user, data.unit, data.x, data.y);
    res.status(201);
    res.send();
});

router.get('/', function (req, res) {
    const team = manager.get(req.session.userId).team;
    res.send({
        units: getUnitsByTeam(team)
    });
});

export { router as unitsRouter };