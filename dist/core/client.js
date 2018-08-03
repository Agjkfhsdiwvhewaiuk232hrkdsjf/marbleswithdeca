"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = require("net");
const services_1 = require("../services");
const networking_1 = require("./../networking");
const outgoing_1 = require("./../networking/packets/outgoing");
const models_1 = require("./../models");
const data_1 = require("./../networking/data");
const core_1 = require("./../core");
const decorators_1 = require("./../decorators");
const events_1 = require("events");
const socks_1 = require("socks");
const __1 = require("..");
const pathfinding_1 = require("../services/pathfinding");
const MIN_MOVE_SPEED = 0.004;
const MAX_MOVE_SPEED = 0.0096;
const MIN_ATTACK_FREQ = 0.0015;
const MAX_ATTACK_FREQ = 0.008;
const MIN_ATTACK_MULT = 0.5;
const MAX_ATTACK_MULT = 2;
const ACCOUNT_IN_USE_REGEX = /Account in use \((\d+) seconds? until timeout\)/;
class Client {
    /**
     * Creates a new instance of the client and begins the connection process to the specified server.
     * @param server The server to connect to.
     * @param buildVersion The current build version of RotMG.
     * @param accInfo The account info to connect with.
     */
    constructor(server, buildVersion, accInfo) {
        if (!Client.emitter) {
            Client.emitter = new events_1.EventEmitter();
        }
        this.blockedPackets = [];
        this.projectiles = [];
        this.projectileUpdateTimer = null;
        this.enemies = {};
        this.autoAim = true;
        this.key = new Int8Array(0);
        this.keyTime = -1;
        this.gameId = -2;
        this.playerData = models_1.getDefaultPlayerData();
        this.playerData.server = server.name;
        this.nextPos = null;
        this.internalMoveMultiplier = 1;
        this.currentBulletId = 1;
        this.lastAttackTime = 0;
        this.connectTime = Date.now();
        this.socketConnected = false;
        this.guid = accInfo.guid;
        this.password = accInfo.password;
        this.buildVersion = buildVersion;
        this.alias = accInfo.alias;
        this.proxy = accInfo.proxy;
        this.pathfinderEnabled = accInfo.pathfinder || false;
        if (accInfo.charInfo) {
            this.charInfo = accInfo.charInfo;
        }
        else {
            this.charInfo = { charId: 0, nextCharId: 1, maxNumChars: 1 };
        }
        this.internalServer = Object.assign({}, server);
        this.nexusServer = Object.assign({}, server);
        services_1.Log(this.alias, `Starting connection to ${server.name}`, services_1.LogLevel.Info);
        this.connect();
    }
    /**
     * Attaches an event listener to the client.
     * @example
     * ```
     * Client.on('disconnect', (data: IPlayerData) => {
     *   delete this.clients[data.name];
     * });
     * ```
     * @param event The name of the event to listen for. Available events are 'connect'|'disconnect'
     * @param listener The callback to invoke when the event is fired.
     */
    static on(event, listener) {
        if (!this.emitter) {
            this.emitter = new events_1.EventEmitter();
        }
        return this.emitter.on(event, listener);
    }
    /**
     * The server the client is connected to.
     * @see `IServer` for more info.
     */
    get server() {
        return this.internalServer;
    }
    /**
     * A number between 0 and 1 which can be used to modify the speed
     * of the player. A value of 1 will be 100% move speed for the client,
     * a value of 0.5 will be 50% of the max speed. etc.
     *
     * @example
     * ```
     * client.moveMultiplier = 0.8;
     * ```
     */
    set moveMultiplier(value) {
        this.internalMoveMultiplier = Math.max(0, Math.min(value, 1));
    }
    get moveMultiplier() {
        return this.internalMoveMultiplier;
    }
    /**
     * Indicates whether or not the client's TCP socket is connected.
     */
    get connected() {
        return this.socketConnected;
    }
    /**
     * Shoots a projectile at the specified angle.
     * @param angle The angle in radians to shoot towards.
     */
    shoot(angle) {
        if (models_1.ConditionEffects.has(this.playerData.condition, models_1.ConditionEffect.STUNNED)) {
            return;
        }
        const time = this.getTime();
        const item = core_1.ResourceManager.items[this.playerData.inventory[0]];
        const attackPeriod = 1 / this.getAttackFrequency() * (1 / item.rateOfFire);
        if (time < this.lastAttackTime + attackPeriod) {
            return false;
        }
        this.lastAttackTime = time;
        let totalArc = item.arcGap * (item.numProjectiles - 1);
        if (item.arcGap <= 0) {
            totalArc = 0;
        }
        angle -= totalArc / 2;
        for (let i = 0; i < item.numProjectiles; i++) {
            const shootPacket = new outgoing_1.PlayerShootPacket();
            shootPacket.bulletId = this.getBulletId();
            shootPacket.angle = angle;
            shootPacket.containerType = item.type;
            shootPacket.time = time;
            shootPacket.startingPos = this.worldPos.clone();
            shootPacket.startingPos.x += (Math.cos(angle) * 0.3);
            shootPacket.startingPos.y += (Math.sin(angle) * 0.3);
            this.packetio.sendPacket(shootPacket);
            this.projectiles.push(new models_1.Projectile(item.type, 0, this.objectId, shootPacket.bulletId, angle, time, {
                x: shootPacket.startingPos.x,
                y: shootPacket.startingPos.y
            }));
            if (item.arcGap > 0) {
                angle += item.arcGap;
            }
            const projectile = item.projectile;
            let damage = this.random.nextIntInRange(projectile.minDamage, projectile.maxDamage);
            if (time > this.moveRecords.lastClearTime + 600) {
                damage = 0;
            }
            this.projectiles[this.projectiles.length - 1].setDamage(damage * this.getAttackMultiplier());
        }
        this.checkProjectiles();
        return true;
    }
    /**
     * Removes all event listeners and destroys any resources held by the client.
     * This should only be used when the client is no longer needed.
     */
    destroy() {
        // packet io.
        if (this.packetio) {
            this.packetio.destroy();
        }
        // timers.
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
        }
        if (this.projectileUpdateTimer) {
            clearInterval(this.projectileUpdateTimer);
            this.projectileUpdateTimer = null;
        }
        if (this.frameUpdateTimer) {
            clearInterval(this.frameUpdateTimer);
            this.frameUpdateTimer = null;
        }
        // resources.
        this.mapTiles = null;
        this.projectiles = null;
        this.enemies = null;
        if (this.socketConnected) {
            Client.emitter.emit('disconnect', Object.assign({}, this.playerData), this);
        }
        // client socket.
        if (this.clientSocket) {
            this.clientSocket.removeAllListeners('connect');
            this.clientSocket.removeAllListeners('close');
            this.clientSocket.removeAllListeners('error');
            this.clientSocket.destroy();
        }
    }
    /**
     * Switches the client connect to a proxied connection. Setting this to
     * null will remove the current proxy if there is one.
     * @param proxy The proxy to use.
     */
    setProxy(proxy) {
        if (proxy) {
            services_1.Log(this.alias, 'Connecting to new proxy.');
        }
        else {
            services_1.Log(this.alias, 'Connecting without proxy.');
        }
        this.proxy = proxy;
        this.connect();
    }
    /**
     * Connects the bot to the provided `server`.
     * @param server The server to connect to.
     */
    connectToServer(server) {
        services_1.Log(this.alias, `Switching to ${server.name}.`, services_1.LogLevel.Info);
        this.internalServer = server;
        this.nexusServer = server;
        this.connect();
    }
    /**
     * Blocks the next packet of the specified type.
     * @param packetType The packet type to block.
     */
    blockNext(packetType) {
        if (this.blockedPackets.indexOf(packetType) < 0) {
            this.blockedPackets.push(packetType);
        }
    }
    /**
     * Broadcasts a packet to all connected clients except
     * the client which broadcasted the packet.
     * @param packet The packet to broadcast.
     */
    broadcastPacket(packet) {
        const clients = __1.CLI.getClients();
        for (let i = 0; i < clients.length; i++) {
            if (clients[i].alias !== this.alias) {
                clients[i].packetio.emitPacket(packet);
            }
        }
    }
    /**
     * Returns how long the client has been connected for in milliseconds.
     * This is used for several packets including the UseItem packet.
     */
    getTime() {
        return (Date.now() - this.connectTime);
    }
    /**
     * Finds a path from the client's current position to the `to` point
     * and moves the client along the path to the `to` position.
     * @param to The point to navigate towards.
     */
    findPath(to) {
        if (!this.pathfinderEnabled) {
            services_1.Log(this.alias, 'Pathfinding is not enabled. Please enable it in the acc-config.', services_1.LogLevel.Warning);
        }
        to.x = Math.floor(to.x);
        to.y = Math.floor(to.y);
        this.pathfinder.findPath(this.worldPos.toPoint(), to).then((path) => {
            if (path.length === 0) {
                this.pathfinderTarget = null;
                this.currentPath = null;
                return;
            }
            this.pathfinderTarget = to;
            this.currentPath = path;
            this.nextPos = new data_1.WorldPosData();
            const next = this.currentPath.shift();
            this.nextPos.x = next.x + 0.5;
            this.nextPos.y = next.y + 0.5;
        }).catch((error) => {
            services_1.Log(this.alias, `Error finding path: ${error.message}`, services_1.LogLevel.Error);
        });
    }
    damage(damage, bulletId, objectId) {
        const min = damage * 3 / 20;
        const actualDamge = Math.max(min, damage - this.playerData.def);
        this.playerData.hp -= actualDamge;
        services_1.Log(this.alias, `Took ${actualDamge} damage. At ${Math.round(this.playerData.hp)} health.`);
        if (this.playerData.hp <= this.playerData.maxHP * 0.3) {
            services_1.Log(this.alias, `Auto nexused at ${Math.round(this.playerData.hp)} HP`, services_1.LogLevel.Warning);
            this.clientSocket.destroy();
            return;
        }
        const playerHit = new outgoing_1.PlayerHitPacket();
        playerHit.bulletId = bulletId;
        playerHit.objectId = objectId;
        this.packetio.sendPacket(playerHit);
    }
    checkProjectiles() {
        if (this.projectiles.length > 0) {
            if (!this.projectileUpdateTimer) {
                this.projectileUpdateTimer = setInterval(() => {
                    for (let i = 0; i < this.projectiles.length; i++) {
                        if (!this.projectiles[i].update(this.getTime())) {
                            this.projectiles.splice(i, 1);
                            continue;
                        }
                        if (this.projectiles[i].damagePlayers) {
                            if (this.worldPos.squareDistanceTo(this.projectiles[i].currentPosition) < 0.25) {
                                // hit.
                                this.damage(this.projectiles[i].damage, this.projectiles[i].bulletId, this.projectiles[i].ownerObjectId);
                                this.projectiles.splice(i, 1);
                            }
                        }
                        else {
                            let closestEnemy;
                            let closestDistance = 10000000;
                            for (const enemyId in this.enemies) {
                                if (this.enemies.hasOwnProperty(enemyId)) {
                                    const enemy = this.enemies[+enemyId];
                                    const dist = enemy.squareDistanceTo(this.projectiles[i].currentPosition);
                                    if (dist < 0.25) {
                                        if (dist < closestDistance) {
                                            closestDistance = dist;
                                            closestEnemy = enemy;
                                        }
                                    }
                                }
                            }
                            if (closestEnemy) {
                                const lastUpdate = (this.getTime() - closestEnemy.lastUpdate);
                                if (lastUpdate > 400) {
                                    if (models_1.environment.debug) {
                                        services_1.Log(this.alias, `Preventing EnemyHit. Time since last update: ${lastUpdate}`, services_1.LogLevel.Warning);
                                    }
                                    this.projectiles.splice(i, 1);
                                    continue;
                                }
                                const enemyHit = new outgoing_1.EnemyHitPacket();
                                const damage = closestEnemy.damage(this.projectiles[i].damage);
                                enemyHit.bulletId = this.projectiles[i].bulletId;
                                enemyHit.targetId = closestEnemy.objectData.objectId;
                                enemyHit.time = this.getTime();
                                enemyHit.kill = closestEnemy.objectData.hp <= damage;
                                this.packetio.sendPacket(enemyHit);
                                this.projectiles.splice(i, 1);
                                if (enemyHit.kill) {
                                    closestEnemy.dead = true;
                                }
                            }
                        }
                    }
                    if (this.projectiles.length === 0) {
                        clearInterval(this.projectileUpdateTimer);
                        this.projectileUpdateTimer = null;
                    }
                }, 1000 / 30);
            }
        }
    }
    onDamage(client, damage) {
        if (this.enemies[damage.targetId]) {
            this.enemies[damage.targetId].objectData.hp -= damage.damageAmount;
            if (this.enemies[damage.targetId].objectData.hp < 0 || damage.kill) {
                delete this.enemies[damage.targetId];
            }
            return;
        }
        if (this.enemies[damage.objectId]) {
            this.projectiles = this.projectiles.filter((p) => {
                return !(p.ownerObjectId === damage.objectId && p.bulletId === p.bulletId);
            });
        }
    }
    onMapInfo(client, mapInfoPacket) {
        if (this.charInfo.charId > 0) {
            const loadPacket = new outgoing_1.LoadPacket();
            loadPacket.charId = this.charInfo.charId;
            loadPacket.isFromArena = false;
            services_1.Log(this.alias, `Connecting to ${mapInfoPacket.name}`, services_1.LogLevel.Info);
            this.packetio.sendPacket(loadPacket);
        }
        else {
            const createPacket = new outgoing_1.CreatePacket();
            createPacket.classType = models_1.Classes.Wizard;
            createPacket.skinType = 0;
            services_1.Log(this.alias, 'Creating new char', services_1.LogLevel.Info);
            this.packetio.sendPacket(createPacket);
        }
        this.random = new services_1.Random(mapInfoPacket.fp);
        this.mapTiles = new Array(mapInfoPacket.width * mapInfoPacket.height);
        this.mapInfo = { width: mapInfoPacket.width, height: mapInfoPacket.height, name: mapInfoPacket.name };
        if (this.pathfinderEnabled) {
            this.pathfinder = new pathfinding_1.Pathfinder(mapInfoPacket.width);
        }
    }
    onUpdate(client, updatePacket) {
        // reply
        const updateAck = new outgoing_1.UpdateAckPacket();
        this.packetio.sendPacket(updateAck);
        const pathfinderUpdates = [];
        // playerdata
        for (let i = 0; i < updatePacket.newObjects.length; i++) {
            if (updatePacket.newObjects[i].status.objectId === this.objectId) {
                this.worldPos = updatePacket.newObjects[i].status.pos;
                this.playerData = data_1.ObjectStatusData.processObject(updatePacket.newObjects[i]);
                this.playerData.server = this.internalServer.name;
            }
            if (core_1.ResourceManager.objects[updatePacket.newObjects[i].objectType]) {
                const obj = core_1.ResourceManager.objects[updatePacket.newObjects[i].objectType];
                if (this.pathfinderEnabled) {
                    if (obj.fullOccupy || obj.occupySquare) {
                        const x = updatePacket.newObjects[i].status.pos.x;
                        const y = updatePacket.newObjects[i].status.pos.y;
                        pathfinderUpdates.push({
                            x: Math.floor(x),
                            y: Math.floor(y),
                            walkable: false
                        });
                    }
                }
                if (obj.enemy) {
                    if (!this.enemies[updatePacket.newObjects[i].status.objectId]) {
                        this.enemies[updatePacket.newObjects[i].status.objectId]
                            = new models_1.Enemy(obj, updatePacket.newObjects[i].status);
                    }
                }
            }
        }
        // map tiles
        for (let i = 0; i < updatePacket.tiles.length; i++) {
            const tile = updatePacket.tiles[i];
            this.mapTiles[tile.y * this.mapInfo.width + tile.x] = tile;
            if (this.pathfinderEnabled) {
                if (core_1.ResourceManager.tiles[tile.type].noWalk) {
                    pathfinderUpdates.push({
                        x: Math.floor(tile.x),
                        y: Math.floor(tile.y),
                        walkable: false
                    });
                }
            }
        }
        // drops
        for (let i = 0; i < updatePacket.drops.length; i++) {
            if (this.enemies[updatePacket.drops[i]]) {
                delete this.enemies[updatePacket.drops[i]];
            }
        }
        if (pathfinderUpdates.length > 0 && this.pathfinderEnabled) {
            this.pathfinder.updateWalkableNodes(pathfinderUpdates);
            if (this.pathfinderTarget) {
                this.findPath(this.pathfinderTarget);
            }
        }
    }
    onReconnectPacket(client, reconnectPacket) {
        this.internalServer.address = (reconnectPacket.host === '' ? this.nexusServer.address : reconnectPacket.host);
        this.internalServer.name = (reconnectPacket.host === '' ? this.nexusServer.name : reconnectPacket.name);
        this.gameId = reconnectPacket.gameId;
        this.key = reconnectPacket.key;
        this.keyTime = reconnectPacket.keyTime;
        this.connect();
    }
    onGotoPacket(client, gotoPacket) {
        const ack = new outgoing_1.GotoAckPacket();
        ack.time = this.getTime();
        this.packetio.sendPacket(ack);
        if (this.enemies[gotoPacket.objectId]) {
            this.enemies[gotoPacket.objectId].onGoto(gotoPacket.position.x, gotoPacket.position.y, this.lastFrameTime);
        }
    }
    onFailurePacket(client, failurePacket) {
        this.gameId = -2;
        this.keyTime = -1;
        this.key = new Int8Array(0);
        this.internalServer = Object.assign({}, this.nexusServer);
        this.clientSocket.destroy();
        services_1.Log(this.alias, `Received failure ${failurePacket.errorId}: "${failurePacket.errorDescription}"`, services_1.LogLevel.Error);
        const accInUse = ACCOUNT_IN_USE_REGEX.exec(failurePacket.errorDescription);
        if (accInUse) {
            const time = +accInUse[1] + 1;
            this.reconnectCooldown = time;
            services_1.Log(this.alias, `Received account in use error. Reconnecting in ${time} seconds.`, services_1.LogLevel.Warning);
        }
    }
    onAoe(client, aoePacket) {
        const aoeAck = new outgoing_1.AoeAckPacket();
        aoeAck.time = this.getTime();
        aoeAck.position = this.worldPos.clone();
        if (aoePacket.pos.squareDistanceTo(this.worldPos) < Math.pow(aoePacket.radius, 2)) {
            this.playerData.hp -= aoePacket.damage;
        }
        this.packetio.sendPacket(aoeAck);
    }
    onNewTick(client, newTickPacket) {
        this.lastTickTime = this.currentTickTime;
        this.lastTickId = newTickPacket.tickId;
        this.currentTickTime = this.getTime();
        // reply
        const movePacket = new outgoing_1.MovePacket();
        movePacket.tickId = newTickPacket.tickId;
        movePacket.time = this.getTime();
        if (this.nextPos || this.pathfinderTarget) {
            this.moveTo(this.nextPos);
        }
        movePacket.newPosition = this.worldPos;
        movePacket.records = [];
        const lastClear = this.moveRecords.lastClearTime;
        if (lastClear >= 0 && movePacket.time - lastClear > 125) {
            const len = Math.min(10, this.moveRecords.records.length);
            for (let i = 0; i < len; i++) {
                if (this.moveRecords.records[i].time >= movePacket.time - 25) {
                    break;
                }
                movePacket.records.push(this.moveRecords.records[i].clone());
            }
        }
        this.moveRecords.clear(movePacket.time);
        this.packetio.sendPacket(movePacket);
        // hp.
        const elapsedMS = this.currentTickTime - this.lastTickTime;
        this.playerData.hp += elapsedMS / 1000 * (1 + 0.12 * this.playerData.vit);
        if (this.playerData.hp > this.playerData.maxHP) {
            this.playerData.hp = this.playerData.maxHP;
        }
        for (let i = 0; i < newTickPacket.statuses.length; i++) {
            const status = newTickPacket.statuses[i];
            if (status.objectId === this.objectId) {
                const beforeHP = this.playerData.hp;
                this.playerData = data_1.ObjectStatusData.processStatData(status.stats, this.playerData);
                // synchronise the client hp if the difference is more than 30% of the HP.
                if (Math.abs(beforeHP - this.playerData.hp) < this.playerData.maxHP * 0.3) {
                    this.playerData.hp = beforeHP;
                }
                this.playerData.objectId = this.objectId;
                this.playerData.worldPos = this.worldPos;
                this.playerData.server = this.internalServer.name;
                continue;
            }
            if (this.enemies[status.objectId]) {
                this.enemies[status.objectId].onNewTick(status, elapsedMS, newTickPacket.tickId, this.lastFrameTime);
            }
        }
        if (this.autoAim && this.playerData.inventory[0] !== -1) {
            const keys = Object.keys(this.enemies);
            const projectile = core_1.ResourceManager.items[this.playerData.inventory[0]].projectile;
            const distance = projectile.lifetimeMS * (projectile.speed / 10000);
            for (const key of keys) {
                const enemy = this.enemies[+key];
                if (enemy.squareDistanceTo(this.worldPos) < Math.pow(distance, 2)) {
                    const angle = Math.atan2(enemy.objectData.worldPos.y - this.worldPos.y, enemy.objectData.worldPos.x - this.worldPos.x);
                    this.shoot(angle);
                }
            }
        }
    }
    onPing(client, pingPacket) {
        // reply
        const pongPacket = new outgoing_1.PongPacket();
        pongPacket.serial = pingPacket.serial;
        pongPacket.time = this.getTime();
        this.packetio.sendPacket(pongPacket);
    }
    onEnemyShoot(client, enemyShootPacket) {
        const shootAck = new outgoing_1.ShootAckPacket();
        shootAck.time = this.getTime();
        const owner = this.enemies[enemyShootPacket.ownerId];
        if (!owner || owner.dead) {
            shootAck.time = -1;
        }
        this.packetio.sendPacket(shootAck);
        if (!owner || owner.dead) {
            return;
        }
        for (let i = 0; i < enemyShootPacket.numShots; i++) {
            this.projectiles.push(new models_1.Projectile(owner.properties.type, enemyShootPacket.bulletType, enemyShootPacket.ownerId, (enemyShootPacket.bulletId + i) % 256, enemyShootPacket.angle + i * enemyShootPacket.angleInc, this.getTime(), enemyShootPacket.startingPos.toPrecisePoint()));
            this.projectiles[this.projectiles.length - 1].setDamage(enemyShootPacket.damage);
        }
        this.checkProjectiles();
    }
    onServerPlayerShoot(client, serverPlayerShoot) {
        if (serverPlayerShoot.ownerId === this.objectId) {
            const ack = new outgoing_1.ShootAckPacket();
            ack.time = this.getTime();
            this.packetio.sendPacket(ack);
        }
    }
    onCreateSuccess(client, createSuccessPacket) {
        this.objectId = createSuccessPacket.objectId;
        this.charInfo.charId = createSuccessPacket.charId;
        this.charInfo.nextCharId = this.charInfo.charId + 1;
        this.lastFrameTime = this.getTime();
        Client.emitter.emit('ready', Object.assign({}, this.playerData), this);
        services_1.Log(this.alias, 'Connected!', services_1.LogLevel.Success);
        this.frameUpdateTimer = setInterval(() => {
            const time = this.getTime();
            const deltaTime = time - this.lastFrameTime;
            if (this.worldPos) {
                this.moveRecords.addRecord(time, this.worldPos.x, this.worldPos.y);
            }
            const enemies = Object.keys(this.enemies).map((k) => this.enemies[+k]);
            if (enemies.length > 0) {
                for (const enemy of enemies) {
                    enemy.frameTick(this.lastTickId, time);
                }
            }
            this.lastFrameTime = time;
        }, 1000 / 30);
    }
    onConnect() {
        this.socketConnected = true;
        Client.emitter.emit('connect', Object.assign({}, this.playerData), this);
        services_1.Log(this.alias, `Connected to ${this.internalServer.name}!`, services_1.LogLevel.Success);
        this.lastTickTime = 0;
        this.lastAttackTime = 0;
        this.currentTickTime = 0;
        this.lastTickId = -1;
        this.currentBulletId = 1;
        this.enemies = {};
        this.projectiles = [];
        this.moveRecords = new models_1.MoveRecords();
        this.sendHello();
    }
    sendHello() {
        const hp = new outgoing_1.HelloPacket();
        hp.buildVersion = this.buildVersion;
        hp.gameId = this.gameId;
        hp.guid = this.guid;
        hp.password = this.password;
        hp.random1 = Math.floor(Math.random() * 1000000000);
        hp.random2 = Math.floor(Math.random() * 1000000000);
        hp.secret = '';
        hp.keyTime = this.keyTime;
        hp.key = this.key;
        hp.mapJSON = '';
        hp.entryTag = '';
        hp.gameNet = '';
        hp.gameNet = 'rotmg';
        hp.gameNetUserId = '';
        hp.playPlatform = 'rotmg';
        hp.platformToken = '';
        hp.userToken = '';
        this.packetio.sendPacket(hp);
    }
    getBulletId() {
        const bId = this.currentBulletId;
        this.currentBulletId = (this.currentBulletId + 1) % 128;
        return bId;
    }
    onClose(error) {
        this.socketConnected = false;
        Client.emitter.emit('disconnect', Object.assign({}, this.playerData), this);
        this.nextPos = null;
        this.currentPath = null;
        this.pathfinderTarget = null;
        services_1.Log(this.alias, `The connection to ${this.internalServer.name} was closed.`, services_1.LogLevel.Warning);
        this.internalServer = Object.assign({}, this.nexusServer);
        if (this.pathfinderEnabled) {
            this.pathfinder.destroy();
        }
        this.projectiles = [];
        this.enemies = {};
        if (this.frameUpdateTimer) {
            clearInterval(this.frameUpdateTimer);
            this.frameUpdateTimer = null;
        }
        let reconnectTime = 5;
        if (this.reconnectCooldown) {
            reconnectTime = this.reconnectCooldown;
            this.reconnectCooldown = null;
        }
        services_1.Log(this.alias, `Reconnecting in ${reconnectTime} seconds`);
        this.reconnectTimer = setTimeout(() => {
            this.connect();
        }, reconnectTime * 1000);
        // process.exit(0);
    }
    onError(error) {
        services_1.Log(this.alias, `Received socket error: ${error.message}`, services_1.LogLevel.Error);
    }
    connect() {
        if (this.clientSocket) {
            this.clientSocket.removeAllListeners('connect');
            this.clientSocket.removeAllListeners('close');
            this.clientSocket.removeAllListeners('error');
            this.clientSocket.destroy();
        }
        if (this.frameUpdateTimer) {
            clearInterval(this.frameUpdateTimer);
            this.frameUpdateTimer = null;
        }
        if (this.projectiles.length > 0) {
            this.projectiles = [];
        }
        if (this.projectileUpdateTimer) {
            clearInterval(this.projectileUpdateTimer);
            this.projectileUpdateTimer = null;
        }
        if (this.proxy) {
            services_1.Log(this.alias, 'Establishing proxy', services_1.LogLevel.Info);
            socks_1.SocksClient.createConnection({
                proxy: {
                    ipaddress: this.proxy.host,
                    port: this.proxy.port,
                    type: this.proxy.type,
                    userId: this.proxy.userId,
                    password: this.proxy.password
                },
                command: 'connect',
                destination: {
                    host: this.internalServer.address,
                    port: 2050
                }
            }).then((info) => {
                services_1.Log(this.alias, 'Established proxy!', services_1.LogLevel.Success);
                this.clientSocket = info.socket;
                this.initSocket(false);
            }).catch((error) => {
                services_1.Log(this.alias, 'Error establishing proxy', services_1.LogLevel.Error);
                services_1.Log(this.alias, error, services_1.LogLevel.Error);
            });
        }
        else {
            this.clientSocket = new net_1.Socket({
                readable: true,
                writable: true
            });
            this.initSocket(true);
        }
    }
    initSocket(connect) {
        if (!this.packetio) {
            this.packetio = new networking_1.PacketIO(this.clientSocket);
            this.packetio.on('packet', (data) => {
                const index = this.blockedPackets.indexOf(data.type);
                if (index > -1) {
                    this.blockedPackets = this.blockedPackets.filter((p) => p !== data.type);
                }
                else {
                    core_1.PluginManager.callHooks(data.type, data, this);
                }
            });
            this.packetio.on('error', (err) => {
                services_1.Log(this.alias, `Received PacketIO error: ${err.message}`, services_1.LogLevel.Error);
                this.clientSocket.destroy();
            });
        }
        else {
            this.packetio.reset(this.clientSocket);
        }
        if (connect) {
            this.clientSocket.connect(2050, this.internalServer.address);
        }
        else {
            this.onConnect();
        }
        this.clientSocket.on('connect', this.onConnect.bind(this));
        this.clientSocket.on('close', this.onClose.bind(this));
        this.clientSocket.on('error', this.onError.bind(this));
    }
    moveTo(target) {
        const step = this.getSpeed();
        if (!this.nextPos && this.currentPath && this.currentPath.length > 0) {
            this.nextPos = new data_1.WorldPosData();
            const next = this.currentPath.shift();
            this.nextPos.x = next.x + 0.5;
            this.nextPos.y = next.y + 0.5;
            target = this.nextPos;
        }
        if (this.currentPath && this.currentPath.length === 0) {
            this.currentPath = null;
            this.pathfinderTarget = null;
        }
        if (!target) {
            return;
        }
        if (this.worldPos.squareDistanceTo(target) > Math.pow(step, 2)) {
            const angle = Math.atan2(target.y - this.worldPos.y, target.x - this.worldPos.x);
            this.worldPos.x += Math.cos(angle) * step;
            this.worldPos.y += Math.sin(angle) * step;
        }
        else {
            this.worldPos.x = target.x;
            this.worldPos.y = target.y;
            this.nextPos = null;
        }
    }
    getAttackMultiplier() {
        if (models_1.ConditionEffects.has(this.playerData.condition, models_1.ConditionEffect.WEAK)) {
            return MIN_ATTACK_MULT;
        }
        let attackMultiplier = MIN_ATTACK_MULT + this.playerData.atk / 75 * (MAX_ATTACK_MULT - MIN_ATTACK_MULT);
        if (models_1.ConditionEffects.has(this.playerData.condition, models_1.ConditionEffect.DAMAGING)) {
            attackMultiplier *= 1.5;
        }
        return attackMultiplier;
    }
    getSpeed() {
        if (models_1.ConditionEffects.has(this.playerData.condition, models_1.ConditionEffect.SLOWED)) {
            return MIN_MOVE_SPEED;
        }
        let speed = MIN_MOVE_SPEED + this.playerData.spd / 75 * (MAX_MOVE_SPEED - MIN_MOVE_SPEED);
        const x = Math.floor(this.worldPos.x);
        const y = Math.floor(this.worldPos.y);
        let multiplier = 1;
        if (this.mapTiles[y * this.mapInfo.width + x] && core_1.ResourceManager.tiles[this.mapTiles[y * this.mapInfo.width + x].type]) {
            multiplier = core_1.ResourceManager.tiles[this.mapTiles[y * this.mapInfo.width + x].type].speed;
        }
        let tickTime = this.currentTickTime - this.lastTickTime;
        if (tickTime > 200) {
            tickTime = 200;
        }
        // tslint:disable no-bitwise
        if (models_1.ConditionEffects.has(this.playerData.condition, models_1.ConditionEffect.SPEEDY | models_1.ConditionEffect.NINJA_SPEEDY)) {
            speed *= 1.5;
        }
        // tslint:enable no-bitwise
        return (speed * multiplier * tickTime * this.internalMoveMultiplier);
    }
    getAttackFrequency() {
        if (models_1.ConditionEffects.has(this.playerData.condition, models_1.ConditionEffect.DAZED)) {
            return MIN_ATTACK_FREQ;
        }
        let atkFreq = MIN_ATTACK_FREQ + this.playerData.dex / 75 * (MAX_ATTACK_FREQ - MIN_ATTACK_FREQ);
        if (models_1.ConditionEffects.has(this.playerData.condition, models_1.ConditionEffect.BERSERK)) {
            atkFreq *= 1.5;
        }
        return atkFreq;
    }
}
__decorate([
    decorators_1.HookPacket(networking_1.PacketType.DAMAGE)
], Client.prototype, "onDamage", null);
__decorate([
    decorators_1.HookPacket(networking_1.PacketType.MAPINFO)
], Client.prototype, "onMapInfo", null);
__decorate([
    decorators_1.HookPacket(networking_1.PacketType.UPDATE)
], Client.prototype, "onUpdate", null);
__decorate([
    decorators_1.HookPacket(networking_1.PacketType.RECONNECT)
], Client.prototype, "onReconnectPacket", null);
__decorate([
    decorators_1.HookPacket(networking_1.PacketType.GOTO)
], Client.prototype, "onGotoPacket", null);
__decorate([
    decorators_1.HookPacket(networking_1.PacketType.FAILURE)
], Client.prototype, "onFailurePacket", null);
__decorate([
    decorators_1.HookPacket(networking_1.PacketType.AOE)
], Client.prototype, "onAoe", null);
__decorate([
    decorators_1.HookPacket(networking_1.PacketType.NEWTICK)
], Client.prototype, "onNewTick", null);
__decorate([
    decorators_1.HookPacket(networking_1.PacketType.PING)
], Client.prototype, "onPing", null);
__decorate([
    decorators_1.HookPacket(networking_1.PacketType.ENEMYSHOOT)
], Client.prototype, "onEnemyShoot", null);
__decorate([
    decorators_1.HookPacket(networking_1.PacketType.SERVERPLAYERSHOOT)
], Client.prototype, "onServerPlayerShoot", null);
__decorate([
    decorators_1.HookPacket(networking_1.PacketType.CREATESUCCESS)
], Client.prototype, "onCreateSuccess", null);
exports.Client = Client;
