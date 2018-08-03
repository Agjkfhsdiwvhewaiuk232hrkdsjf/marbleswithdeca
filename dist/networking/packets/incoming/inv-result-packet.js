"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
class InvResultPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.INVRESULT;
    }
    //#endregion
    read() {
        this.result = this.readInt32();
    }
    write() {
        this.writeInt32(this.result);
    }
}
exports.InvResultPacket = InvResultPacket;
