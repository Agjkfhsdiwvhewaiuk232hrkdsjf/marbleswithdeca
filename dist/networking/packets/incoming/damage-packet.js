"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
class DamagePacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.DAMAGE;
    }
    //#endregion
    read() {
        this.targetId = this.readInt32();
        const effectsLen = this.readUnsignedByte();
        this.effects = new Array(effectsLen);
        for (let i = 0; i < effectsLen; i++) {
            this.effects[i] = this.readUnsignedByte();
        }
        this.damageAmount = this.readUnsignedShort();
        this.kill = this.readBoolean();
        this.armorPierce = this.readBoolean();
        this.bulletId = this.readUnsignedByte();
        this.objectId = this.readInt32();
    }
    write() {
        this.writeInt32(this.targetId);
        this.writeUnsigedByte(this.effects.length);
        for (let i = 0; i < this.effects.length; i++) {
            this.writeUnsigedByte(this.effects[i]);
        }
        this.writeUnsignedShort(this.damageAmount);
        this.writeBoolean(this.kill);
        this.writeBoolean(this.armorPierce);
        this.writeUnsigedByte(this.bulletId);
        this.writeInt32(this.objectId);
    }
}
exports.DamagePacket = DamagePacket;
