"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
class ClaimDailyRewardMessage extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.CLAIMLOGIN_REWARD_MSG;
    }
    //#endregion
    read() {
        this.claimKey = this.readString();
        this.claimType = this.readString();
    }
    write() {
        this.writeString(this.claimKey);
        this.writeString(this.claimType);
    }
}
exports.ClaimDailyRewardMessage = ClaimDailyRewardMessage;
