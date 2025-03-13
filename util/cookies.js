import { sessions } from "./Session.js";

//TODO: Make linear search function
/**
 * @param {string} cookie
 * @returns {Object.<string, string>} The cookie as a KVP
 */
export function parseCookie(cookie) {
    if (!cookie)
        return ({});

    const result = {};
    cookie.split("; ").forEach((cookie) => {
        const splitCookie = cookie.split("=");
        result[splitCookie[0]] = splitCookie[1];
    });
    return result;
}

/**
 * @param {string} cookie
 * @returns The session as defined in the `sessionId` field of the given cookie.
 */
export const getSessionByCookie = (cookie) => {
    const parsedCookie = parseCookie(cookie);
    if (parsedCookie)
        return sessions[parsedCookie.sessionId];
}