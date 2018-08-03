"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
class TradeAcceptedPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.TRADEACCEPTED;
    }
    //#endregion
    read() {
        const clientOfferLen = this.readShort();
        this.clientOffer = new Array(clientOfferLen);
        for (let i = 0; i < clientOfferLen; i++) {
            this.clientOffer[i] = this.readBoolean();
        }
        const partnerOfferLen = this.readShort();
        this.partnerOffer = new Array(partnerOfferLen);
        for (let i = 0; i < partnerOfferLen; i++) {
            this.partnerOffer[i] = this.readBoolean();
        }
    }
    write() {
        for (let i = 0; i < this.clientOffer.length; i++) {
            this.writeBoolean(this.clientOffer[i]);
        }
        for (let i = 0; i < this.partnerOffer.length; i++) {
            this.writeBoolean(this.partnerOffer[i]);
        }
    }
}
exports.TradeAcceptedPacket = TradeAcceptedPacket;
