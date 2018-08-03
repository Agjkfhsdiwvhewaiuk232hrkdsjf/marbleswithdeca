"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
class KeyInfoResponsePacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.KEYINFO_RESPONSE;
    }
    //#endregion
    read() {
        this.name = this.readString();
        this.description = this.readString();
        this.creator = this.readString();
    }
    write() {
        this.writeString(this.name);
        this.writeString(this.description);
        this.writeString(this.creator);
    }
}
exports.KeyInfoResponsePacket = KeyInfoResponsePacket;
