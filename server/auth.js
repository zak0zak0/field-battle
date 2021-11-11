import { v4 } from 'uuid';
import { Router } from 'express';

const router = Router();

router.post('/login', function (req, res) {
    //
    // "Log in" user and set userId to session.
    //
    const id = v4();

    console.log(`Updating session for user ${id}`);
    req.session.userId = id;
    res.send({ result: 'OK', message: 'Session updated' });
});

router.delete('/logout', function (request, response) {
    const ws = map.get(request.session.userId);

    console.log('Destroying session');
    request.session.destroy(function () {
        if (ws) ws.close();

        response.send({ result: 'OK', message: 'Session destroyed' });
    });
});

export { router as authRouter };