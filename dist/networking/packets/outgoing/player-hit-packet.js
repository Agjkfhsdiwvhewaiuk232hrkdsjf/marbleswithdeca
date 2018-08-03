"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
class PlayerHitPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.PLAYERHIT;
    }
    //#endregion
    read() {
        this.bulletId = this.readUnsignedByte();
        this.objectId = this.readInt32();
    }
    write() {
        this.writeUnsigedByte(this.bulletId);
        this.writeInt32(this.objectId);
    }
}
exports.PlayerHitPacket = PlayerHitPacket;
