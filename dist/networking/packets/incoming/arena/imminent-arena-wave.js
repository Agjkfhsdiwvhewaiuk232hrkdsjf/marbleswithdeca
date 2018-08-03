"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../../packet");
class ImminentArenaWavePacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.IMMINENTARENA_WAVE;
    }
    //#endregion
    read() {
        this.currentRuntime = this.readInt32();
    }
    write() {
        this.writeInt32(this.currentRuntime);
    }
}
exports.ImminentArenaWavePacket = ImminentArenaWavePacket;
