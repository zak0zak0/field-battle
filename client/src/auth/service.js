const authService = {
    isAuthenticated: false,

    signin(callback) {
        authService.isAuthenticated = true;
        setTimeout(callback, 100); // fake async
    },

    signout(callback) {
        authService.isAuthenticated = false;
        setTimeout(callback, 100);
    }
}

export { authService };