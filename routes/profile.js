import { routes } from "./routes.js";
import { getSessionByCookie } from "../util/cookies.js";
import { select } from "../util/databaseAccessor.js"
import { throwErrorPage } from "../util/pageLoaders.js";
import { getQueryParams } from "../util/authUtil.js";

routes["/profile"] = {

    "text/html": {
        file: "profile.ejs",
        data: async (req, res, loadPage) => {
            const id = getQueryParams(req, req.url, false).get("id");
            let userId;
            if (!id) {
                const session = getSessionByCookie(req.headers.cookie);
                if (!session) {
                    loadPage(null, '<meta http-equiv="refresh" content="0; url=/login" />', true);
                    return {manual_loading: true};
                }
                
                userId = session.getUserId();
            }
            else
                userId = id;

            const user = (await select("Profiles", "UserId="+userId))[0];
            if (!user) {
                throwErrorPage(res, 404, "User does not exist or has been removed");
                return {prevent_loading: true};
            }

            return {
                ejs_object: {user: user}
            }
        }
    }

}