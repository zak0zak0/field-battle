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
            return data.user;
        }
        return null;
    },

    async signin(login) {
        authService.isAuthenticated = true;

        await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: login }),
        });
    },

    signout(callback) {
        authService.isAuthenticated = false;
        setTimeout(callback, 100);
    }
}

export { authService };