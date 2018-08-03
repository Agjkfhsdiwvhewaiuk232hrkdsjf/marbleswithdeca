"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
const object_status_data_1 = require("./../../data/object-status-data");
class NewTickPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.NEWTICK;
    }
    //#endregion
    read() {
        this.tickId = this.readInt32();
        this.tickTime = this.readInt32();
        const statusesLen = this.readShort();
        this.statuses = new Array(statusesLen);
        for (let i = 0; i < statusesLen; i++) {
            const osd = new object_status_data_1.ObjectStatusData();
            osd.read(this);
            this.statuses[i] = osd;
        }
    }
    write() {
        this.writeInt32(this.tickId);
        this.writeInt32(this.tickTime);
        this.writeShort(this.statuses.length);
        for (let i = 0; i < this.statuses.length; i++) {
            this.statuses[i].write(this);
        }
    }
}
exports.NewTickPacket = NewTickPacket;
