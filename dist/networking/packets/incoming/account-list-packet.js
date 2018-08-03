"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
class AccountListPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.ACCOUNTLIST;
    }
    //#endregion
    read() {
        this.accountListId = this.readInt32();
        const accountIdsLen = this.readShort();
        this.accountIds = new Array(accountIdsLen);
        for (let i = 0; i < accountIdsLen; i++) {
            this.accountIds[i] = this.readString();
        }
        this.lockAction = this.readInt32();
    }
    write() {
        this.writeInt32(this.accountListId);
        this.writeShort(this.accountIds.length);
        for (let i = 0; i < this.accountIds.length; i++) {
            this.writeString(this.accountIds[i]);
        }
        this.writeInt32(this.lockAction);
    }
}
exports.AccountListPacket = AccountListPacket;
