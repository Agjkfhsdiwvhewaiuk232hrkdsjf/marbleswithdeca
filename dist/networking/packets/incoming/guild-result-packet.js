"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
class GuildResultPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.GUILDRESULT;
    }
    //#endregion
    read() {
        this.success = this.readBoolean();
        this.lineBuilderJSON = this.readString();
    }
    write() {
        this.writeBoolean(this.success);
        this.writeString(this.lineBuilderJSON);
    }
}
exports.GuildResultPacket = GuildResultPacket;
