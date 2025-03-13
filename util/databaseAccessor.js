import { default as mssql } from "mssql";


export const query = async (query) =>
    (await mssql.query(query)).recordset;
/**
 * @param {string} tableName
 * @param {string} values The rows to choose from the table
 * @param {string?} filter The 'where' statement
 * @returns 
 */
export async function select(tableName, filters = null, values = "*") {
    //FIXME: Prone to SQL injections!
    // Later migrate to mssql.Request().
    
    return (await mssql.query(
        `select ${values} from ${tableName}${filters ? (" where "+filters) : ""}`
    )).recordset;
}
/**
 * Performs insertion into the connected database
 * @param {string} tableName
 * @param {Object.<string, string>} values
 * @param {boolean} selectScope Should this function query the insert's ID?
 * @returns The result that the query issued
 * 
 * @see {@link mssql.query}
 */
export async function insert(tableName, values, selectScope) {
    //FIXME: Prone to SQL injections!
    // Later migrate to mssql.Request().
    
    const query = await mssql.query(
        `insert into ${tableName} ${getKeyString(values)} values ${getValueString(values)}${selectScope ? " select scope_identity()" : ""}`
    );
    if (!selectScope)
        return;
    if (query.recordset != null)
        return query.recordset[0][""];
}

/**
* Shorthand for {@link String.replace str.replace("'", "''")}
* @param {string} str
*/
export const repQ = (str) => (!str) ? "" : str.replace("'", "''");



/**
 * @param {string[]} arr
 * @retuns A string representing the contents of the provided string array seperated by commas and wrapped in brackets.
 */
function getDataString(arr) {
    let result = "(";
    for (let i = 0; i < arr.length; i++)
        result += arr[i] + (((i+1) == arr.length) ? ")" : ",");
    
    return result;
}
/**
 * @param {Object} obj
 * @retuns A string representing the keys of the provided object seperated by commas and wrapped in brackets.
 * 
 * @see getDataString
 */
const getKeyString = (obj) => getDataString(Object.keys(obj));
/**
 * @param {Object} obj
 * @retuns A string representing the values of the provided object seperated by commas and wrapped in brackets.
 * 
 * @see getDataString
 */
function getValueString(obj) {
    const values = Object.values(obj);
    for (let i = 0; i < values.length; i++) {
        const value = values[i];
        values[i] = "'"+(((typeof value) === "string") ? repQ(value) : value)+"'";
    }
    
    return getDataString(values);
}