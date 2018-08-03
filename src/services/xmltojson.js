"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SERVER_REGEX = /<Server><Name>(\w+)<\/Name><DNS>(\d+\.\d+\.\d+\.\d+)<\/DNS>/g;
const ACCOUNT_INFO_REGEX = /<Chars nextCharId="(\d+)" maxNumChars="(\d+)">(?:<Char id="(\d+)">)*/;
const ERROR_REGEX = /<Error\/?>(.+)<\/?Error>/;
class XMLtoJSON {
}
exports.XMLtoJSON = XMLtoJSON;
function parseServers(xml) {
    let match = SERVER_REGEX.exec(xml);
    const servers = {};
    while (match != null) {
        const name = match[1];
        const ip = match[2];
        servers[name] = {
            name: name,
            address: ip
        };
        match = SERVER_REGEX.exec(xml);
    }
    return servers;
}
exports.parseServers = parseServers;
function parseAccountInfo(xml) {
    const acc = {
        nextCharId: 2,
        charId: 1,
        maxNumChars: 1
    };
    const match = ACCOUNT_INFO_REGEX.exec(xml);
    if (match != null) {
        acc.nextCharId = +match[1];
        acc.maxNumChars = +match[2];
        try {
            acc.charId = +match[3];
        }
        catch (_a) {
            acc.charId = -1;
        }
    }
    else {
        return null;
    }
    return acc;
}
exports.parseAccountInfo = parseAccountInfo;
function parseError(xml) {
    const match = ERROR_REGEX.exec(xml);
    if (match) {
        return new Error(match[1]);
    }
    return null;
}
exports.parseError = parseError;
