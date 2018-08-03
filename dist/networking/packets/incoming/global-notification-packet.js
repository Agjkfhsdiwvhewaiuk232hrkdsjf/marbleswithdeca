"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
class GlobalNotificationPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.GLOBALNOTIFICATION;
    }
    //#endregion
    read() {
        this.notificationType = this.readInt32();
        this.text = this.readString();
    }
    write() {
        this.writeInt32(this.notificationType);
        this.writeString(this.text);
    }
}
exports.GlobalNotificationPacket = GlobalNotificationPacket;
