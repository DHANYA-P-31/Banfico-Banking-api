const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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