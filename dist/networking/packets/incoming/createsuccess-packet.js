"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
class CreateSuccessPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.CREATESUCCESS;
    }
    read() {
        this.objectId = this.readInt32();
        this.charId = this.readInt32();
    }
    write() {
        this.writeInt32(this.objectId);
        this.writeInt32(this.charId);
    }
}
exports.CreateSuccessPacket = CreateSuccessPacket;
