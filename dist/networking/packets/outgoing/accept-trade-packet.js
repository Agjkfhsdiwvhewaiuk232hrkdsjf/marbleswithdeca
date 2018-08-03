"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
class AcceptTradePacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.ACCEPTTRADE;
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
        this.writeShort(this.clientOffer.length);
        for (let i = 0; i < this.clientOffer.length; i++) {
            this.writeBoolean(this.clientOffer[i]);
        }
        this.writeShort(this.partnerOffer.length);
        for (let i = 0; i < this.partnerOffer.length; i++) {
            this.writeBoolean(this.partnerOffer[i]);
        }
    }
}
exports.AcceptTradePacket = AcceptTradePacket;
