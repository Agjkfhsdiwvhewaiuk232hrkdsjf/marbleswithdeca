"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ConditionEffects {
    static has(condition, effect) {
        // tslint:disable no-bitwise
        const effectBit = 1 << effect - 1;
        return (condition & effectBit) === 1;
        // tslint:enable no-bitwise
    }
}
exports.ConditionEffects = ConditionEffects;
var ConditionEffect;
(function (ConditionEffect) {
    ConditionEffect[ConditionEffect["NOTHING"] = 0] = "NOTHING";
    ConditionEffect[ConditionEffect["DEAD"] = 1] = "DEAD";
    ConditionEffect[ConditionEffect["QUIET"] = 2] = "QUIET";
    ConditionEffect[ConditionEffect["WEAK"] = 3] = "WEAK";
    ConditionEffect[ConditionEffect["SLOWED"] = 4] = "SLOWED";
    ConditionEffect[ConditionEffect["SICK"] = 5] = "SICK";
    ConditionEffect[ConditionEffect["DAZED"] = 6] = "DAZED";
    ConditionEffect[ConditionEffect["STUNNED"] = 7] = "STUNNED";
    ConditionEffect[ConditionEffect["BLIND"] = 8] = "BLIND";
    ConditionEffect[ConditionEffect["HALLUCINATING"] = 9] = "HALLUCINATING";
    ConditionEffect[ConditionEffect["DRUNK"] = 10] = "DRUNK";
    ConditionEffect[ConditionEffect["CONFUSED"] = 11] = "CONFUSED";
    ConditionEffect[ConditionEffect["STUN_IMMUNE"] = 12] = "STUN_IMMUNE";
    ConditionEffect[ConditionEffect["INVISIBLE"] = 13] = "INVISIBLE";
    ConditionEffect[ConditionEffect["PARALYZED"] = 14] = "PARALYZED";
    ConditionEffect[ConditionEffect["SPEEDY"] = 15] = "SPEEDY";
    ConditionEffect[ConditionEffect["BLEEDING"] = 16] = "BLEEDING";
    ConditionEffect[ConditionEffect["NOT_USED"] = 17] = "NOT_USED";
    ConditionEffect[ConditionEffect["HEALING"] = 18] = "HEALING";
    ConditionEffect[ConditionEffect["DAMAGING"] = 19] = "DAMAGING";
    ConditionEffect[ConditionEffect["BERSERK"] = 20] = "BERSERK";
    ConditionEffect[ConditionEffect["PAUSED"] = 21] = "PAUSED";
    ConditionEffect[ConditionEffect["STASIS"] = 22] = "STASIS";
    ConditionEffect[ConditionEffect["STASIS_IMMUNE"] = 23] = "STASIS_IMMUNE";
    ConditionEffect[ConditionEffect["INVINCIBLE"] = 24] = "INVINCIBLE";
    ConditionEffect[ConditionEffect["INVULNERABLE"] = 25] = "INVULNERABLE";
    ConditionEffect[ConditionEffect["ARMORED"] = 26] = "ARMORED";
    ConditionEffect[ConditionEffect["ARMORBROKEN"] = 27] = "ARMORBROKEN";
    ConditionEffect[ConditionEffect["HEXED"] = 28] = "HEXED";
    ConditionEffect[ConditionEffect["NINJA_SPEEDY"] = 29] = "NINJA_SPEEDY";
})(ConditionEffect = exports.ConditionEffect || (exports.ConditionEffect = {}));
