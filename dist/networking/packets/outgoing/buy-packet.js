"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
class BuyPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.BUY;
    }
    //#endregion
    read() {
        this.objectId = this.readInt32();
        this.quantity = this.readInt32();
    }
    write() {
        this.writeInt32(this.objectId);
        this.writeInt32(this.quantity);
    }
}
exports.BuyPacket = BuyPacket;
