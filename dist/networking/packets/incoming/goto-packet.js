"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
const world_pos_data_1 = require("./../../../networking/data/world-pos-data");
class GotoPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.GOTO;
    }
    //#endregion
    read() {
        this.objectId = this.readInt32();
        this.position = new world_pos_data_1.WorldPosData();
        this.position.read(this);
    }
    write() {
        this.writeInt32(this.objectId);
        this.position.write(this);
    }
}
exports.GotoPacket = GotoPacket;
