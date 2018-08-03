"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MoveRecord {
    read(packet) {
        this.time = packet.readInt32();
        this.x = packet.readFloat();
        this.y = packet.readFloat();
    }
    write(packet) {
        packet.writeInt32(this.time);
        packet.writeFloat(this.x);
        packet.writeFloat(this.y);
    }
    clone() {
        const clone = new MoveRecord();
        clone.time = this.time;
        clone.x = this.x;
        clone.y = this.y;
        return clone;
    }
}
exports.MoveRecord = MoveRecord;
