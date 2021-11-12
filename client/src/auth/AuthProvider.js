import React, { useState, useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './context';
import { authService } from './service';

export default function AuthProvider({ children }) {
    let [user, setUser] = useState(null);

    let signin = async (newUser) => {
        const user = await authService.signin(newUser);
        setUser(user);
    };

    let signout = (callback) => {
        return authService.signout(() => {
            setUser(null);
            callback();
        });
    };

    let value = { user, signin, signout, setUser };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}

export function RequireAuth({ children }) {
    let auth = useAuth();
    let location = useLocation();

    if (!auth.user) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/login" state={{ from: location }} />;
    }

    return children;
}