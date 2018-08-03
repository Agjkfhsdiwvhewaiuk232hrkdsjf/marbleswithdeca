"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
class JoinGuildPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.JOINGUILD;
    }
    //#endregion
    read() {
        this.guildName = this.readString();
    }
    write() {
        this.writeString(this.guildName);
    }
}
exports.JoinGuildPacket = JoinGuildPacket;
