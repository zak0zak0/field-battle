import { useEffect } from "react";
import { useAuth } from "../auth/AuthProvider";
import { startSockets } from ".";

export default function useWebsockets() {
    const auth = useAuth();
    useEffect(() => {
        if (auth.user) {
            startSockets();
        }
    }, []);
}