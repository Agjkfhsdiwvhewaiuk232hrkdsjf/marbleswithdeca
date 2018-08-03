"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GroundTileData {
    read(packet) {
        this.x = packet.readShort();
        this.y = packet.readShort();
        this.type = packet.readUnsignedShort();
    }
    write(packet) {
        packet.writeShort(this.x);
        packet.writeShort(this.y);
        packet.writeUnsignedShort(this.type);
    }
}
exports.GroundTileData = GroundTileData;
