"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../../packet");
class EnterArenaPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.ENTERARENA;
    }
    //#endregion
    read() {
        this.currency = this.readInt32();
    }
    write() {
        this.writeInt32(this.currency);
    }
}
exports.EnterArenaPacket = EnterArenaPacket;
