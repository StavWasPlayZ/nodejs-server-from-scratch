// Deprecated for being utterly useless


// import { ServerResponse } from "http";

// /**
//  * A class used to safely ending a response.
//  * 
//  * Basically, {@link SafeStop.tryStop} must be called twice for the given response to end.
//  * Necessary for when a data chunk of sorts needs to be passed through, and the page is yet to finish load, or vice-versa.
//  */
// export class SafeStop {
//     /**@type {boolean}*/
//     isSafe = false;
//     /**@type {ServerResponse}*/
//     #res;
    
//     /**@param {ServerResponse} response*/
//     constructor(response) {
//         this.res = response;
//     }

//     tryStop() {
//         if (this.isSafe)
//             this.#res.end();
//         else
//             this.isSafe = true;
//     }
// }