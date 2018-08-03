"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RC4 {
    /**
     * Constructs a new RC4 cipher object and initializes
     * the Keystream State with the given key.
     * @param key The key to use in the Keystream.
     */
    constructor(key) {
        this.key = key;
        this.reset();
    }
    /**
     * Performs an inline XOR on all bits in the data buffer with
     * the next bit of the Keystream.
     * @param data A stream of data to cipher using the Keystream.
     */
    cipher(data) {
        for (let n = 0; n < data.length; n++) {
            this.i = (this.i + 1) % 256;
            this.j = (this.j + this.state[this.i]) % 256;
            const tmp = this.state[this.i];
            this.state[this.i] = this.state[this.j];
            this.state[this.j] = tmp;
            const k = this.state[(this.state[this.i] + this.state[this.j]) % 256];
            /* tslint:disable no-bitwise */
            data[n] = (data[n] ^ k);
            /* tslint:enable no-bitwise */
        }
    }
    /**
     * Initializes the Keystream State.
     */
    reset() {
        this.state = new Array(256);
        this.i = 0;
        this.j = 0;
        for (let i = 0; i < 256; i++) {
            this.state[i] = i;
        }
        let j = 0;
        for (let i = 0; i < 256; i++) {
            j = (j + this.state[i] + this.key[i % this.key.length]) % 256;
            const tmp = this.state[i];
            this.state[i] = this.state[j];
            this.state[j] = tmp;
        }
    }
}
exports.RC4 = RC4;
/**
 * The RC4 Private Key used to encrypt outgoing packet.
 * This key is a Hex String, so should be converted to
 * a Buffer for use.
 * @example
 * const key = Buffer.from(OUTGOING_KEY, 'hex');
 */
exports.OUTGOING_KEY = '6a39570cc9de4ec71d64821894';
/**
 * The RC4 Private Key to decrypt incoming packet data.
 * This key is a Hex String, so should be converted to
 * a Buffer for use.
 * @example
 * const key = Buffer.from(INCOMING_KEY, 'hex');
 */
exports.INCOMING_KEY = 'c79332b197f92ba85ed281a023';
