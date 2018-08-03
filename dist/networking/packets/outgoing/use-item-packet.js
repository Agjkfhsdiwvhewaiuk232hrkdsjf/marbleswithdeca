"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
const slot_object_data_1 = require("../../data/slot-object-data");
const world_pos_data_1 = require("../../data/world-pos-data");
class UseItemPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.USEITEM;
    }
    //#endregion
    read() {
        this.time = this.readInt32();
        this.slotObject = new slot_object_data_1.SlotObjectData();
        this.slotObject.read(this);
        this.itemUsePos = new world_pos_data_1.WorldPosData();
        this.itemUsePos.read(this);
        this.useType = this.readByte();
    }
    write() {
        this.writeInt32(this.time);
        this.slotObject.write(this);
        this.itemUsePos.write(this);
        this.writeByte(this.useType);
    }
}
exports.UseItemPacket = UseItemPacket;
