import { v4 } from 'uuid';
import { Router } from 'express';

const router = Router();

router.get('/auth', function (req, res) {
    res.send({
        authenticated: typeof req.session.user !== 'undefined',
        user: req.session.user
    });
});
router.post('/login', function (req, res) {
    const id = v4();
    console.log(`Updating session for user "${req.body?.name ?? "<empty>"}" id=${id}`);
    req.session.user = {
        name: req.body?.name,
        id
    };
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