"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
const world_pos_data_1 = require("./../../data/world-pos-data");
class ShowEffectPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.SHOWEFFECT;
    }
    //#endregion
    read() {
        this.effectType = this.readUnsignedByte();
        this.targetObjectId = this.readInt32();
        this.pos1 = new world_pos_data_1.WorldPosData();
        this.pos1.read(this);
        this.pos2 = new world_pos_data_1.WorldPosData();
        this.pos2.read(this);
        this.color = this.readInt32();
        this.duration = this.readFloat();
    }
    write() {
        this.writeUnsigedByte(this.effectType);
        this.writeInt32(this.targetObjectId);
        this.pos1.write(this);
        this.pos2.write(this);
        this.writeInt32(this.color);
        this.writeFloat(this.duration);
    }
}
exports.ShowEffectPacket = ShowEffectPacket;
