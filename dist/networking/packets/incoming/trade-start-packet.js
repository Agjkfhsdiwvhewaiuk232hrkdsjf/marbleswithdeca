"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
const trade_item_1 = require("./../../data/trade-item");
class TradeStartPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.TRADESTART;
    }
    //#endregion
    read() {
        const clientItemsLen = this.readShort();
        this.clientItems = new Array(clientItemsLen);
        for (let i = 0; i < clientItemsLen; i++) {
            const item = new trade_item_1.TradeItem();
            item.read(this);
            this.clientItems[i] = item;
        }
        this.partnerName = this.readString();
        const partnerItemsLen = this.readShort();
        this.partnerItems = new Array(partnerItemsLen);
        for (let i = 0; i < partnerItemsLen; i++) {
            const item = new trade_item_1.TradeItem();
            item.read(this);
            this.partnerItems[i] = item;
        }
    }
    write() {
        this.writeShort(this.clientItems.length);
        for (let i = 0; i < this.clientItems.length; i++) {
            const item = new trade_item_1.TradeItem();
            item.write(this);
        }
        this.writeString(this.partnerName);
        this.writeShort(this.partnerItems.length);
        for (let i = 0; i < this.partnerItems.length; i++) {
            const item = new trade_item_1.TradeItem();
            item.write(this);
        }
    }
}
exports.TradeStartPacket = TradeStartPacket;
