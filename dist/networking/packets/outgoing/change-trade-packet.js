"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
class ChangeTradePacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.CHANGETRADE;
    }
    //#endregion
    read() {
        const offerLen = this.readShort();
        this.offer = new Array(offerLen);
        for (let i = 0; i < offerLen; i++) {
            this.offer[i] = this.readBoolean();
        }
    }
    write() {
        this.writeShort(this.offer.length);
        for (let i = 0; i < this.offer.length; i++) {
            this.writeBoolean(this.offer[i]);
        }
    }
}
exports.ChangeTradePacket = ChangeTradePacket;
