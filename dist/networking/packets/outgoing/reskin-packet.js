"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
class ReskinPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.RESKIN;
    }
    //#endregion
    read() {
        this.skinId = this.readInt32();
    }
    write() {
        this.writeInt32(this.skinId);
    }
}
exports.ReskinPacket = ReskinPacket;
