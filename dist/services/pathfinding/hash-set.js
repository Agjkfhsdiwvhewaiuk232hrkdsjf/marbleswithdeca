"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HashSet {
    constructor() {
        this.map = {};
    }
    add(item) {
        const hash = item.hash();
        this.map[hash] = item;
    }
    remove(item) {
        const hash = item.hash();
        if (this.map[hash]) {
            delete this.map[hash];
        }
    }
    contains(item) {
        return this.map.hasOwnProperty(item.hash());
    }
}
exports.HashSet = HashSet;
