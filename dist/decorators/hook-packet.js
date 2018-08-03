"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_manager_1 = require("./../core/plugin-manager");
function HookPacket(type) {
    return (target, propertyKey, descriptor) => {
        const originalMethod = descriptor.value;
        plugin_manager_1.PluginManager.addHook(type, originalMethod, target.constructor.name);
    };
}
exports.HookPacket = HookPacket;
