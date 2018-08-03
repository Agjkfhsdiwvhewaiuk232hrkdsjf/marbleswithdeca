"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
class NotificationPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.NOTIFICATION;
    }
    //#endregion
    read() {
        this.objectId = this.readInt32();
        this.message = this.readString();
        this.color = this.readInt32();
    }
    write() {
        this.writeInt32(this.objectId);
        this.writeString(this.message);
        this.writeInt32(this.color);
    }
}
exports.NotificationPacket = NotificationPacket;
