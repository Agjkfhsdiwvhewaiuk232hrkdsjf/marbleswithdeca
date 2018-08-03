"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
class DeathPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.DEATH;
    }
    //#endregion
    read() {
        this.accountId = this.readString();
        this.charId = this.readInt32();
        this.killedBy = this.readString();
        this.zombieType = this.readInt32();
        this.zombieId = this.readInt32();
        this.isZombie = this.zombieId !== -1;
    }
    write() {
        this.writeString(this.accountId);
        this.writeInt32(this.charId);
        this.writeString(this.killedBy);
        this.writeInt32(this.zombieType);
        this.writeInt32(this.zombieId);
    }
}
exports.DeathPacket = DeathPacket;
