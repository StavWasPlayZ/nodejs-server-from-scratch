import { getQueryParams } from "../util/authUtil.js";
import { query, repQ } from "../util/databaseAccessor.js";
import { throwErrorPage } from "../util/pageLoaders.js";
import { routes } from "./routes.js";

routes["/search"] = {

    "text/html": {
        file: "search.ejs",
        data: async (req, res) => {
            let term = getQueryParams(req, req.url, false).get("term");

            if (!term) {
                throwErrorPage(res, 400, "Search term not provided");
                return {prevent_loading: true};
            }
            term = repQ(term).toUpperCase();
            
            //FIXME: Prone to SQL injections!
            const users = await query(
                `select top 50 Id,Username,Email,Motto from Users left join Profiles on Id=UserId
                where (upper(Username) like '%${term}%') or (Email='${term}')
                order by charindex('${term}', upper(Username)) desc`
            );
            if (users.length != 0)
                return {ejs_object: {users: users}};
        }
    }

}