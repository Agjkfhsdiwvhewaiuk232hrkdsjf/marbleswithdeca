"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
class NewAbilityMessage extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.NEWABILITY;
    }
    //#endregion
    read() {
        this.abilityType = this.readInt32();
    }
    write() {
        this.writeInt32(this.abilityType);
    }
}
exports.NewAbilityMessage = NewAbilityMessage;
