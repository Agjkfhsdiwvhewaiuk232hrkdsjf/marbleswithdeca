"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StatData {
    constructor() {
        this.statType = 0;
    }
    read(packet) {
        this.statType = packet.readUnsignedByte();
        if (this.isStringStat()) {
            this.stringStatValue = packet.readString();
        }
        else {
            this.statValue = packet.readInt32();
        }
    }
    write(packet) {
        packet.writeByte(this.statType);
        if (this.isStringStat()) {
            packet.writeString(this.stringStatValue);
        }
        else {
            packet.writeInt32(this.statValue);
        }
    }
    isStringStat() {
        switch (this.statType) {
            case StatData.NAME_STAT:
            case StatData.GUILD_NAME_STAT:
            case StatData.PET_NAME_STAT:
            case StatData.ACCOUNT_ID_STAT:
            case StatData.OWNER_ACCOUNT_ID_STAT:
                return true;
            default:
                return false;
        }
    }
}
StatData.MAX_HP_STAT = 0;
StatData.HP_STAT = 1;
StatData.SIZE_STAT = 2;
StatData.MAX_MP_STAT = 3;
StatData.MP_STAT = 4;
StatData.NEXT_LEVEL_EXP_STAT = 5;
StatData.EXP_STAT = 6;
StatData.LEVEL_STAT = 7;
StatData.ATTACK_STAT = 20;
StatData.DEFENSE_STAT = 21;
StatData.SPEED_STAT = 22;
StatData.INVENTORY_0_STAT = 8;
StatData.INVENTORY_1_STAT = 9;
StatData.INVENTORY_2_STAT = 10;
StatData.INVENTORY_3_STAT = 11;
StatData.INVENTORY_4_STAT = 12;
StatData.INVENTORY_5_STAT = 13;
StatData.INVENTORY_6_STAT = 14;
StatData.INVENTORY_7_STAT = 15;
StatData.INVENTORY_8_STAT = 16;
StatData.INVENTORY_9_STAT = 17;
StatData.INVENTORY_10_STAT = 18;
StatData.INVENTORY_11_STAT = 19;
StatData.VITALITY_STAT = 26;
StatData.WISDOM_STAT = 27;
StatData.DEXTERITY_STAT = 28;
StatData.CONDITION_STAT = 29;
StatData.NUM_STARS_STAT = 30;
StatData.NAME_STAT = 31;
StatData.TEX1_STAT = 32;
StatData.TEX2_STAT = 33;
StatData.MERCHANDISE_TYPE_STAT = 34;
StatData.CREDITS_STAT = 35;
StatData.MERCHANDISE_PRICE_STAT = 36;
StatData.ACTIVE_STAT = 37;
StatData.ACCOUNT_ID_STAT = 38;
StatData.FAME_STAT = 39;
StatData.MERCHANDISE_CURRENCY_STAT = 40;
StatData.CONNECT_STAT = 41;
StatData.MERCHANDISE_COUNT_STAT = 42;
StatData.MERCHANDISE_MINS_LEFT_STAT = 43;
StatData.MERCHANDISE_DISCOUNT_STAT = 44;
StatData.MERCHANDISE_RANK_REQ_STAT = 45;
StatData.MAX_HP_BOOST_STAT = 46;
StatData.MAX_MP_BOOST_STAT = 47;
StatData.ATTACK_BOOST_STAT = 48;
StatData.DEFENSE_BOOST_STAT = 49;
StatData.SPEED_BOOST_STAT = 50;
StatData.VITALITY_BOOST_STAT = 51;
StatData.WISDOM_BOOST_STAT = 52;
StatData.DEXTERITY_BOOST_STAT = 53;
StatData.OWNER_ACCOUNT_ID_STAT = 54;
StatData.RANK_REQUIRED_STAT = 55;
StatData.NAME_CHOSEN_STAT = 56;
StatData.CURR_FAME_STAT = 57;
StatData.NEXT_CLASS_QUEST_FAME_STAT = 58;
StatData.LEGENDARY_RANK_STAT = 59;
StatData.SINK_LEVEL_STAT = 60;
StatData.ALT_TEXTURE_STAT = 61;
StatData.GUILD_NAME_STAT = 62;
StatData.GUILD_RANK_STAT = 63;
StatData.BREATH_STAT = 64;
StatData.XP_BOOSTED_STAT = 65;
StatData.XP_TIMER_STAT = 66;
StatData.LD_TIMER_STAT = 67;
StatData.LT_TIMER_STAT = 68;
StatData.HEALTH_POTION_STACK_STAT = 69;
StatData.MAGIC_POTION_STACK_STAT = 70;
StatData.BACKPACK_0_STAT = 71;
StatData.BACKPACK_1_STAT = 72;
StatData.BACKPACK_2_STAT = 73;
StatData.BACKPACK_3_STAT = 74;
StatData.BACKPACK_4_STAT = 75;
StatData.BACKPACK_5_STAT = 76;
StatData.BACKPACK_6_STAT = 77;
StatData.BACKPACK_7_STAT = 78;
StatData.HASBACKPACK_STAT = 79;
StatData.TEXTURE_STAT = 80;
StatData.PET_INSTANCEID_STAT = 81;
StatData.PET_NAME_STAT = 82;
StatData.PET_TYPE_STAT = 83;
StatData.PET_RARITY_STAT = 84;
StatData.PET_MAXABILITYPOWER_STAT = 85;
StatData.PET_FAMILY_STAT = 86;
StatData.PET_FIRSTABILITY_POINT_STAT = 87;
StatData.PET_SECONDABILITY_POINT_STAT = 88;
StatData.PET_THIRDABILITY_POINT_STAT = 89;
StatData.PET_FIRSTABILITY_POWER_STAT = 90;
StatData.PET_SECONDABILITY_POWER_STAT = 91;
StatData.PET_THIRDABILITY_POWER_STAT = 92;
StatData.PET_FIRSTABILITY_TYPE_STAT = 93;
StatData.PET_SECONDABILITY_TYPE_STAT = 94;
StatData.PET_THIRDABILITY_TYPE_STAT = 95;
StatData.NEW_CON_STAT = 96;
StatData.FORTUNE_TOKEN_STAT = 97;
exports.StatData = StatData;
