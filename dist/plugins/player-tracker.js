"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("./../core");
const models_1 = require("./../models");
const data_1 = require("./../networking/data");
const events_1 = require("events");
let PlayerTracker = class PlayerTracker {
    constructor() {
        this.trackAll = false;
        if (!this.emitter) {
            this.emitter = new events_1.EventEmitter();
        }
        this.trackedPlayers = {};
        core_1.Client.on('disconnect', (pd, client) => {
            if (this.trackedPlayers.hasOwnProperty(client.guid)) {
                this.trackedPlayers[client.guid] = [];
            }
        });
    }
    /**
     * Attaches an event listener to the specified event.
     * @param event The event to attach the listener to.
     * @param listener The function to invoke when the event is fired.
     */
    on(event, listener) {
        if (!this.emitter) {
            this.emitter = new events_1.EventEmitter();
        }
        return this.emitter.on(event, listener);
    }
    /**
     * Enables tracking for all clients including clients added at runtime.
     */
    trackAllPlayers() {
        if (!this.trackAll) {
            core_1.Log('Player Tracker', 'Enabled tracking for all clients.', core_1.LogLevel.Success);
            this.trackAll = true;
        }
        else {
            core_1.Log('Player Tracker', 'Tracking for all players has already been enabled.', core_1.LogLevel.Warning);
        }
    }
    /**
     * Enables player tracking for the specified client.
     * @param client The client to enable tracking for.
     */
    trackPlayersFor(client) {
        if (!this.trackedPlayers.hasOwnProperty(client.guid)) {
            this.trackedPlayers[client.guid] = [];
            core_1.Log('Player Tracker', `Tracking players for ${client.alias}`, core_1.LogLevel.Success);
        }
        else {
            core_1.Log('Player Tracker', `Already tracking players for ${client.alias}`, core_1.LogLevel.Warning);
        }
    }
    /**
     * Returns all tracked players, or an empty array if there are no clients tracking players.
     */
    getAllPlayers() {
        let players = [];
        Object.keys(this.trackedPlayers).map((guid) => {
            players = players.concat(this.trackedPlayers[guid]);
        });
        return players.filter((player, index, self) => {
            return index === self.findIndex((p) => p.name === player.name);
        });
    }
    /**
     * Returns the list of players visible to the `client` provided.
     * @param client The client to get players for.
     */
    getPlayersFor(client) {
        if (!this.trackedPlayers.hasOwnProperty(client.guid)) {
            core_1.Log('Player Tracker', `Players are not being tracked for ${client.alias}. Did you forget to call trackPlayersFor(client)?`);
            return null;
        }
        return this.trackedPlayers[client.guid];
    }
    onUpdate(client, update) {
        if (!this.trackedPlayers.hasOwnProperty(client.guid)) {
            if (this.trackAll) {
                this.trackedPlayers[client.guid] = [];
            }
            else {
                return;
            }
        }
        for (let i = 0; i < update.newObjects.length; i++) {
            if (models_1.Classes[update.newObjects[i].objectType]) {
                const pd = data_1.ObjectStatusData.processObject(update.newObjects[i]);
                pd.server = client.server.name;
                this.trackedPlayers[client.guid].push(pd);
                this.emitter.emit('enter', pd);
            }
        }
        for (let i = 0; i < update.drops.length; i++) {
            for (let n = 0; n < this.trackedPlayers[client.guid].length; n++) {
                if (this.trackedPlayers[client.guid][n].objectId === update.drops[i]) {
                    const pd = this.trackedPlayers[client.guid].splice(n, 1)[0];
                    this.emitter.emit('leave', pd);
                    break;
                }
            }
        }
    }
    onNewTick(client, newTick) {
        if (!this.trackedPlayers.hasOwnProperty(client.guid)) {
            if (this.trackAll) {
                this.trackedPlayers[client.guid] = [];
            }
            else {
                return;
            }
        }
        for (let i = 0; i < newTick.statuses.length; i++) {
            for (let n = 0; n < this.trackedPlayers[client.guid].length; n++) {
                if (newTick.statuses[i].objectId === this.trackedPlayers[client.guid][n].objectId) {
                    this.trackedPlayers[client.guid][n] =
                        data_1.ObjectStatusData.processStatData(newTick.statuses[i].stats, this.trackedPlayers[client.guid][n]);
                    this.trackedPlayers[client.guid][n].worldPos = newTick.statuses[i].pos;
                    break;
                }
            }
        }
    }
};
__decorate([
    core_1.HookPacket(core_1.PacketType.UPDATE)
], PlayerTracker.prototype, "onUpdate", null);
__decorate([
    core_1.HookPacket(core_1.PacketType.NEWTICK)
], PlayerTracker.prototype, "onNewTick", null);
PlayerTracker = __decorate([
    core_1.NrPlugin({
        name: 'Player Tracker',
        author: 'tcrane'
    })
], PlayerTracker);
exports.PlayerTracker = PlayerTracker;
