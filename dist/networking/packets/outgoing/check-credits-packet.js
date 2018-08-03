"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
class CheckCreditsPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.CHECKCREDITS;
    }
    //#region packet-specific members
    //#endregion
    read() {
    }
    write() {
    }
}
exports.CheckCreditsPacket = CheckCreditsPacket;
