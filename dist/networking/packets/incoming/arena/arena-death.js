"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../../packet");
class ArenaDeathPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.ARENADEATH;
    }
    //#endregion
    read() {
        this.cost = this.readInt32();
    }
    write() {
        this.writeInt32(this.cost);
    }
}
exports.ArenaDeathPacket = ArenaDeathPacket;
