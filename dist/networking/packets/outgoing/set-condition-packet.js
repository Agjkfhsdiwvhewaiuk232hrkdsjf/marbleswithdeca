"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
class SetConditionPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.SETCONDITION;
    }
    //#endregion
    read() {
        this.conditionEffect = this.readByte();
        this.conditionDuration = this.readFloat();
    }
    write() {
        this.writeByte(this.conditionEffect);
        this.writeFloat(this.conditionDuration);
    }
}
exports.SetConditionPacket = SetConditionPacket;
