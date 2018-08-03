"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Random {
    constructor(seed) {
        this.seed = seed;
    }
    nextIntInRange(min, max) {
        if (min === max) {
            return min;
        }
        return min + this.generate() % (max - min);
    }
    generate() {
        // tslint:disable no-bitwise
        let hi = 0;
        let lo = 0;
        lo = 16807 * (this.seed & 65535);
        hi = 16807 * (this.seed >> 16);
        lo += (hi & 32767) << 16;
        lo += hi >> 15;
        if (lo > 2147483647) {
            lo -= 2147483647;
        }
        this.seed = lo;
        return this.seed;
        // tslint:enable no-bitwise
    }
}
exports.Random = Random;
