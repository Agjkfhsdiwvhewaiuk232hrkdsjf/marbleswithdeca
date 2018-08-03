"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../../packet");
class DeletePetMessage extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.DELETEPET;
    }
    //#endregion
    read() {
        this.petId = this.readInt32();
    }
    write() {
        this.writeInt32(this.petId);
    }
}
exports.DeletePetMessage = DeletePetMessage;
