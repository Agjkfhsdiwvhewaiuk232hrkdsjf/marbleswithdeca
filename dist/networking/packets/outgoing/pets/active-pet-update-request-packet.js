"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../../packet");
class ActivePetUpdateRequestPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.ACTIVEPET_UPDATE_REQUEST;
    }
    //#endregion
    read() {
        this.commandType = this.readByte();
        this.instanceId = this.readInt32();
    }
    write() {
        this.writeByte(this.commandType);
        this.writeInt32(this.instanceId);
    }
}
exports.ActivePetUpdateRequestPacket = ActivePetUpdateRequestPacket;
