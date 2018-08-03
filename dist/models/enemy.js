"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const object_status_data_1 = require("../networking/data/object-status-data");
class Enemy {
    constructor(properties, status) {
        this.properties = properties;
        this.objectData = object_status_data_1.ObjectStatusData.processObjectStatus(status);
        this.dead = false;
        this.lastUpdate = 0;
        this.lastTickId = -1;
        this.currentPos = status.pos.toPrecisePoint();
        this.tickPos = {
            x: this.currentPos.x,
            y: this.currentPos.y
        };
        this.posAtTick = {
            x: this.currentPos.x,
            y: this.currentPos.y
        };
        this.moveVector = {
            x: 0,
            y: 0
        };
    }
    onNewTick(objectStatus, tickTime, tickId, clientTime) {
        this.objectData = object_status_data_1.ObjectStatusData.processObjectStatus(objectStatus, this.objectData);
        if (this.lastTickId < tickId) {
            this.moveTo(this.tickPos.x, this.tickPos.y);
        }
        this.lastUpdate = clientTime;
        this.tickPos.x = objectStatus.pos.x;
        this.tickPos.y = objectStatus.pos.y;
        this.posAtTick.x = this.currentPos.x;
        this.posAtTick.y = this.currentPos.y;
        this.moveVector = {
            x: (this.tickPos.x - this.posAtTick.x) / tickTime,
            y: (this.tickPos.y - this.posAtTick.y) / tickTime
        };
        this.lastTickId = tickId;
        this.lastUpdate = clientTime;
    }
    squareDistanceTo(point) {
        const a = point.x - this.currentPos.x;
        const b = point.y - this.currentPos.y;
        return Math.pow(a, 2) + Math.pow(b, 2);
    }
    damage(damage) {
        const min = damage * 3 / 20;
        const actualDamge = Math.max(min, damage - this.objectData.def);
        return actualDamge;
    }
    frameTick(lastTick, clientTime) {
        if (!(this.moveVector.x === 0 && this.moveVector.y === 0)) {
            if (this.lastTickId < lastTick) {
                this.moveVector.x = 0;
                this.moveVector.y = 0;
                this.moveTo(this.tickPos.x, this.tickPos.y);
            }
            else {
                const time = clientTime - this.lastUpdate;
                const dX = this.posAtTick.x + time * this.moveVector.x;
                const dY = this.posAtTick.y + time * this.moveVector.y;
                this.moveTo(dX, dY);
            }
        }
    }
    onGoto(x, y, time) {
        this.moveTo(x, y);
        this.tickPos.x = x;
        this.tickPos.y = y;
        this.posAtTick.x = x;
        this.posAtTick.y = y;
        this.moveVector.x = 0;
        this.moveVector.y = 0;
        this.lastUpdate = time;
    }
    moveTo(x, y) {
        this.currentPos.x = x;
        this.currentPos.y = y;
    }
}
exports.Enemy = Enemy;
