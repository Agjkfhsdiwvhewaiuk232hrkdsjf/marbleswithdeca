"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
class CreatePacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.CREATE;
    }
    //#endregion
    read() {
        this.classType = this.readShort();
        this.skinType = this.readShort();
    }
    write() {
        this.writeShort(this.classType);
        this.writeShort(this.skinType);
    }
}
exports.CreatePacket = CreatePacket;
