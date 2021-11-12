import { useEffect } from "react";
import { useAuth } from "../auth/AuthProvider";
import { startSockets, isOpen, sendMessage, eventSource } from '.';

export default function useWebsockets() {
    const auth = useAuth();
    useEffect(() => {
        if (auth.user && !isOpen()) {
            startSockets();
        }
    }, []);

    return { sendMessage, eventSource };
}