"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../../packet");
const slot_object_data_1 = require("../../../data/slot-object-data");
class QuestRedeemPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.QUESTREDEEM;
    }
    //#endregion
    read() {
        this.questId = this.readString();
        const slotsLen = this.readShort();
        this.slots = new Array(slotsLen);
        for (let i = 0; i < slotsLen; i++) {
            this.slots[i] = new slot_object_data_1.SlotObjectData();
            this.slots[i].read(this);
        }
    }
    write() {
        this.writeString(this.questId);
        this.writeShort(this.slots.length);
        for (let i = 0; i < this.slots.length; i++) {
            this.slots[i].write(this);
        }
    }
}
exports.QuestRedeemPacket = QuestRedeemPacket;
