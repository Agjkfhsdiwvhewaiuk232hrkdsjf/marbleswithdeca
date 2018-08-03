"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../../packet");
class EvolvedPetMessage extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.EVOLVEPET;
    }
    //#endregion
    read() {
        this.petId = this.readInt32();
        this.initialSkin = this.readInt32();
        this.finalSkin = this.readInt32();
    }
    write() {
        this.writeInt32(this.petId);
        this.writeInt32(this.initialSkin);
        this.writeInt32(this.finalSkin);
    }
}
exports.EvolvedPetMessage = EvolvedPetMessage;
