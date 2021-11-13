import { User } from '../../../common/user';

const fakeUser = new User('12345');
fakeUser.name = 'TestUser';
fakeUser.color = '#FF0000';
fakeUser.team = 'team1';

const authService = {
    isAuthenticated: false,

    async loaduser() {
        if (process.env.NODE_ENV === 'development' && process.env.WEBPACK_DEV_SERVER) {
            return fakeUser;
        }

        const response = await fetch('/auth');
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        if (data.authenticated) {
            authService.isAuthenticated = true;
            Object.setPrototypeOf(data.user, User.prototype);
            return data.user;
        }
        return null;
    },

    async signin({ username: name, color }) {
        if (process.env.NODE_ENV === 'development' && process.env.WEBPACK_DEV_SERVER) {
            return fakeUser;
        }

        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, color }),
        });
        const user = (await response.json()).user;
        Object.setPrototypeOf(user, User.prototype);
        authService.isAuthenticated = true;
        return user;
    },

    signout(callback) {
        authService.isAuthenticated = false;
        setTimeout(callback, 100);
    }
}

export { authService };