"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
const world_pos_data_1 = require("./../../data/world-pos-data");
class EnemyShootPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.ENEMYSHOOT;
    }
    //#endregion
    read() {
        this.bulletId = this.readUnsignedByte();
        this.ownerId = this.readInt32();
        this.bulletType = this.readUnsignedByte();
        this.startingPos = new world_pos_data_1.WorldPosData();
        this.startingPos.read(this);
        this.angle = this.readFloat();
        this.damage = this.readShort();
        if (this.bufferIndex < this.data.length) {
            this.numShots = this.readUnsignedByte();
            this.angleInc = this.readFloat();
        }
        else {
            this.numShots = 1;
            this.angleInc = 0;
        }
    }
    write() {
        this.writeUnsigedByte(this.bulletId);
        this.writeInt32(this.ownerId);
        this.writeUnsigedByte(this.bulletType);
        this.startingPos.write(this);
        this.writeFloat(this.angle);
        this.writeShort(this.damage);
        if (this.numShots !== 1) {
            this.writeUnsigedByte(this.numShots);
        }
        if (this.angleInc !== 0) {
            this.writeFloat(this.angleInc);
        }
    }
}
exports.EnemyShootPacket = EnemyShootPacket;
