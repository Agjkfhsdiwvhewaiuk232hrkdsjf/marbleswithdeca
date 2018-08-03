"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const packets_1 = require("./packets");
const rc4_1 = require("./../crypto/rc4");
const logger_1 = require("./../services/logger");
const environment_1 = require("./../models/environment");
const packet_head_1 = require("./packet-head");
const packet_type_1 = require("./packet-type");
class PacketIO {
    constructor(socket) {
        this.resetBuffer();
        this.emitter = new events_1.EventEmitter();
        this.socket = socket;
        this.sendRC4 = new rc4_1.RC4(Buffer.from(rc4_1.OUTGOING_KEY, 'hex'));
        this.receiveRC4 = new rc4_1.RC4(Buffer.from(rc4_1.INCOMING_KEY, 'hex'));
        socket.on('data', this.processData.bind(this));
    }
    /**
     * Resets the RC4 state and attaches to the new socket.
     * @param socket The socket to attach the PacketIO to.
     */
    reset(socket) {
        this.socket.removeAllListeners('data');
        this.socket = socket;
        this.resetBuffer();
        this.sendRC4 = new rc4_1.RC4(Buffer.from(rc4_1.OUTGOING_KEY, 'hex'));
        this.receiveRC4 = new rc4_1.RC4(Buffer.from(rc4_1.INCOMING_KEY, 'hex'));
        socket.on('data', this.processData.bind(this));
    }
    /**
     * Attaches an event listener to the PacketIO event emitter.
     * @param event The event to listen for. Current events are `'connect'|'disconnect'`
     * @param listener The function to call when the event is fired.
     * The current method signature is `(playerData: IPlayerData, client: Client)`
     */
    on(event, listener) {
        return this.emitter.on(event, listener);
    }
    /**
     * Removes all event listeners and destroys any resources held by the PacketIO.
     * This should only be used when the PacketIO is no longer needed.
     */
    destroy() {
        if (this.socket) {
            this.socket.removeAllListeners('data');
        }
        this.receiveRC4 = null;
        this.sendRC4 = null;
        this.currentHead = null;
        this.packetBuffer = null;
        this.emitter.removeAllListeners('error');
        this.emitter.removeAllListeners('packet');
    }
    /**
     * Sends a packet.
     * @param packet The packet to send.
     */
    sendPacket(packet) {
        if (this.socket.destroyed) {
            return;
        }
        packet.reset();
        packet.write();
        // resize to as small as needed.
        packet.data = packet.data.slice(0, packet.bufferIndex);
        let packetSize = packet.data.length;
        this.sendRC4.cipher(packet.data);
        packetSize += 5;
        packet.data = Buffer.concat([Buffer.alloc(5), packet.data], packetSize);
        packet.bufferIndex = 0;
        packet.writeInt32(packetSize);
        packet.writeByte(packet.type);
        if (environment_1.environment.debug) {
            logger_1.Log('PacketIO', `WRITE: id: ${packet.type}, size: ${packetSize}`, logger_1.LogLevel.Info);
        }
        this.socket.write(packet.data);
        packet = null;
    }
    /**
     * Emits a packet from this PacketIO instance. This will only
     * emit the packet to the clients subscribed to this particular PacketIO.
     * @param packet The packet to emit.
     */
    emitPacket(packet) {
        if (packet) {
            this.emitter.emit('packet', packet);
        }
    }
    processHead() {
        let packetSize;
        let packetId;
        try {
            packetSize = this.packetBuffer.readInt32BE(0);
            packetId = this.packetBuffer.readInt8(4);
            if (packetSize < 0) {
                throw new Error('Invalid packet size.');
            }
            if (packetId < 0) {
                throw new Error('Invalid packet id.');
            }
        }
        catch (err) {
            if (environment_1.environment.debug) {
                logger_1.Log('PacketIO', `READ: id: ${packetId}, size: ${packetSize}`, logger_1.LogLevel.Error);
            }
            this.emitter.emit('error', err);
            this.resetBuffer();
            return;
        }
        this.currentHead = new packet_head_1.PacketHead(packetId, packetSize);
        this.packetBuffer = Buffer.concat([this.packetBuffer, Buffer.alloc(packetSize - 5)], packetSize);
    }
    processData(data) {
        // process all data which has arrived.
        for (let i = 0; i < data.length; i++) {
            // reconnecting to the nexus causes a 'buffer' byte to be sent
            // which should be skipped.
            if (this.index === 0 && data[i] === 255) {
                continue;
            }
            if (this.index < this.packetBuffer.length) {
                this.packetBuffer[this.index++] = data[i];
            }
            else {
                if (!this.currentHead) {
                    this.processHead();
                }
                else {
                    // packet buffer is full, emit a packet before continuing.
                    const packet = this.constructPacket();
                    this.emitPacket(packet);
                }
                if (this.index === 0 && data[i] === 255) {
                    continue;
                }
                this.packetBuffer[this.index++] = data[i];
            }
        }
        // if the packet buffer is full, emit a packet.
        if (this.index === this.packetBuffer.length) {
            if (!this.currentHead) {
                this.processHead();
            }
            else {
                // packet buffer is full, emit a packet before continuing.
                const packet = this.constructPacket();
                this.emitPacket(packet);
            }
        }
    }
    constructPacket() {
        const packetData = this.packetBuffer.slice(5);
        this.receiveRC4.cipher(packetData);
        let packet;
        try {
            packet = packets_1.Packets.create(this.currentHead.id, packetData);
            packet.bufferIndex = 0;
        }
        catch (error) {
            if (environment_1.environment.debug) {
                logger_1.Log('PacketIO', error.message, logger_1.LogLevel.Error);
            }
        }
        if (packet) {
            try {
                packet.read();
            }
            catch (error) {
                if (environment_1.environment.debug) {
                    logger_1.Log('PacketIO', error, logger_1.LogLevel.Error);
                }
                this.emitter.emit('error', new Error('Invalid packet structure.'));
                logger_1.Log('PacketIO', `Error while reading ${packet_type_1.PacketType[packet.type]}`, logger_1.LogLevel.Error);
                this.resetBuffer();
                return;
            }
            packet.data = null;
        }
        if (environment_1.environment.debug) {
            logger_1.Log('PacketIO', `READ: id: ${this.currentHead.id}, size: ${this.currentHead.length}`, logger_1.LogLevel.Info);
        }
        this.resetBuffer();
        return packet;
    }
    resetBuffer() {
        this.packetBuffer = Buffer.alloc(5);
        this.index = 0;
        this.currentHead = null;
    }
}
exports.PacketIO = PacketIO;
