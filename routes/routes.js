import { ServerResponse, IncomingMessage } from "http";
import { dirname } from "path";
import { fileURLToPath } from "url";
import * as fs from "fs"


/* ------- Define route types ------- */
/**
 * @typedef {Object} RouteResponse
 * @property {boolean?} end_response Should this response end immediately after being loaded? (Null = true)
 * @property {Function} on_page_loaded An event that will be called when this route is loaded
 * @property {Object} ejs_object An object that will be passed as an EJS object
 * @property {boolean} prevent_loading Should this route not be loaded?
 * @property {boolean} manual_loading Should this route load the given file maually?
 *  By default, loads at the end of `data` call unless specified otherwise. {@link Route.data} must call the given `loadPage` if set to true.
 */
/**
 * @typedef {Object} Route
 * @property {string} file A file that will be loaded upon this route's call
 * @property {(req: IncomingMessage, res: ServerResponse, loadPage: (ejsObject: Object, htmlHeaders: string, htmlHeadersOnly: boolean) => null) => Promise<RouteResponse>} data
 *  The function that is called upon this route's call.
 * Must return a `RouteResponse` object.
 */

/**
 * Given a MIME type, returns an according {@link Route}, if exists.
 * @typedef {Object.<string, Route>} AcceptableRoutes
 */
/**
 * Given a route path, returns the according instance of {@link AcceptableRoutes}, if exists.
 * @type {Object.<string, AcceptableRoutes>}
 */
export const routes = {
    // Basic route definitions

    "/error": {
        "text/html": {
            file: "error.ejs"
        }
    }

}
export const noteableRoutes = {
    error: routes["/error"]["text/html"]
};


/**
 * Initializes this {@link routes} object through every JavaScript file in this folder.
 * Skips `routes.js`, assuming it is this file.
 */
function loadRoutes() {
    const files = fs.readdirSync(dirname(fileURLToPath(import.meta.url)));

    for (let i = 0; i < files.length; i++) {
        const script = files[i];
        if (script != "routes.js")
            import("./"+script);
    }
}
// Calling at end just in case modules would like to load
loadRoutes();