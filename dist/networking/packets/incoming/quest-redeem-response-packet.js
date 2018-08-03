"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
class QuestRedeemResponsePacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.QUESTREDEEM_RESPONSE;
    }
    //#endregion
    read() {
        this.ok = this.readBoolean();
        this.message = this.readString();
    }
    write() {
        this.writeBoolean(this.ok);
        this.writeString(this.message);
    }
}
exports.QuestRedeemResponsePacket = QuestRedeemResponsePacket;
