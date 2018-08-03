"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
const world_pos_data_1 = require("./../../../networking/data/world-pos-data");
class ServerPlayerShootPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.SERVERPLAYERSHOOT;
    }
    //#endregion
    read() {
        this.bulletId = this.readUnsignedByte();
        this.ownerId = this.readInt32();
        this.containerType = this.readInt32();
        this.startingPos = new world_pos_data_1.WorldPosData();
        this.startingPos.read(this);
        this.angle = this.readFloat();
        this.damage = this.readShort();
    }
    write() {
        this.writeUnsigedByte(this.bulletId);
        this.writeInt32(this.ownerId);
        this.writeInt32(this.containerType);
        this.startingPos.write(this);
        this.writeFloat(this.angle);
        this.writeInt32(this.damage);
    }
}
exports.ServerPlayerShootPacket = ServerPlayerShootPacket;
