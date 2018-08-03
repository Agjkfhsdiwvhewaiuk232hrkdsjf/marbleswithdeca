"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("./../networking/packet");
const services_1 = require("./../services");
const models_1 = require("./../models");
const fs = require("fs");
const PLUGIN_REGEX = /^.+\.js$/;
class PluginManager {
    static loadPlugins() {
        this.pluginInfo = [];
        this.pluginInstances = {};
        const folderPath = services_1.Storage.makePath('dist', 'plugins');
        let files = [];
        try {
            files = fs.readdirSync(folderPath);
        }
        catch (_a) {
            services_1.Log('PluginManager', 'Couldn\'t find plugins directory', services_1.LogLevel.Warning);
        }
        for (let i = 0; i < files.length; i++) {
            try {
                const relPath = services_1.Storage.makePath('dist', 'plugins', files[i]);
                if (!PLUGIN_REGEX.test(relPath)) {
                    if (models_1.environment.debug) {
                        services_1.Log('PluginManager', `Skipping ${relPath}`, services_1.LogLevel.Info);
                    }
                    continue;
                }
                const pluginClass = require(relPath).default;
            }
            catch (err) {
                services_1.Log('PluginManager', `Error while loading ${files[i]}`, services_1.LogLevel.Warning);
                if (models_1.environment.debug) {
                    services_1.Log('PluginManager', err);
                }
            }
        }
        if (this.afterInitFunctions && this.afterInitFunctions.length > 0) {
            for (let i = 0; i < this.afterInitFunctions.length; i++) {
                this.afterInitFunctions[i]();
            }
            this.afterInitFunctions = null;
        }
    }
    static addHook(packetType, action, target) {
        if (target === 'Client') {
            if (!this.clientHooks) {
                this.clientHooks = {};
            }
            if (!this.clientHooks.hasOwnProperty(packetType)) {
                this.clientHooks[packetType] = [];
            }
            this.clientHooks[packetType].push({
                action: action
            });
        }
        else {
            if (!this.hooks) {
                this.hooks = {};
            }
            if (!this.hooks.hasOwnProperty(packetType)) {
                this.hooks[packetType] = [];
            }
            this.hooks[packetType].push({
                action: action,
                caller: target
            });
        }
    }
    static addPlugin(info, target) {
        // if the plugin is disabled, don't load it.
        if (info.hasOwnProperty('enabled')) {
            if (!info.enabled) {
                if (models_1.environment.debug) {
                    services_1.Log('PluginManager', `Skipping disabled plugin ${info.name}`, services_1.LogLevel.Info);
                }
                // remove hooks
                const hKeys = Object.keys(this.hooks);
                for (let i = 0; i < hKeys.length; i++) {
                    this.hooks[+hKeys[i]] = this.hooks[+hKeys[i]].filter((hook) => {
                        return hook.caller !== target.name;
                    });
                }
                return;
            }
        }
        let plugin;
        try {
            plugin = new target();
        }
        catch (error) {
            services_1.Log('PluginManager', `Error while instantiating ${target.name}`, services_1.LogLevel.Warning);
            if (models_1.environment.debug) {
                services_1.Log('PluginManager', error);
            }
            return;
        }
        if (this.pluginInstances.hasOwnProperty(target.name)) {
            services_1.Log('PluginManager', `Cannot load ${target.name} because a plugin with the same name already exists.`, services_1.LogLevel.Error);
        }
        else {
            this.pluginInstances[target.name] = plugin;
            this.pluginInfo.push(info);
            services_1.Log('PluginManager', `Loaded ${info.name} by ${info.author}`, services_1.LogLevel.Info);
        }
    }
    static getInstanceOf(instance) {
        if (!this.pluginInstances.hasOwnProperty(instance.name)) {
            return null;
        }
        return this.pluginInstances[instance.name];
    }
    static afterInit(method) {
        if (!this.afterInitFunctions) {
            this.afterInitFunctions = [];
        }
        this.afterInitFunctions.push(method);
    }
    static callHooks(packetType, packet, client) {
        if (this.hooks && this.hooks[packetType]) {
            for (let i = 0; i < this.hooks[packetType].length; i++) {
                const hook = this.hooks[packetType][i];
                try {
                    const caller = this.pluginInstances[hook.caller];
                    hook.action.apply(caller, [client, packet]);
                }
                catch (error) {
                    services_1.Log('PluginManager', `Error while calling ${packet_1.PacketType[packetType]} hook on ${hook.caller}`, services_1.LogLevel.Warning);
                    services_1.Log('PluginManager', error, services_1.LogLevel.Info);
                }
            }
        }
        if (!packet.send) {
            return;
        }
        if (this.clientHooks && this.clientHooks[packetType]) {
            for (let i = 0; i < this.clientHooks[packetType].length; i++) {
                const hook = this.clientHooks[packetType][i];
                try {
                    hook.action.apply(client, [client, packet]);
                }
                catch (error) {
                    services_1.Log('PluginManager', `Error while calling ${packet_1.PacketType[packetType]} hook on client.`, services_1.LogLevel.Warning);
                    services_1.Log('PluginManager', error, services_1.LogLevel.Info);
                }
            }
        }
    }
}
exports.PluginManager = PluginManager;
