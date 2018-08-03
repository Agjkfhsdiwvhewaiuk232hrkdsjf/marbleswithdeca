"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
const world_pos_data_1 = require("../../data/world-pos-data");
class AoePacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.AOE;
    }
    //#endregion
    read() {
        this.pos = new world_pos_data_1.WorldPosData();
        this.pos.read(this);
        this.radius = this.readFloat();
        this.damage = this.readUnsignedShort();
        this.effect = this.readUnsignedByte();
        this.duration = this.readFloat();
        this.origType = this.readUnsignedShort();
        this.color = this.readInt32();
    }
    write() {
        this.pos.write(this);
        this.writeFloat(this.radius);
        this.writeUnsignedShort(this.damage);
        this.writeUnsigedByte(this.effect);
        this.writeFloat(this.duration);
        this.writeUnsignedShort(this.origType);
        this.writeInt32(this.color);
    }
}
exports.AoePacket = AoePacket;
