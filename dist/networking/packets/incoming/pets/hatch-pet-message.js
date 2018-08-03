"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../../packet");
class HatchPetMessage extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.HATCHPET;
    }
    //#endregion
    read() {
        this.petName = this.readString();
        this.petSkin = this.readInt32();
    }
    write() {
        this.writeString(this.petName);
        this.writeInt32(this.petSkin);
    }
}
exports.HatchPetMessage = HatchPetMessage;
