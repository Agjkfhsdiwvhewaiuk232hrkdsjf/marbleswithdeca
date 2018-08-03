"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
const world_pos_data_1 = require("../../data/world-pos-data");
const slot_object_data_1 = require("../../data/slot-object-data");
class InvSwapPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.INVSWAP;
    }
    //#endregion
    read() {
        this.time = this.readInt32();
        this.position = new world_pos_data_1.WorldPosData();
        this.position.read(this);
        this.slotObject1 = new slot_object_data_1.SlotObjectData();
        this.slotObject1.read(this);
        this.slotObject2 = new slot_object_data_1.SlotObjectData();
        this.slotObject2.read(this);
    }
    write() {
        this.writeInt32(this.time);
        this.slotObject1.write(this);
        this.slotObject2.write(this);
    }
}
exports.InvSwapPacket = InvSwapPacket;
