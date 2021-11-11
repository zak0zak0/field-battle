const authService = {
    isAuthenticated: false,

    async signin(login) {
        authService.isAuthenticated = true;

        await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ login }),
        });
    },

    signout(callback) {
        authService.isAuthenticated = false;
        setTimeout(callback, 100);
    }
}

export { authService };