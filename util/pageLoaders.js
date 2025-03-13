import * as routes from "../routes/routes.js";
import * as ejs from "ejs"
import { getSessionByCookie } from "./cookies.js";

/**
 * Writes to `res` the error page stated in {@link routes.noteableRoutes}
 * @param {http.ServerResponse} res
 * @param {int} errorCode The error code to be displayed
 * @param {string} message The error message to be displayed
 * 
 * @see loadEJS
 */
export function throwErrorPage(res, errorCode, message = null) {
    res.statusCode = errorCode;
    loadEJS(null, res, routes.noteableRoutes.error, {
        error: (res.statusCode = errorCode) + ((message == null) ? "" : (" - "+message))
    });
}
/**
 * Loads the EJS page specified in {@link routes.Route.file routes.file}
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {routes.Route} route The route to load the page from
 * @param {Object} data An object to pass onto the EJS arguments along with the rest
 */
export async function loadEJS(req, res, route, data = {}) {
    /**@type {routes.RouteResponse}*/
    let routeData = undefined;
    // If this route has a data function and it prevents loading, then don't load the page.
    if (route.data &&
        (
            // Store the whole RouteResponse object while at it
            (routeData = await route.data(req, res, (ejsData, htmlHeaders = "", htmlHeadersOnly) =>
                loadPage(req, res, route, routeData, data, ejsData, htmlHeaders, htmlHeadersOnly))) && routeData.prevent_loading
        )
    ) return;

    if (!routeData || !routeData.manual_loading)
        loadPage(req, res, route, routeData, data);
}
async function loadPage(req, res, route, routeData, data, additionalData, htmlHeaders = "", htmlHeadersOnly) {
    // Write to the response both the route's requested EJS data and the given ones.
    res.write(htmlHeadersOnly ? ("<!DOCTYPE html><html><head>"+htmlHeaders+"</head></html>") :
    
        // Priority is given to this function's data parameters
        (htmlHeaders + (await ejs.renderFile("./views/pages/"+route.file, {data: {
            //TODO Replace "cookies" with a user object, and pass it to every 'data' function as well
            cookies: req.headers.cookie,
            ...data,
            ...(additionalData || {}),
            ...((routeData && routeData.ejs_object) || {})
    }}))));

    if (!routeData || (routeData.end_response == null) || routeData.end_response)
        res.end();
    if (routeData && routeData.on_page_loaded)
        routeData.on_page_loaded();
}