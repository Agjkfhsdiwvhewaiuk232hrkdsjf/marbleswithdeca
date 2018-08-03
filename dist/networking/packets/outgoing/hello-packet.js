"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
const guid_encrypt_1 = require("../../../crypto/guid-encrypt");
class HelloPacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.HELLO;
    }
    read() {
        this.buildVersion = this.readString();
        this.gameId = this.readInt32();
        this.guid = this.readString();
        this.random1 = this.readInt32();
        this.password = this.readString();
        this.random2 = this.readInt32();
        this.secret = this.readString();
        this.keyTime = this.readInt32();
        this.key = this.readByteArray();
        this.mapJSON = this.readStringUTF32();
        this.entryTag = this.readString();
        this.gameNet = this.readString();
        this.gameNetUserId = this.readString();
        this.playPlatform = this.readString();
        this.platformToken = this.readString();
        this.userToken = this.readString();
    }
    write() {
        this.writeString(this.buildVersion);
        this.writeInt32(this.gameId);
        this.writeString(guid_encrypt_1.encryptGUID(this.guid));
        this.writeInt32(this.random1);
        this.writeString(guid_encrypt_1.encryptGUID(this.password));
        this.writeInt32(this.random2);
        this.writeString(guid_encrypt_1.encryptGUID(this.secret));
        this.writeInt32(this.keyTime);
        this.writeByteArray(this.key);
        this.writeStringUTF32(this.mapJSON);
        this.writeString(this.entryTag);
        this.writeString(this.gameNet);
        this.writeString(this.gameNetUserId);
        this.writeString(this.playPlatform);
        this.writeString(this.platformToken);
        this.writeString(this.userToken);
    }
}
exports.HelloPacket = HelloPacket;
