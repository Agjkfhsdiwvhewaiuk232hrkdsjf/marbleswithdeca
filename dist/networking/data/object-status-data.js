"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const world_pos_data_1 = require("./world-pos-data");
const stat_data_1 = require("./stat-data");
const playerdata_1 = require("./../../models/playerdata");
class ObjectStatusData {
    static processObject(data) {
        const playerData = this.processObjectStatus(data.status);
        playerData.class = data.objectType;
        return playerData;
    }
    static processObjectStatus(data, currentData) {
        const playerData = this.processStatData(data.stats, currentData);
        playerData.worldPos = data.pos;
        playerData.objectId = data.objectId;
        return playerData;
    }
    static processStatData(data, currentData) {
        const playerData = currentData || playerdata_1.getDefaultPlayerData();
        for (let i = 0; i < data.length; i++) {
            switch (data[i].statType) {
                case stat_data_1.StatData.NAME_STAT:
                    playerData.name = data[i].stringStatValue;
                    continue;
                case stat_data_1.StatData.LEVEL_STAT:
                    playerData.level = data[i].statValue;
                    continue;
                case stat_data_1.StatData.EXP_STAT:
                    playerData.exp = data[i].statValue;
                    continue;
                case stat_data_1.StatData.CURR_FAME_STAT:
                    playerData.currentFame = data[i].statValue;
                    continue;
                case stat_data_1.StatData.NUM_STARS_STAT:
                    playerData.stars = data[i].statValue;
                    continue;
                case stat_data_1.StatData.ACCOUNT_ID_STAT:
                    playerData.accountId = data[i].stringStatValue;
                    continue;
                case stat_data_1.StatData.FAME_STAT:
                    playerData.accountFame = data[i].statValue;
                    continue;
                case stat_data_1.StatData.CREDITS_STAT:
                    playerData.gold = data[i].statValue;
                    continue;
                case stat_data_1.StatData.MAX_HP_STAT:
                    playerData.maxHP = data[i].statValue;
                    continue;
                case stat_data_1.StatData.MAX_MP_STAT:
                    playerData.maxMP = data[i].statValue;
                    continue;
                case stat_data_1.StatData.HP_STAT:
                    playerData.hp = data[i].statValue;
                    continue;
                case stat_data_1.StatData.MP_STAT:
                    playerData.mp = data[i].statValue;
                    continue;
                case stat_data_1.StatData.ATTACK_STAT:
                    playerData.atk = data[i].statValue;
                    continue;
                case stat_data_1.StatData.DEFENSE_STAT:
                    playerData.def = data[i].statValue;
                    continue;
                case stat_data_1.StatData.SPEED_STAT:
                    playerData.spd = data[i].statValue;
                    continue;
                case stat_data_1.StatData.DEXTERITY_STAT:
                    playerData.dex = data[i].statValue;
                    continue;
                case stat_data_1.StatData.VITALITY_STAT:
                    playerData.vit = data[i].statValue;
                    continue;
                case stat_data_1.StatData.CONDITION_STAT:
                    playerData.condition = data[i].statValue;
                    continue;
                case stat_data_1.StatData.WISDOM_STAT:
                    playerData.wis = data[i].statValue;
                    continue;
                case stat_data_1.StatData.HEALTH_POTION_STACK_STAT:
                    playerData.hpPots = data[i].statValue;
                    continue;
                case stat_data_1.StatData.MAGIC_POTION_STACK_STAT:
                    playerData.mpPots = data[i].statValue;
                    continue;
                case stat_data_1.StatData.HASBACKPACK_STAT:
                    playerData.hasBackpack = data[i].statValue === 1;
                    continue;
                case stat_data_1.StatData.NAME_CHOSEN_STAT:
                    playerData.nameChosen = data[i].statValue !== 0;
                    continue;
                case stat_data_1.StatData.GUILD_NAME_STAT:
                    playerData.guildName = data[i].stringStatValue;
                    continue;
                case stat_data_1.StatData.GUILD_RANK_STAT:
                    playerData.guildRank = data[i].statValue;
                    continue;
                default:
                    if (data[i].statType >= stat_data_1.StatData.INVENTORY_0_STAT && data[i].statType <= stat_data_1.StatData.INVENTORY_11_STAT) {
                        playerData.inventory[data[i].statType - 8] = data[i].statValue;
                    }
                    else if (data[i].statType >= stat_data_1.StatData.BACKPACK_0_STAT && data[i].statType <= stat_data_1.StatData.BACKPACK_7_STAT) {
                        playerData.inventory[data[i].statType - 59] = data[i].statValue;
                    }
            }
        }
        return playerData;
    }
    read(packet) {
        this.objectId = packet.readInt32();
        this.pos = new world_pos_data_1.WorldPosData();
        this.pos.read(packet);
        const statLen = packet.readShort();
        this.stats = new Array(statLen);
        for (let i = 0; i < statLen; i++) {
            const sd = new stat_data_1.StatData();
            sd.read(packet);
            this.stats[i] = sd;
        }
    }
    write(packet) {
        packet.writeInt32(this.objectId);
        this.pos.write(packet);
        packet.writeShort(this.stats.length);
        for (let i = 0; i < this.stats.length; i++) {
            this.stats[i].write(packet);
        }
    }
}
exports.ObjectStatusData = ObjectStatusData;
