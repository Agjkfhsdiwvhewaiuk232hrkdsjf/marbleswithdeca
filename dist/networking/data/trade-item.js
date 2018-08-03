"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TradeItem {
    read(packet) {
        this.item = packet.readInt32();
        this.slotType = packet.readInt32();
        this.tradeable = packet.readBoolean();
        this.included = packet.readBoolean();
    }
    write(packet) {
        packet.writeInt32(this.item);
        packet.writeInt32(this.slotType);
        packet.writeBoolean(this.tradeable);
        packet.writeBoolean(this.included);
    }
}
exports.TradeItem = TradeItem;
