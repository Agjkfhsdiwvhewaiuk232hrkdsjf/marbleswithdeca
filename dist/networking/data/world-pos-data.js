"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WorldPosData {
    read(packet) {
        this.x = packet.readFloat();
        this.y = packet.readFloat();
    }
    write(packet) {
        packet.writeFloat(this.x);
        packet.writeFloat(this.y);
    }
    squareDistanceTo(location) {
        const a = location.x - this.x;
        const b = location.y - this.y;
        return Math.pow(a, 2) + Math.pow(b, 2);
    }
    clone() {
        const clone = new WorldPosData();
        clone.x = this.x;
        clone.y = this.y;
        return clone;
    }
    toPrecisePoint() {
        return {
            x: this.x,
            y: this.y
        };
    }
    toPoint() {
        return {
            x: Math.floor(this.x),
            y: Math.floor(this.y)
        };
    }
}
exports.WorldPosData = WorldPosData;
