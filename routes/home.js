import { routes } from "./routes.js";
import * as dbA from "../util/databaseAccessor.js";
import { getSessionByCookie } from "../util/cookies.js";

routes["/"] = {

    "text/html": {
        file: "home.ejs",
        data: async (req, res) => {
            //TODO convert to redNonRegister function
            const session = getSessionByCookie(req.headers.cookie);
            if (!session) {
                res.statusCode = 302;
                res.setHeader("Location", "/login");

                res.end();
                return {prevent_loading: true};
            }

            // const user = await dbA.query("select * from Users LEFT JOIN Profiles on Id = UserId where id='"+session.getUserId()+"'");
            // const user = await dbA.select("Users", "*", "where id='"+session.getUserId()+"'");
            const profile = (await dbA.query("select * from Profiles where UserId='"+session.getUserId()+"'"))[0];
            return {
                ejs_object: {profile: profile}
            }
        }
    }

}