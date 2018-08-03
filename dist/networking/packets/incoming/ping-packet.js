"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
class PingPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.PING;
    }
    //#endregion
    read() {
        this.serial = this.readInt32();
    }
    write() {
        this.writeInt32(this.serial);
    }
}
exports.PingPacket = PingPacket;
