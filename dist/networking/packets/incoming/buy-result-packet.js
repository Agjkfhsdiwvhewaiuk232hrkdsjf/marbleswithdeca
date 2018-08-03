"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
class BuyResultPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.BUYRESULT;
    }
    //#endregion
    read() {
        this.result = this.readInt32();
        this.resultString = this.readString();
    }
    write() {
        this.writeInt32(this.result);
        this.writeString(this.resultString);
    }
}
exports.BuyResultPacket = BuyResultPacket;
