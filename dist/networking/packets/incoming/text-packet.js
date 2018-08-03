"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
class TextPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.TEXT;
    }
    //#endregion
    read() {
        this.name = this.readString();
        this.objectId = this.readInt32();
        this.numStars = this.readInt32();
        this.bubbleTime = this.readUnsignedByte();
        this.recipient = this.readString();
        this.text = this.readString();
        this.cleanText = this.readString();
    }
    write() {
        this.writeString(this.name);
        this.writeInt32(this.objectId);
        this.writeInt32(this.numStars);
        this.writeUnsigedByte(this.bubbleTime);
        this.writeString(this.recipient);
        this.writeString(this.text);
        this.writeString(this.cleanText);
    }
}
exports.TextPacket = TextPacket;
