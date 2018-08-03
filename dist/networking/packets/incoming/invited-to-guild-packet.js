"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
class InvitedToGuildPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.INVITEDTOGUILD;
    }
    //#endregion
    read() {
        this.name = this.readString();
        this.guildName = this.readString();
    }
    write() {
        this.writeString(this.name);
        this.writeString(this.guildName);
    }
}
exports.InvitedToGuildPacket = InvitedToGuildPacket;
