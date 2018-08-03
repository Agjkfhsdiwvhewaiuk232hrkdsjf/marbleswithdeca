"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
class ClientStatPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.CLIENTSTAT;
    }
    //#endregion
    read() {
        this.name = this.readString();
        this.value = this.readInt32();
    }
    write() {
        this.writeString(this.name);
        this.writeInt32(this.value);
    }
}
exports.ClientStatPacket = ClientStatPacket;
