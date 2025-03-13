import { generateSessionId } from "./security.js";

export class Session {
    #userId;
    #sessionId;
    #timeoutInterval;

    constructor(userId) {
        this.#userId = userId;
        this.#sessionId = generateSessionId();

        this.#timeoutInterval = setTimeout(() => Session.#intervalFunc(this), process.env.SESSION_TIMEOUT * 6e4);
        sessions[this.#sessionId] = this;
    }
    static #intervalFunc(session) {
        delete sessions[session.#sessionId];
    }


    getSessionId() {return this.#sessionId;}
    getUserId() {return this.#userId;};

    refreshTimout() {this.#timeoutInterval.refresh();}


    destroy() {
        Session.#intervalFunc(this);
        clearTimeout(this.#timeoutInterval);
    }
}


export function refreshUserSession(sessionId) {
    if (sessions[sessionId])
        sessions[sessionId].refreshTimout();
}

/**@type {Object.<string, Session>} */
export const sessions = {};