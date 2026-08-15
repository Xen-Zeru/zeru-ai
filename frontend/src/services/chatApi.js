import { apiRequest } from "./api";

export function sendMessage({
    message,
    chatId = null,
    fileData = null,
    fileName = null,
    fileType = null,
    history = [],
}) {
    return apiRequest("/chat", {
        method: "POST",

        body: JSON.stringify({
            message,
            chatId,
            fileData,
            fileName,
            fileType,
            history,
        }),
    });
}

export function getChats() {
    return apiRequest("/chats");
}

export function getChat(chatId) {
    return apiRequest(`/chats/${chatId}`);
}

export function deleteChat(chatId) {
    return apiRequest(`/chats/${chatId}`, {
        method: "DELETE",
    });
}

export function toggleFavoriteChat(chatId) {
    return apiRequest(`/chats/${chatId}/favorite`, {
        method: "PATCH",
    });
}