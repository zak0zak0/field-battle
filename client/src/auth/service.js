import { User } from '../../../common/user';
const authService = {
    isAuthenticated: false,

    async loaduser() {
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
        authService.isAuthenticated = true;

        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, color }),
        });
        const user = (await response.json()).user;
        Object.setPrototypeOf(user, User.prototype);
        return user;
    },

    signout(callback) {
        authService.isAuthenticated = false;
        setTimeout(callback, 100);
    }
}

export { authService };