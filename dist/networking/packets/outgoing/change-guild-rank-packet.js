"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
class ChangeGuildRankPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.CHANGEGUILDRANK;
    }
    //#endregion
    read() {
        this.name = this.readString();
        this.guildRank = this.readInt32();
    }
    write() {
        this.writeString(this.name);
        this.writeInt32(this.guildRank);
    }
}
exports.ChangeGuildRankPacket = ChangeGuildRankPacket;
