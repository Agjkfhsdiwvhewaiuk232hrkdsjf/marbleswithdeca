"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_manager_1 = require("./../core/plugin-manager");
function NrPlugin(info) {
    return (target) => {
        plugin_manager_1.PluginManager.addPlugin(info, target);
        return target;
    };
}
exports.NrPlugin = NrPlugin;
