"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
class FailurePacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.FAILURE;
    }
    read() {
        this.errorId = this.readInt32();
        this.errorDescription = this.readString();
    }
    write() {
        this.writeInt32(this.errorId);
        this.writeString(this.errorDescription);
    }
}
exports.FailurePacket = FailurePacket;
