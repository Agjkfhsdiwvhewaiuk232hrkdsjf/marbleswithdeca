"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
class ShootAckPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.SHOOTACK;
    }
    //#endregion
    read() {
        this.time = this.readInt32();
    }
    write() {
        this.writeInt32(this.time);
    }
}
exports.ShootAckPacket = ShootAckPacket;
