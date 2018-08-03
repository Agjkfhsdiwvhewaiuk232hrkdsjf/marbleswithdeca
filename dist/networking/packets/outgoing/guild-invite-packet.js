"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
class GuildInvitePacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.GUILDINVITE;
    }
    //#endregion
    read() {
        this.name = this.readString();
    }
    write() {
        this.writeString(this.name);
    }
}
exports.GuildInvitePacket = GuildInvitePacket;
