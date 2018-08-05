import { Log, LogLevel, NrPlugin, HookPacket, Packet, PacketType, Client, PluginManager } from './../core';
import { TextPacket } from './../networking/packets/incoming/text-packet';
import { IServer } from './../models/server';
import Discord = require('discord.js');
const bot = new Discord.Client();
const PORTAL_REGEX = /^{"key":"server.dungeon_opened_by","tokens":{"dungeon":"(\S.*)", "name":"(\w+)"}}$/;
const embed = new Discord.RichEmbed()
@NrPlugin({
    name: 'Key Notifier',
    author: 'Lolization',
    enabled: true
})
class KeyNotifier {
    private bot: Discord.Client;
    private ready = false;

    constructor() {
        this.bot = new Discord.Client();
        this.bot.login(process.env.token);
        this.bot.once('ready', () => this.ready = true);
    }

    @HookPacket(PacketType.TEXT)
    onText(client: Client, textPacket: TextPacket): void {
        const match = PORTAL_REGEX.exec(textPacket.text);

        if (match) {
            // the text contains the JSON payload.
            const portalType = match[1];
            const opener = match[2];
            this.callDungeon(portalType, opener, client.server);
        }
    }

    callDungeon(name: string, opener: string, server: IServer): void {
        if (!this.ready) {
            return;
        }
        let ping = bot.guilds.get("472322827530403841").roles.find("name", name);  
        console.log(name);
        console.log(ping.id);    
        (this.bot.channels.get("472323387851669519") as Discord.TextChannel)
        .send( "<@&" + ping.id + ">", {      
            "embed": {
              "title": (`${name}`),
              "description": (`**${server.name}**`),
              "color": 65535,
              "footer": {
              }
            }
          })
        .then((msg: Discord.Message) => {
            setTimeout(() => {
                msg.delete();
            }, 30000);
        })
        .catch((error: Error) => {
            Log('Key Notifier', 'An error occurred while sending the message to discord.', LogLevel.Warning);
            Log('Discord Error', error.message, LogLevel.Error);
        });
    }
}
