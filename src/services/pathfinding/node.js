"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Node {
    constructor(x, y) {
        this.parent = null;
        this.gCost = 0;
        this.hCost = 0;
        this.x = 0;
        this.y = 0;
        this.walkable = true;
        this.heapIndex = -1;
        this.x = x;
        this.y = y;
    }
    get fCost() {
        return this.gCost + this.hCost;
    }
    hash() {
        return this.x + '' + this.y;
    }
    compareTo(item) {
        if (this.fCost > item.fCost) {
            return -1;
        }
        if (this.fCost === item.fCost) {
            if (this.hCost > item.hCost) {
                return -1;
            }
            if (this.hCost < item.hCost) {
                return 1;
            }
            return 0;
        }
        return 1;
    }
}
exports.Node = Node;
