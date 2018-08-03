"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
class PongPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.PONG;
    }
    //#endregion
    read() {
        this.serial = this.readInt32();
        this.time = this.readInt32();
    }
    write() {
        this.writeInt32(this.serial);
        this.writeInt32(this.time);
    }
}
exports.PongPacket = PongPacket;
