"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
class UsePortalPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.USEPORTAL;
    }
    //#endregion
    read() {
        this.objectId = this.readInt32();
    }
    write() {
        this.writeInt32(this.objectId);
    }
}
exports.UsePortalPacket = UsePortalPacket;
