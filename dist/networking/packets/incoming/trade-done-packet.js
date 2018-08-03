"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
class TradeDonePacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.TRADEDONE;
    }
    //#endregion
    read() {
        this.code = this.readInt32();
        this.description = this.readString();
    }
    write() {
        this.writeInt32(this.code);
        this.writeString(this.description);
    }
}
exports.TradeDonePacket = TradeDonePacket;
var TradeResult;
(function (TradeResult) {
    TradeResult[TradeResult["Successful"] = 0] = "Successful";
    TradeResult[TradeResult["PlayerCanceled"] = 1] = "PlayerCanceled";
})(TradeResult = exports.TradeResult || (exports.TradeResult = {}));
