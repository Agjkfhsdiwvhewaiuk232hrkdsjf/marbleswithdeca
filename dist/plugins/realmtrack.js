"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_module_1 = require("./../core/plugin-module");
const object_status_data_1 = require("./../networking/data/object-status-data");
const player_tracker_1 = require("./player-tracker");
const Discord = require("discord.js");
const fs = require("fs");
var config = JSON.parse(fs.readFileSync("./realmtrack-config.json"));
var realmPosList = new Array();
let RealmTrack = class RealmTrack {
    constructor() {
        this.ready = false;
        this.bot = new Discord.Client();
        this.bot.login(process.env.token);
        this.bot.once('ready', () => this.ready = true);
        plugin_module_1.Client.on('connect', (pd, client) => {
            this.loop(client, true);
        });
        process.on('uncaughtException', function (exception) {
            plugin_module_1.Log(exception.name, exception.message);
        });
        process.on('unhandledRejection', (reason, p) => {
            plugin_module_1.Log('Unhandled Rejection', 'at: ' + p + ' reason: ' + reason);
        });
        plugin_module_1.PluginManager.afterInit(() => {
            let portalList = new Array();
            this.playerTracker = plugin_module_1.PluginManager.getInstanceOf(player_tracker_1.PlayerTracker);
            this.playerTracker.trackAllPlayers();
            this.playerTracker.on('leave', player => {
                if (config.blacklistedMembers.find((name) => name == player.name) != null)
                    return;
                if (config.blacklistedGuilds.find((name) => name == player.guildName) != null)
                    return;
                let bazSide = -1;
                let shortServer = this.getSrv(player.server);
                let trackedPlayer = config.list.find((x) => x.name == player.name);
                let items = this.getItemsOf(player.inventory);
                let px = player.worldPos.x;
                let py = player.worldPos.y;
                /* ------------------ BAZAAR ------------------ */
                if (py < 135 && py > 131) {
                    if (px < 142 && px > 138)
                        bazSide = 0;
                    if (px < 180 && px > 176)
                        bazSide = 1;
                }
                else if (py < 139 && py > 127) {
                    if (px < 148 && px > 138)
                        bazSide = 2;
                    if (px < 180 && px > 170)
                        bazSide = 3;
                }
                let side = '';
                switch (bazSide) {
                    case 0:
                        side = 'Left';
                        break;
                    case 1:
                        side = 'Right';
                        break;
                    case 2:
                        side = 'close to Left';
                        break;
                    case 3:
                        side = 'close to Right';
                        break;
                }
                if (side != '') {
                    let roleString = '';
                    if (items != '') {
                        if (trackedPlayer == null) {
                            config.list.push({ name: player.name, type: 'Temporarily tracked' });
                            setTimeout(() => {
                                config.list.splice(config.list.indexOf(config.list
                                    .find((name) => name == player.name)), 1);
                            }, 90000);
                        }
                        this.bot.channels.get('472323417421643777')
                            .send(player.name + ' - ' + side + ' Bazaar - ' + items + ' - ' + shortServer);
                    }
                    else if (trackedPlayer != null) {
                        this.bot.channels.get('472323417421643777')
                            .send(player.name + ' - ' + side + ' Bazaar' + ' - ' + shortServer);
                    }
                    items = null;
                    trackedPlayer = null;
                }
                bazSide = null;
                side = null;
                /* ------------------ BAZAAR ------------------ */
                /* ------------------ MISC LOCATIONS ------------------ */
                let locName = '';
                if (locName == '') {
                    if (py > 134 && py < 137) {
                        if (px > 161 && px < 164)
                            locName = 'Vault';
                        if (px > 154 && px < 157)
                            locName = 'Guild Hall';
                    }
                    if (px > 161 && px < 164 && py > 129 && py < 131)
                        locName = 'Pet Yard';
                    if (px > 164 && px < 167 && py > 118 && py < 121)
                        locName = 'Daily Quest Room';
                    if (px > 131 && px < 134 && py > 99 && py < 101)
                        locName = 'the Arena';
                }
                if (locName != '' && trackedPlayer != null) {
                    this.bot.channels.get('472323417421643777')
                        .send(player.name + ' - ' + locName + ' - ' + shortServer);
                    items = null;
                    trackedPlayer = null;
                }
                locName = null;
                /* ------------------ MISC LOCATIONS ------------------ */
                //even though they are ugly, the duplicate declarations below 
                //are there so it doesn't do heavy calls when not needed
                /* ------------------ PORTAL ------------------ */
                if (items != null && items != '') {
                    let portal = portalList.find(portal => px > portal.x - 2
                        && px < portal.x + 2
                        && py > portal.y - 2
                        && py < portal.y + 2);
                    if (portal != null) {
                        this.bot.channels.get('472323417421643777')
                            .send(player.name + ' - ' + portal.name + ' - ' + items + ' - ' + shortServer);
                        items = null;
                        trackedPlayer = null;
                    }
                    portal = null;
                }
                else if (trackedPlayer != null) {
                    let portal = portalList.find(portal => px > portal.x - 2
                        && px < portal.x + 2
                        && py > portal.y - 2
                        && py < portal.y + 2);
                    if (portal != null) {
                        this.bot.channels.get('472323417421643777')
                            .send(player.name + ' - ' + portal.name + ' - ' + shortServer);
                        trackedPlayer = null;
                    }
                    portal = null;
                }
                /* ------------------ PORTAL ------------------ */
                /* ------------------ REALM ------------------ */
                if (items != null && items != '') {
                    let realmPos = realmPosList.find(x => px > +x[0] - 2
                        && px < +x[0] + 2
                        && py > +x[1] - 2
                        && py < +x[1] + 2
                        && shortServer == x[3]);
                    if (realmPos != null) {
                        this.bot.channels.get('472323417421643777')
                            .send(player.name + ' - ' + realmPos[2] + ' - ' + items + ' - ' + shortServer);
                        realmPos = null;
                        trackedPlayer = null;
                    }
                    realmPos = null;
                }
                else if (player.currentFame >= 10000) {
                    let realmPos = realmPosList.find(x => px > +x[0] - 2
                        && px < +x[0] + 2
                        && py > +x[1] - 2
                        && py < +x[1] + 2
                        && shortServer == x[3]);
                    if (realmPos != null) {
                        this.bot.channels.get('472323417421643777')
                            .send(player.name + ' (' + Math.round(player.currentFame / 1000 * 10) / 10 + 'k BF)' + ' - ' + realmPos[2] + ' - ' + shortServer);
                        realmPos = null;
                        trackedPlayer = null;
                    }
                    realmPos = null;
                }
                else if (trackedPlayer != null) {
                    let realmPos = realmPosList.find(x => px > +x[0] - 2
                        && px < +x[0] + 2
                        && py > +x[1] - 2
                        && py < +x[1] + 2
                        && shortServer == x[3]);
                    if (realmPos != null) {
                        this.bot.channels.get('472323417421643777')
                            .send(player.name + ' - ' + realmPos[2] + ' - ' + shortServer);
                        realmPos = null;
                        trackedPlayer = null;
                    }
                    realmPos = null;
                }
                /* ------------------ REALM ------------------ */
                /* ------------------ FINAL DISPOSE ------------------ */
                items = null;
                trackedPlayer = null;
                shortServer = null;
                px = null;
                py = null;
                /* ------------------ FINAL DISPOSE ------------------ */
            });
            this.playerTracker.on('enter', player => {
                if (config.blacklistedMembers.find((name) => name == player.name) != null)
                    return;
                if (config.blacklistedGuilds.find((name) => name == player.guildName) != null)
                    return;
                let lhCount = 0;
                let vialCount = 0;
                let items = this.getItemsOf(player.inventory, [{ num: 583, item: 'Vial of Pure Darkness', event: false },
                    { num: 2991, item: 'Lost Halls Key', event: false }]);
                if (items != '') {
                    this.bot.channels.get('472323417421643777')
                        .send(player.name + ' - ' + items + ' - ' + this.getSrv(player.server));
                    items = null;
                    return;
                }
                items = null;
                let trackedPlayer = config.list.find((x) => x.name == player.name);
                if (trackedPlayer != null) {
                    let type = (trackedPlayer.type == ' ' ?
                        '' : trackedPlayer.type);
                    this.bot.channels.get('472323417421643777')
                        .send(player.name + ' - ' + type + ' - ' + this.getSrv(player.server));
                    type = null;
                }
                trackedPlayer = null;
            });
            this.playerTracker.on('pop', keyPop => {
                if (portalList == null)
                    portalList = new Array();
                plugin_module_1.Log('RealmTrack', this.getSrv(keyPop[0].server) + ' - ' + keyPop[1]);
                let portal = {
                    x: keyPop[0].worldPos.x,
                    y: keyPop[0].worldPos.y,
                    name: keyPop[1]
                };
                portalList.push(portal);
                portal = null;
            });
        });
    }
    onUpdate(client, update) {
        let obj = update.newObjects.find(x => x.objectType == 1810);
        if (obj != null) {
            let objData = object_status_data_1.ObjectStatusData.processObject(obj);
            if (objData != null && realmPosList.find(realmPos => realmPos[2] == objData.name.slice(12)
                && realmPos[3] == client.alias) == null) {
                realmPosList.push([objData.worldPos.x.toString(),
                    objData.worldPos.y.toString(),
                    objData.name.slice(12),
                    client.alias]);
                setTimeout(() => {
                    realmPosList.splice(realmPosList.indexOf([objData.worldPos.x.toString(),
                        objData.worldPos.y.toString(),
                        objData.name.slice(12),
                        client.alias]), 1);
                    objData = null;
                }, 85000);
            }
        }
        obj = null;
    }
    loop(cli, initial) {
        if (initial)
            setTimeout(() => this.loop(cli, false), 17500);
        else {
            cli.findPath({ x: 159, y: 102 });
            setTimeout(() => {
                cli.findPath({ x: 157, y: 123 });
                setTimeout(() => this.loop(cli, false), 90000);
            }, 15000);
        }
    }
    getItemsOf(playerInv, trackList, isRealm = false) {
        if (playerInv == null) {
            plugin_module_1.Log('RealmTrack', 'Null player inventory passed in getItemsOf().', plugin_module_1.LogLevel.Error);
            return;
        }
        let itemList = new Array();
        let pingList = new Array();
        let itemString = '';
        let count = 0;
        if (trackList == null) {
            for (let i = 0; i < config.trackedItems.length; i++)
                for (let k = 0; k < playerInv.length; k++) {
                    if (playerInv[k] == config.trackedItems[i].id)
                        count++;
                    if (k == playerInv.length - 1)
                        if (count != 0) {
                            let item = { item: config.trackedItems[i].name, num: count, event: (config.trackedItems[i].event == null ? false : config.trackedItems[i].event) };
                            itemList.push(item);
                            item = null;
                            count = 0;
                        }
                }
        }
        else {
            for (let i = 0; i < trackList.length; i++)
                for (let k = 0; k < playerInv.length; k++) {
                    if (playerInv[k] == trackList[i].num)
                        count++;
                    if (k == playerInv.length - 1)
                        if (count != 0) {
                            let item = { item: trackList[i].item, num: count, event: trackList[i].event };
                            itemList.push(item);
                            item = null;
                            count = 0;
                        }
                }
        }
        count = null;
        if (itemList.length > 0) {
            let keyAmount = 0;
            for (let i = 0; i < itemList.length; i++) {
                if (itemList[i].num == 0 || itemList[i].item == '')
                    continue;
                keyAmount += itemList[i].num;
                let baseString = itemList[i].num + 'x ' + itemList[i].item;
                if (itemString == '')
                    itemString = baseString;
                else
                    itemString += ', ' + baseString;
                baseString = null;
            }
            itemList = null;
            keyAmount = null;
            return itemString;
        }
        else {
            itemList = null;
            itemString = null;
            return '';
        }
    }
    print(consoleStr, server) {
        if (consoleStr != '')
            plugin_module_1.Log('RealmTrack', server + ' - ' + consoleStr);
        else
            plugin_module_1.Log('RealmTrack', 'Empty console string passed in print().', plugin_module_1.LogLevel.Warning);
    }
    getSrv(str) {
        switch (str) {
            case 'USEast': return 'USE';
            case 'USEast2': return 'USE2';
            case 'USEast3': return 'USE3';
            case 'USWest': return 'USW';
            case 'USWest2': return 'USW2';
            case 'USWest3': return 'USW3';
            case 'USSouth': return 'USS';
            case 'USSouth2': return 'USS2';
            case 'USSouth3': return 'USS3';
            case 'USMidWest2': return 'USMW2';
            case 'USMidWest': return 'USMW';
            case 'USNorthWest': return 'USNW';
            case 'USSouthWest': return 'USSW';
            case 'Australia': return 'AUS';
            case 'AsiaEast': return 'AE';
            case 'AsiaSouthEast': return 'ASE';
            case 'EUWest': return 'EUW';
            case 'EUWest2': return 'EUW2';
            case 'EUEast': return 'EUE';
            case 'EUNorth': return 'EUN';
            case 'EUNorth2': return 'EUN2';
            case 'EUSouth': return 'EUS';
            case 'EUSouthWest': return 'EUSW';
            default: return 'Unknown Server';
        }
    }
};
__decorate([
    plugin_module_1.HookPacket(plugin_module_1.PacketType.UPDATE)
], RealmTrack.prototype, "onUpdate", null);
RealmTrack = __decorate([
    plugin_module_1.NrPlugin({
        name: 'RealmTrack',
        author: 'Fluttar'
    })
], RealmTrack);
