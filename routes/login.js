import { routes } from "./routes.js";
import * as security from "../util/security.js";
import * as dbA from "../util/databaseAccessor.js";
import { Session } from "../util/Session.js";
import * as auth from "../util/authUtil.js"

routes["/login"] = {

    "text/html": {
        file: "login.ejs",
        data: (req, res, loadPage) => {
            if (auth.redRegister(req, res))
                return {prevent_loading: true};
            if (req.method != "POST")
                return;

            req.on("data", async (chunk) => {
                const params = auth.getQueryParams(req, chunk, true),
                    email = dbA.repQ(params.get("email")), password = params.get("password");
                if (!email || !password) {
                    loadPage({
                        error: "Wow, you think you're such a haha genius submitting this form with the required fields removed? Good job, loser."
                    })
                    return;
                }

                const user = (await dbA.query(
                    `select * from Users where Email='${email}' and Password='${dbA.repQ(security.hash(password))}'`
                ))[0];
                

                if (!user) {
                    res.statusCode = 401;
                    loadPage({error: "Email or password incorrect. Would I kindly suggest <a href=\"/signup\">signing up</a>?"});
                    return;
                }

                auth.setCookieSessionId(res, new Session(user.Id).getSessionId());
                loadPage(null, auth.refHeader, null);
            })

            return {manual_loading: true}
        }
    }

}