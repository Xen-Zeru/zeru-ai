const API_URL =
    process.env.REACT_APP_API_URL ||
    "http://localhost:5000/api";

export async function apiRequest(
    endpoint,
    options = {}
) {
    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,

            credentials: "include",

            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {}),
            },
        }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const error = new Error(
            data.error || "Something went wrong."
        );

        error.status = response.status;
        error.code = data.code;

        throw error;
    }

    return data;
}