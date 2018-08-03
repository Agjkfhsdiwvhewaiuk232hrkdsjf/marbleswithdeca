"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
class KeyInfoRequestPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.KEYINFO_REQUEST;
    }
    //#endregion
    read() {
        this.itemType = this.readInt32();
    }
    write() {
        this.writeInt32(this.itemType);
    }
}
exports.KeyInfoRequestPacket = KeyInfoRequestPacket;
