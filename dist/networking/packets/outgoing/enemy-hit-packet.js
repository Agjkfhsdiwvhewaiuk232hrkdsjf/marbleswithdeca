"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
class EnemyHitPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.ENEMYHIT;
    }
    //#endregion
    read() {
        this.time = this.readInt32();
        this.bulletId = this.readByte();
        this.targetId = this.readInt32();
        this.kill = this.readBoolean();
    }
    write() {
        this.writeInt32(this.time);
        this.writeByte(this.bulletId);
        this.writeInt32(this.targetId);
        this.writeBoolean(this.kill);
    }
}
exports.EnemyHitPacket = EnemyHitPacket;
