"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
class NameResultPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.NAMERESULT;
    }
    //#endregion
    read() {
        this.success = this.readBoolean();
        this.errorText = this.readString();
    }
    write() {
        this.writeBoolean(this.success);
        this.writeString(this.errorText);
    }
}
exports.NameResultPacket = NameResultPacket;
