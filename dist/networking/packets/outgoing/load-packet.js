"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
class LoadPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.LOAD;
    }
    //#endregion
    read() {
        this.charId = this.readInt32();
        this.isFromArena = this.readBoolean();
    }
    write() {
        this.writeInt32(this.charId);
        this.writeBoolean(this.isFromArena);
    }
}
exports.LoadPacket = LoadPacket;
