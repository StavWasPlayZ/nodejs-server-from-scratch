import { createHash } from "crypto";

export const hash = (str) =>
    createHash("sha256").update(str).digest("hex");

const allowedRanges = [
    [35, 43],
    [45, 58],
    [62, 91],
    [93, 126]
], maxLength = 64;
export function generateSessionId() {
    let result = "";
    for (let i = 0; i < maxLength; i++) {
        const range = allowedRanges[randomInt(0, allowedRanges.length)]
        result += String.fromCharCode(randomInt(range[0], range[1]));
    }

    return result;
}

const randomInt = (min, max) =>
    Math.floor(Math.random()*(max - min) + min);