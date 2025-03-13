import { routes } from "./routes.js";
import { getSessionByCookie } from "../util/cookies.js";

routes["/action"] = {

    "*": {
        data: (req, res) => {
            // A timout of 30 seconds
            const timout = setTimeout(() => {
                res.statusCode = 408;
                res.end();
            }, 30e2);

            req.on("data", (chunk) => {
                //FIXME Assuming only 1 was passed
                actions[chunk](req, res);

                clearTimeout(timout);
                res.end();
            })

            return {
                manual_loading: true,
                prevent_loading: true
            }
        }
    }

}

/**@type {Object.<string, (req: IncomingMessage, res: ServerResponse) => null>}*/
const actions = {
    "logout": (req, res) => {
        const session = getSessionByCookie(req.headers.cookie);
        if (!session) {
            res.statusCode = 404;
            return;
        }

        session.destroy();
        //FIXME assuming only 1 cookie field exists
        res.setHeader("Set-Cookie", 'sessionId=""; SameSite=Strict;')
    }
}