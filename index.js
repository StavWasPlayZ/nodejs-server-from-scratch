import { config } from "dotenv"
config();

import { createServer, IncomingMessage, ServerResponse } from "http";
import * as routes from "./routes/routes.js";
import { readFileSync } from "fs";
import { throwErrorPage, loadEJS } from "./util/pageLoaders.js";

import { default as mssql } from "mssql";
import { refreshUserSession, sessions } from "./util/Session.js";
import { parseCookie } from "./util/cookies.js";


const PORT = process.env.PORT || 3000;

const SERVER = createServer(async (req, res) => {
    // Check if given session ID is valid
    const sessionId = parseCookie(req.headers.cookie).sessionId;
    if (sessionId && !sessions[sessionId])
        //FIXME Temporary fix: just sets the sent cookies to null for the rest of the calls
        req.headers.cookie = null;

    if (await handleRequest(req, res))
        // Could've updated, safe to call again
        refreshSession(req);
})
/**
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 * @returns Whether this request was processed with no errors
 */
async function handleRequest(req, res) {
    const paramIndex = req.url.indexOf("?"), file = (paramIndex > 0) ? req.url.substring(0, paramIndex) : req.url,
        route = routes.routes[file];
    
    if (route == undefined) {
        // Requested item may not be a route, but rather a file
        try {
            // Firefox seems to not like MIMEless javascript
            if (file.endsWith(".js"))
                res.setHeader("Content-Type", "text/javascript");

            res.write(readFileSync("./resources"+file));
            res.end();
        } catch {
            if (req.headers.accept.includes("html"))
                throwErrorPage(res, 404, "Route or file not found");
            else {
                res.statusCode = 404;
                return false;
            }
        }

        return true;
    }

    // Get the according key that the request accepts
    const accept = includesStringArr(req.headers.accept, Object.keys(route));
    // The below will be true if the 'accept' field in the request doesn't match with anything
    // the route has to offer
    if (!accept) {
        throwErrorPage(res, 406, "Route unable to match with the acceptables provided");
        return false;
    }
    
    /**@type {routes.Route}*/
    const response = route[accept];

    res.statusCode = 200;
    if (accept !== "*")
        res.setHeader("Content-Type", accept);
    res.writeProcessing();

    // If the route accepted an HTML document, check if this route is using EJS and render accordingly
    if (accept.includes("html") && (response.file.endsWith(".ejs")))
        await loadEJS(req, res, response);
    // Otherwise, perform generic file loading
    else {
        /**@type {routes.RouteResponse}*/
        let routeData = undefined;

        if (response.data)
            routeData = response.data(req, res);
        if (!routeData)
            // No special treatment passed, just return true
            return true;
        
            
        if (!routeData.prevent_loading && response.file)
            res.write(readFileSync(response.file));

        if (!response.data || routeData.end_response)
            res.end();
        if (response.data && routeData.on_page_loaded)
            routeData.on_page_loaded();
    }

    return true;
}
function refreshSession(req) {
    if (process.env.REFRESH_SESSION == "true")
        refreshUserSession(parseCookie(req.headers.cookie));
}
/**
 * @param {string} string 
 * @param {string[]} arr
 * @param {boolean} allowAsterisk Should this function return true if the given `string` is an asterisk? (True by default)
 * @returns The item that matches with the given `string`; null if none
 */
function includesStringArr(string, arr, allowAsterisk = true) {
    if (allowAsterisk && (string === "*"))
        return string;

    for (let i = 0; i < arr.length; i++)
        if (string.includes(arr[i]))
            return arr[i];
    return null;
}


// Fnishing touches
SERVER.listen(PORT, () => console.log("Server made on port " + PORT));
mssql.connect(process.env.DB_CONNECTION_STRING);