"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
const slot_object_data_1 = require("../../data/slot-object-data");
class InvDropPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.INVDROP;
    }
    //#endregion
    read() {
        this.slotObject = new slot_object_data_1.SlotObjectData();
        this.slotObject.read(this);
    }
    write() {
        this.slotObject.write(this);
    }
}
exports.InvDropPacket = InvDropPacket;
