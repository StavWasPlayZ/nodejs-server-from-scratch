import { IncomingMessage } from "http";
import { getSessionByCookie } from "./cookies.js";

/**
 * A meta HTML header that indicates the browser to refresh this page
 */
export const refHeader = '<meta http-equiv="refresh" content="0; url=/">';

/**
 * 
 * @param {IncomingMessage} req
 * @param {string} queryParams The parameters to analize
 * @param {boolean} attachUrl Should the given `queryParams` be parsed as a URL format? (`req.url+"?"+queryParams`)
 * @returns 
 */
export const getQueryParams = (req, queryParams, attachUrl) =>
    new URL(attachUrl ? (req.url+"?"+queryParams) : queryParams, "http://"+req.headers.host).searchParams;
export const setCookieSessionId = (res, sessionId) =>
    res.setHeader("Set-Cookie", `sessionId=${sessionId};Max-Age=${process.env.SESSION_TIMEOUT * 60};HttpOnly;SameSite=Lax`);

/**
 * Redirects the user if a session exists in his cookies.
 * Should be called if the route accepts non-logged in users only
 * @returns {boolean} True if this function should redirect, false otherwise
 */
export function redRegister(req, res, endRes = true) {
    if (!getSessionByCookie(req.headers.cookie))
        return false;

    res.statusCode = 302;
    res.setHeader("Location", "/");
    if (endRes)
        res.end();
    return true;
}