"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SocketWrapper {
    constructor(id, socket) {
        this.id = id;
        this.socket = socket;
    }
    /**
     * Removes any event listeners attached to the socket and destroys it.
     */
    destroy() {
        this.socket.removeAllListeners('close');
        this.socket.removeAllListeners('connect');
        this.socket.removeAllListeners('data');
        this.socket.removeAllListeners('error');
        this.socket.destroy();
        this.id = null;
        this.socket = null;
    }
}
exports.SocketWrapper = SocketWrapper;
