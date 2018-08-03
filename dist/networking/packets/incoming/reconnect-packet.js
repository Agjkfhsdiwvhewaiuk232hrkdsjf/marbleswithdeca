"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
class ReconnectPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.RECONNECT;
    }
    //#endregion
    read() {
        this.name = this.readString();
        this.host = this.readString();
        this.stats = this.readString();
        this.port = this.readInt32();
        this.gameId = this.readInt32();
        this.keyTime = this.readInt32();
        this.isFromArena = this.readBoolean();
        const keyLen = this.readShort();
        this.key = new Int8Array(keyLen);
        for (let i = 0; i < keyLen; i++) {
            this.key[i] = this.readByte();
        }
    }
    write() {
        this.writeString(this.name);
        this.writeString(this.host);
        this.writeString(this.stats);
        this.writeInt32(this.port);
        this.writeInt32(this.gameId);
        this.writeInt32(this.keyTime);
        this.writeBoolean(this.isFromArena);
        this.writeShort(this.key.length);
        for (let i = 0; i < this.key.length; i++) {
            this.writeByte(this.key[i]);
        }
    }
}
exports.ReconnectPacket = ReconnectPacket;
