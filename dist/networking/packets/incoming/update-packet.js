"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("../../packet");
const ground_tile_data_1 = require("./../../data/ground-tile-data");
const object_data_1 = require("../../data/object-data");
class UpdatePacket extends packet_1.Packet {
    constructor() {
        super(...arguments);
        this.type = packet_1.PacketType.UPDATE;
    }
    read() {
        const tilesLen = this.readShort();
        this.tiles = new Array(tilesLen);
        for (let i = 0; i < tilesLen; i++) {
            const gd = new ground_tile_data_1.GroundTileData();
            gd.read(this);
            this.tiles[i] = gd;
        }
        const newObjectsLen = this.readShort();
        this.newObjects = new Array(newObjectsLen);
        for (let i = 0; i < newObjectsLen; i++) {
            const od = new object_data_1.ObjectData();
            od.read(this);
            this.newObjects[i] = od;
        }
        const dropsLen = this.readShort();
        this.drops = new Array(dropsLen);
        for (let i = 0; i < dropsLen; i++) {
            this.drops[i] = this.readInt32();
        }
    }
    write() {
        this.writeShort(this.tiles.length);
        for (let i = 0; i < this.tiles.length; i++) {
            this.tiles[i].write(this);
        }
        this.writeShort(this.newObjects.length);
        for (let i = 0; i < this.newObjects.length; i++) {
            this.newObjects[i].write(this);
        }
        this.writeShort(this.drops.length);
        for (let i = 0; i < this.drops.length; i++) {
            this.writeInt32(this.drops[i]);
        }
    }
}
exports.UpdatePacket = UpdatePacket;
