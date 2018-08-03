"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
const world_pos_data_1 = require("../../data/world-pos-data");
class PlayerShootPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.PLAYERSHOOT;
    }
    //#endregion
    read() {
        this.time = this.readInt32();
        this.bulletId = this.readByte();
        this.containerType = this.readShort();
        this.startingPos = new world_pos_data_1.WorldPosData();
        this.startingPos.read(this);
        this.angle = this.readFloat();
    }
    write() {
        this.writeInt32(this.time);
        this.writeByte(this.bulletId);
        this.writeShort(this.containerType);
        this.startingPos.write(this);
        this.writeFloat(this.angle);
    }
}
exports.PlayerShootPacket = PlayerShootPacket;
