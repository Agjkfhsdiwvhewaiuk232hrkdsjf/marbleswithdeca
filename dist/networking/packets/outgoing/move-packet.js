"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
const world_pos_data_1 = require("./../../data/world-pos-data");
const move_record_1 = require("./../../data/move-record");
class MovePacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.MOVE;
    }
    //#endregion
    read() {
        this.tickId = this.readInt32();
        this.time = this.readInt32();
        this.newPosition = new world_pos_data_1.WorldPosData();
        this.newPosition.read(this);
        const recordLen = this.readShort();
        this.records = new Array(recordLen);
        for (let i = 0; i < recordLen; i++) {
            const mr = new move_record_1.MoveRecord();
            mr.read(this);
        }
    }
    write() {
        this.writeInt32(this.tickId);
        this.writeInt32(this.time);
        this.newPosition.write(this);
        this.records = [];
        this.writeShort(this.records.length);
        for (let i = 0; i < this.records.length; i++) {
            this.records[i].write(this);
        }
    }
}
exports.MovePacket = MovePacket;
