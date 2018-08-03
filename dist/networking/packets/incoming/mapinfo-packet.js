"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
class MapInfoPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.MAPINFO;
    }
    //#endregion
    read() {
        this.width = this.readInt32();
        this.height = this.readInt32();
        this.name = this.readString();
        this.displayName = this.readString();
        this.fp = this.readUInt32();
        this.background = this.readInt32();
        this.difficulty = this.readInt32();
        this.allowPlayerTeleport = this.readBoolean();
        this.showDisplays = this.readBoolean();
        this.clientXML = new Array(this.readShort());
        for (let i = 0; i < this.clientXML.length; i++) {
            this.clientXML[i] = this.readStringUTF32();
        }
        this.extraXML = new Array(this.readShort());
        for (let i = 0; i < this.extraXML.length; i++) {
            this.extraXML[i] = this.readStringUTF32();
        }
    }
    write() {
        this.writeInt32(this.width);
        this.writeInt32(this.height);
        this.writeString(this.name);
        this.writeString(this.displayName);
        this.writeUInt32(this.fp);
        this.writeInt32(this.background);
        this.writeInt32(this.difficulty);
        this.writeBoolean(this.allowPlayerTeleport);
        this.writeBoolean(this.showDisplays);
        this.writeShort(this.clientXML.length);
        for (let i = 0; i < this.clientXML.length; i++) {
            this.writeStringUTF32(this.clientXML[i]);
        }
        this.writeShort(this.extraXML.length);
        for (let i = 0; i < this.extraXML.length; i++) {
            this.writeStringUTF32(this.extraXML[i]);
        }
    }
}
exports.MapInfoPacket = MapInfoPacket;
