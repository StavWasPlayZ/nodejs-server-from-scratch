import { routes } from "./routes.js";
import * as security from "../util/security.js";
import * as dbA from "../util/databaseAccessor.js";
import { Session } from "../util/Session.js";
import * as auth from "../util/authUtil.js"

routes["/signup"] = {

    "text/html": {
        file: "signup.ejs",
        data: (req, res, loadPage) => {
            // In this website, sessions may only be provided to logged in users
            // Thus just forward them to the homepage
            if (auth.redRegister(req, res))
                return {prevent_loading: true};
            
            if (req.method == "GET")
                return;
            
            
            req.on("data", async (chunk) => {
                const postQuery = auth.getQueryParams(req, chunk, true);
                
                let message = null;
                // Excecute an insert query and get its primary key
                const userId = await dbA.insert("Users", {
                    Email: postQuery.get("email"),
                    Password: security.hash(postQuery.get("password"))
                }, true)

                    // Query errors are caught here
                    .catch((reason) => {
                        if (reason.message.includes("UNIQUE")) {
                            res.statusCode = 409;
                            message = "Email is already taken. Might you want to <a href=\"/login\">log in?</a>";
                        }
                        else
                            // dunno
                            console.log(reason);
                    });
                // Handle them
                if (userId == null) {
                    loadPage({error: message || "Something went wrong. PLease try again later."});
                    return;
                }

                const username = postQuery.get("username");
                // Create the user's profile
                await dbA.insert("Profiles", {
                    UserId: userId,
                    ...(username && {Username: username}),
                    Motto: (postQuery.get("motto") || "")
                });
                // Make a new session for the now-logged-in user and add this to the their cookie
                auth.setCookieSessionId(res, new Session(userId).getSessionId());

                // Redirecting this way so I can indicate the user was created
                res.statusCode = 201;
                loadPage(null, auth.refHeader, true);
            })

            res.statusCode = 202;
            res.writeProcessing();
            return {manual_loading: true};
        }
    }

}