import { NrPlugin, HookPacket, Client, Log, LogLevel, PacketType, PluginManager } from './../core/plugin-module';
import { UpdatePacket } from './../networking/packets/incoming/update-packet';
import { TextPacket } from '../networking/packets/incoming/text-packet';
import { ObjectStatusData } from './../networking/data/object-status-data';
import { IPlayerData, getDefaultPlayerData } from './../models/playerdata';
import { ResourceManager } from './../core/resource-manager';
import { PlayerTracker } from './player-tracker';
import { HelloPacket } from '../networking/packets/outgoing/hello-packet';
import { IPoint } from '../services/pathfinding/point';
import { IHeapItem } from '../services/pathfinding/heap-item';
import Discord = require('discord.js');

const fs = require("fs");

var config = JSON.parse(fs.readFileSync("./realmtrack-config.json"));
var realmPosList: string[][] = new Array();

interface Item {
    item: string;
    num: number;
    event: boolean;
}

interface Portal {
    x: number;
    y: number;
    name: string;
}

@NrPlugin({
    name: 'RealmTrack',
    author: 'Fluttar'
})

class RealmTrack {
    private bot: Discord.Client;
    private ready = false;

    private playerTracker: PlayerTracker;
    constructor() {
        this.bot = new Discord.Client();
        this.bot.login(process.env.token);
        this.bot.once('ready', () => this.ready = true);
        Client.on('connect', (pd, client: Client) => {
            this.loop(client, true);
        });
        process.on('uncaughtException', function (exception) {
            Log(exception.name, exception.message);
        });
        process.on('unhandledRejection', (reason, p) => {
            Log('Unhandled Rejection', 'at: ' + p + ' reason: ' + reason);
        });
        PluginManager.afterInit(() => {
            let portalList: Portal[] = new Array();
            this.playerTracker = PluginManager.getInstanceOf(PlayerTracker);
            this.playerTracker.trackAllPlayers();
            this.playerTracker.on('leave', player => {
                if (config.blacklistedMembers.find((name: any) => name == player.name) != null) return;
                if (config.blacklistedGuilds.find((name: any) => name == player.guildName) != null) return;

                let bazSide: number = -1;
                let shortServer: string = this.getSrv(player.server);
                let trackedPlayer: any = config.list.find((x: any) => x.name == player.name);

                let items: string = this.getItemsOf(player.inventory);

                let px: number = player.worldPos.x;
                let py: number = player.worldPos.y;

                /* ------------------ BAZAAR ------------------ */
                if (py < 135 && py > 131) {
                    if (px < 142 && px > 138) bazSide = 0;
                    if (px < 180 && px > 176) bazSide = 1;
                } else if (py < 139 && py > 127) {
                    if (px < 148 && px > 138) bazSide = 2;
                    if (px < 180 && px > 170) bazSide = 3;
                }

                let side: string = '';

                switch (bazSide) {
                    case 0: side = 'Left'; break;
                    case 1: side = 'Right'; break;
                    case 2: side = 'close to Left'; break;
                    case 3: side = 'close to Right'; break;
                }

                if (side != '') {
                    let roleString: string = '';
                    if (items != '') {
                        if (trackedPlayer == null) {
                            config.list.push({ name: player.name, type: 'Temporarily tracked' });
                            setTimeout(() => {
                                config.list.splice(config.list.indexOf(config.list
                                    .find((name: any) => name == player.name)), 1);
                            }, 90000);
                        }
                        (this.bot.channels.get('472323417421643777') as Discord.TextChannel)
                        .send(player.name + ' - ' + side + ' Bazaar - ' + items + ' - ' + shortServer);
                    } else if (trackedPlayer != null) {
                        (this.bot.channels.get('472323417421643777') as Discord.TextChannel)
                        .send(player.name + ' - ' + side + ' Bazaar - ' + shortServer);
                    }
                    items = null;
                    trackedPlayer = null;
                }
                bazSide = null;
                side = null;
                /* ------------------ BAZAAR ------------------ */

                /* ------------------ MISC LOCATIONS ------------------ */
                let locName: string = '';

                if (locName == '') {
                    if (py > 134 && py < 137) {
                        if (px > 161 && px < 164) locName = 'Vault';
                        if (px > 154 && px < 157) locName = 'Guild Hall';
                    }
                    if (px > 161 && px < 164 && py > 129 && py < 131) locName = 'Pet Yard';
                    if (px > 164 && px < 167 && py > 118 && py < 121) locName = 'Daily Quest Room';
                    if (px > 131 && px < 134 && py > 99 && py < 101) locName = 'the Arena';
                }

                if (locName != '' && trackedPlayer != null) {
                    (this.bot.channels.get('472323417421643777') as Discord.TextChannel)
                    .send(player.name + ' - ' + locName + ' - ' +  shortServer);
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
                        (this.bot.channels.get('472323417421643777') as Discord.TextChannel)
                        .send(player.name + ' - ' + portal.name + ' - ' + items + ' - ' +  shortServer);
                        items = null;
                        trackedPlayer = null;
                    }
                    portal = null;
                } else if (trackedPlayer != null) {
                    let portal = portalList.find(portal => px > portal.x - 2
                        && px < portal.x + 2
                        && py > portal.y - 2
                        && py < portal.y + 2);
                    if (portal != null) {
                        (this.bot.channels.get('472323417421643777') as Discord.TextChannel)
                        .send(player.name + ' - ' + portal.name + ' - ' +  shortServer);
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
                        (this.bot.channels.get('472323417421643777') as Discord.TextChannel)
                        .send(player.name + ' - ' + realmPos[2] + ' - ' + items + ' - ' +  shortServer);
                        realmPos = null;
                        trackedPlayer = null;
                    }
                    realmPos = null;
                } else if (player.currentFame >= 10000) {
                    let realmPos = realmPosList.find(x => px > +x[0] - 2
                        && px < +x[0] + 2
                        && py > +x[1] - 2
                        && py < +x[1] + 2
                        && shortServer == x[3]);
                    if (realmPos != null) {
                        (this.bot.channels.get('472323417421643777') as Discord.TextChannel)
                        .send(player.name + ' (' + Math.round(player.currentFame / 1000 * 10) / 10 + 'k BF)' + ' - ' + realmPos[2] + ' - ' +  shortServer);
                        realmPos = null;
                        trackedPlayer = null;
                    }
                    realmPos = null;
                } else if (trackedPlayer != null) {
                    let realmPos = realmPosList.find(x => px > +x[0] - 2
                        && px < +x[0] + 2
                        && py > +x[1] - 2
                        && py < +x[1] + 2
                        && shortServer == x[3]);
                    if (realmPos != null) {
                        (this.bot.channels.get('472323417421643777') as Discord.TextChannel)
                        .send(player.name + ' - ' + realmPos[2] + ' - ' +  shortServer);
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
                if (config.blacklistedMembers.find((name: any) => name == player.name) != null) return;
                if (config.blacklistedGuilds.find((name: any) => name == player.guildName) != null) return;

                let lhCount: number = 0;
                let vialCount: number = 0;
                let items = this.getItemsOf(player.inventory, [{ num: 583, item: 'Vial of Pure Darkness', event: false },
                                                                     { num: 2991, item: 'Lost Halls Key', event: false }]);
                if (items != '') {
                    (this.bot.channels.get('472323417421643777') as Discord.TextChannel)
                    .send(player.name + ' - ' + items + ' - ' +  this.getSrv(player.server));
                    items = null;
                    return;
                }
                items = null;
                let trackedPlayer = config.list.find((x: any) => x.name == player.name);
                if (trackedPlayer != null) {
                    let type: String = (trackedPlayer.type == ' ' ?
                        '' : trackedPlayer.type);
                        (this.bot.channels.get('472323417421643777') as Discord.TextChannel)
                        .send(player.name + ' - ' + type + ' - ' +  this.getSrv(player.server))
                    type = null;
                }
                trackedPlayer = null;
            });
            this.playerTracker.on('pop', keyPop => {
                if (portalList == null) portalList = new Array();
                Log('RealmTrack', this.getSrv(keyPop[0].server) + ' - ' + keyPop[1]);
                let portal: Portal = {
                    x: keyPop[0].worldPos.x,
                    y: keyPop[0].worldPos.y,
                    name: keyPop[1]
                };
                portalList.push(portal);
                portal = null;
            });
        });
    }

    @HookPacket(PacketType.UPDATE)
    private onUpdate(client: Client, update: UpdatePacket): void {
        let obj = update.newObjects.find(x => x.objectType == 1810);
        if (obj != null) {
            let objData = ObjectStatusData.processObject(obj);
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

    private loop(cli: Client, initial: Boolean): void {
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

    private getItemsOf(playerInv: number[], trackList?: Item[], isRealm: Boolean = false): string {
        if (playerInv == null) {
            Log('RealmTrack', 'Null player inventory passed in getItemsOf().', LogLevel.Error);
            return;
        }

        let itemList: Item[] = new Array();
        let pingList = new Array();
        let itemString: string = '';

        let count: number = 0;

        if (trackList == null) {
            for (let i = 0; i < config.trackedItems.length; i++)
                for (let k = 0; k < playerInv.length; k++) {
                    if (playerInv[k] == config.trackedItems[i].id) count++;
                    if (k == playerInv.length - 1)
                        if (count != 0) {
                            let item: Item = { item: config.trackedItems[i].name, num: count, event: 
                                (config.trackedItems[i].event == null ? false : config.trackedItems[i].event) };
                            itemList.push(item);
                            item = null;
                            count = 0;
                        }
                }
        } else {
            for (let i = 0; i < trackList.length; i++)
                for (let k = 0; k < playerInv.length; k++) {
                    if (playerInv[k] == trackList[i].num) count++;
                    if (k == playerInv.length - 1)
                        if (count != 0) {
                            let item: Item = { item: trackList[i].item, num: count, event: trackList[i].event };
                            itemList.push(item);
                            item = null;
                            count = 0;
                        }
                }
        }

        count = null;

        if (itemList.length > 0) {
            let keyAmount: number = 0;
            for (let i = 0; i < itemList.length; i++) {
                if (itemList[i].num == 0 || itemList[i].item == '') continue;

                keyAmount += itemList[i].num;

                let baseString = itemList[i].num + 'x ' + itemList[i].item;
                if (itemString == '') itemString = baseString;
                else itemString += ', ' + baseString;

                baseString = null;
            }

            itemList = null;
            keyAmount = null;
            return itemString;
        } else {
            itemList = null;
            itemString = null;
            return '';
        }
    }

    private print(consoleStr: string, server: string): void {
        if (consoleStr != '') Log('RealmTrack', server + ' - ' + consoleStr);
        else Log('RealmTrack', 'Empty console string passed in print().', LogLevel.Warning);
    }

    private getSrv(str: string): string {
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
}