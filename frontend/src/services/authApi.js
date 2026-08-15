import { apiRequest } from "./api";

export function loginUser(email, password) {
    return apiRequest("/auth/login", {
        method: "POST",

        body: JSON.stringify({
            email,
            password,
        }),
    });
}

export function registerUser(
    name,
    email,
    password
) {
    return apiRequest("/auth/register", {
        method: "POST",

        body: JSON.stringify({
            name,
            email,
            password,
        }),
    });
}

export function logoutUser() {
    return apiRequest("/auth/logout", {
        method: "POST",
    });
}

export function getCurrentUser() {
    return apiRequest("/auth/me");
}