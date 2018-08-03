"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
class EditAccountListPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.EDITACCOUNTLIST;
    }
    //#endregion
    read() {
        this.accountListId = this.readInt32();
        this.add = this.readBoolean();
        this.objectId = this.readInt32();
    }
    write() {
        this.writeInt32(this.accountListId);
        this.writeBoolean(this.add);
        this.writeInt32(this.objectId);
    }
}
exports.EditAccountListPacket = EditAccountListPacket;
