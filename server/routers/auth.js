import { v4 } from 'uuid';
import { Router } from 'express';
import { User } from '../../common/user.js';

const router = Router();

router.get('/auth', function (req, res) {
    const { user } = req.session;
    const response = {
        authenticated: typeof user !== 'undefined',
        user
    }
    res.send(response);
    if (response.authenticated) {
        Object.setPrototypeOf(user, User.prototype);
        console.log(`Restored session for ${user}`)
    }
});
router.post('/login', function (req, res) {
    const id = v4();
    console.log(`Updating session for user "${req.body?.name ?? "<empty>"}" id=${id}`);
    const user = new User(id);
    user.name = req.body.name;
    user.color = req.body.color;
    req.session.user = user;
    res.send({ result: 'OK', user });
});

router.delete('/logout', function (request, response) {
    throw new Error('/logout is not implemented');
    const ws = map.get(request.session.user.id);

    console.log(`Destroying session for user ${request.session.user}`);
    request.session.destroy(function () {
        if (ws) ws.close();

        response.send({ result: 'OK', message: 'Session destroyed' });
    });
});

export { router as authRouter };