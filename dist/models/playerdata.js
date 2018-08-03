"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("./classes");
const guildrank_1 = require("./guildrank");
function getDefaultPlayerData() {
    return {
        objectId: 0,
        worldPos: null,
        name: null,
        level: 0,
        exp: 0,
        currentFame: 0,
        stars: 0,
        accountId: null,
        accountFame: 0,
        gold: 0,
        class: classes_1.Classes.Wizard,
        nameChosen: false,
        guildName: null,
        guildRank: guildrank_1.GuildRank.NoRank,
        maxHP: 0,
        maxMP: 0,
        hp: 0,
        mp: 0,
        atk: 0,
        def: 0,
        spd: 0,
        dex: 0,
        wis: 0,
        vit: 0,
        condition: 0,
        hpPots: 0,
        mpPots: 0,
        hasBackpack: false,
        inventory: new Array(20).fill(-1),
        server: null
    };
}
exports.getDefaultPlayerData = getDefaultPlayerData;
