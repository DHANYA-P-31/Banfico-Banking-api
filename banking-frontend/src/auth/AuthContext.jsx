import { createContext, useContext, useEffect, useRef, useState } from "react";
import keycloak from "../keycloak.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [initialized, setInitialized] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const initCalled = useRef(false);

    useEffect(() => {
        if (initCalled.current) return;
        initCalled.current = true;

        keycloak
            .init({
                onLoad: "check-sso",
                pkceMethod: "S256",
                checkLoginIframe: false,
            })
            .then((auth) => {
                setAuthenticated(auth);
                setInitialized(true);
            })
            .catch((error) => {
                console.error("Keycloak init failed:", error);
                setInitialized(true);
            });

        keycloak.onTokenExpired = () => {
            keycloak
                .updateToken(30)
                .catch(() => keycloak.login());
        };
    }, []);

    const hasRole = (role) => keycloak.hasRealmRole(role);
    const login = () => keycloak.login({ redirectUri: window.location.origin });

    const value = {
        initialized,
        authenticated,
        username: keycloak.tokenParsed?.preferred_username,
        hasRole,
        login,
        keycloak,
        logout: () => keycloak.logout({ redirectUri: window.location.origin }),
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}