"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const object_status_data_1 = require("./object-status-data");
class ObjectData {
    read(packet) {
        this.objectType = packet.readUnsignedShort();
        this.status = new object_status_data_1.ObjectStatusData();
        this.status.read(packet);
    }
    write(packet) {
        packet.writeUnsignedShort(this.objectType);
        this.status.write(packet);
    }
}
exports.ObjectData = ObjectData;
