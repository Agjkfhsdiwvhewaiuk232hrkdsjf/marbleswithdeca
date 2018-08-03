"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
class ClaimDailyRewardResponse extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.LOGINREWARD_MSG;
    }
    //#endregion
    read() {
        this.itemId = this.readInt32();
        this.quantity = this.readInt32();
        this.gold = this.readInt32();
    }
    write() {
        this.writeInt32(this.itemId);
        this.writeInt32(this.quantity);
        this.writeInt32(this.gold);
    }
}
exports.ClaimDailyRewardResponse = ClaimDailyRewardResponse;
