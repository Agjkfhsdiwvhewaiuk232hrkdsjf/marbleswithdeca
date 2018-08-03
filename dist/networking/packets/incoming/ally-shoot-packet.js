"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
class AllyShootPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.ALLYSHOOT;
    }
    //#endregion
    read() {
        this.bulletId = this.readUnsignedByte();
        this.ownerId = this.readInt32();
        this.containerType = this.readShort();
        this.angle = this.readFloat();
    }
    write() {
        this.writeUnsigedByte(this.bulletId);
        this.writeInt32(this.ownerId);
        this.writeShort(this.containerType);
        this.writeFloat(this.angle);
    }
}
exports.AllyShootPacket = AllyShootPacket;
