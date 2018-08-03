"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./packet-type"));
class Packet {
    // Network order == Big endian (BE).
    // Host order == Little endian (LE).
    constructor(data) {
        this.bufferIndex = 0;
        this.data = data || null;
        this.send = true;
    }
    readInt32() {
        const result = this.data.readInt32BE(this.bufferIndex);
        this.bufferIndex += 4;
        return result;
    }
    writeInt32(value) {
        this.bufferIndex = this.data.writeInt32BE(value, this.bufferIndex);
    }
    readUInt32() {
        const result = this.data.readUInt32BE(this.bufferIndex);
        this.bufferIndex += 4;
        return result;
    }
    writeUInt32(value) {
        this.bufferIndex = this.data.writeUInt32BE(value, this.bufferIndex);
    }
    readShort() {
        const result = this.data.readInt16BE(this.bufferIndex);
        this.bufferIndex += 2;
        return result;
    }
    writeShort(value) {
        this.bufferIndex = this.data.writeInt16BE(value, this.bufferIndex);
    }
    readUnsignedShort() {
        const result = this.data.readUInt16BE(this.bufferIndex);
        this.bufferIndex += 2;
        return result;
    }
    writeUnsignedShort(value) {
        this.bufferIndex = this.data.writeUInt16BE(value, this.bufferIndex);
    }
    readByte() {
        const result = this.data.readInt8(this.bufferIndex);
        this.bufferIndex++;
        return result;
    }
    writeByte(value) {
        this.bufferIndex = this.data.writeInt8(value, this.bufferIndex);
    }
    readUnsignedByte() {
        const result = this.data.readUInt8(this.bufferIndex);
        this.bufferIndex++;
        return result;
    }
    writeUnsigedByte(value) {
        this.bufferIndex = this.data.writeUInt8(value, this.bufferIndex);
    }
    readBoolean() {
        const result = this.readByte();
        return result !== 0;
    }
    writeBoolean(value) {
        const byteValue = value ? 1 : 0;
        this.writeByte(byteValue);
    }
    readFloat() {
        const result = this.data.readFloatBE(this.bufferIndex);
        this.bufferIndex += 4;
        return result;
    }
    writeFloat(value) {
        this.bufferIndex = this.data.writeFloatBE(value, this.bufferIndex);
    }
    readByteArray() {
        const arraylen = this.readShort();
        const result = new Int8Array(arraylen);
        for (let i = 0; i < arraylen; i++, this.bufferIndex++) {
            result[i] = this.data[this.bufferIndex];
        }
        return result;
    }
    writeByteArray(value) {
        if (!value) {
            this.writeShort(0);
            return;
        }
        this.writeShort(value.length);
        for (let i = 0; i < value.length; i++, this.bufferIndex++) {
            this.data[this.bufferIndex] = value[i];
        }
    }
    readString() {
        const strlen = this.readShort();
        this.bufferIndex += strlen;
        return this.data.slice(this.bufferIndex - strlen, this.bufferIndex).toString('utf8');
    }
    writeString(value) {
        if (!value) {
            this.writeShort(0);
            return;
        }
        this.writeShort(value.length);
        this.bufferIndex += this.data.write(value, this.bufferIndex, value.length, 'utf8');
    }
    readStringUTF32() {
        const strlen = this.readInt32();
        this.bufferIndex += strlen;
        return this.data.slice(this.bufferIndex - strlen, this.bufferIndex).toString('utf8');
    }
    writeStringUTF32(value) {
        if (!value) {
            this.writeInt32(0);
            return;
        }
        this.writeInt32(value.length);
        this.bufferIndex += this.data.write(value, this.bufferIndex, value.length, 'utf8');
    }
    resizeBuffer(newSize) {
        // TODO: implement
    }
    reset() {
        this.bufferIndex = 0;
        this.data = Buffer.alloc(1024);
    }
}
exports.Packet = Packet;
