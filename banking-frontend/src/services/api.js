import keycloak from "../keycloak.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || window.location.origin;

export default API_BASE_URL;

export async function parseErrorMessage(response, fallback = "Something went wrong.") {
    try {
        const body = await response.json();

        if (body.messages && typeof body.messages === "object") {
            return Object.values(body.messages).join(" ");
        }

        if (body.message) {
            return body.message;
        }
    } catch {
    }

    return fallback;
}

export async function authFetch(url, options = {}) {
    if (!keycloak.authenticated || !keycloak.token) {
        await keycloak.login({ redirectUri: window.location.href });
        throw new Error("Authentication required. Redirecting to login...");
    }

    try {
        await keycloak.updateToken(30);
    } catch (error) {
        await keycloak.login({ redirectUri: window.location.href });
        throw new Error("Session expired. Redirecting to login...");
    }

    const headers = {
        ...options.headers,
        Authorization: `Bearer ${keycloak.token}`,
    };

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
        await keycloak.login({ redirectUri: window.location.href });
        throw new Error("Session expired. Redirecting to login...");
    }

    return response;
}