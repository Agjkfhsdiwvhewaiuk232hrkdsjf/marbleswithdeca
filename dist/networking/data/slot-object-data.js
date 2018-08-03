"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SlotObjectData {
    read(packet) {
        this.objectId = packet.readInt32();
        this.slotId = packet.readUnsignedByte();
        this.objectType = packet.readUInt32();
    }
    write(packet) {
        packet.writeInt32(this.objectId);
        packet.writeUnsigedByte(this.slotId);
        packet.writeInt32(this.objectType);
    }
}
exports.SlotObjectData = SlotObjectData;
