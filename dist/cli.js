"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("./services");
const models_1 = require("./models");
const core_1 = require("./core");
const net = require("net");
const dns = require("dns");
const args = process.argv;
const EMAIL_REPLACE_REGEX = /.+?(.+?)(?:@|\+\d+).+?(.+?)\./;
const ACCOUNT_IN_USE_REGEX = /Account in use \((\d+) seconds? until timeout\)/;
const LOCAL_SERVER_DEFAULT_PORT = 5680;
class CLI {
    static addClient(account, charInfo) {
        return new Promise((resolve, reject) => {
            if (!account.alias) {
                const match = EMAIL_REPLACE_REGEX.exec(account.guid);
                if (match) {
                    if (match[1]) {
                        account.alias = account.guid.replace(match[1], '***');
                    }
                    if (match[2]) {
                        account.alias = account.alias.replace(match[2], '***');
                    }
                }
            }
            if (this.clients[account.alias]) {
                const err = new Error(account.alias + ' has already been added.');
                reject(err);
                return;
            }
            const handler = (info) => {
                let server;
                if (net.isIP(account.serverPref) !== 0) {
                    server = {
                        name: account.serverPref,
                        address: account.serverPref
                    };
                }
                if (!server) {
                    let keys;
                    try {
                        keys = Object.keys(this.internalServerList);
                    }
                    catch (err) {
                        keys = [];
                    }
                    if (keys.length > 0) {
                        if (!account.serverPref || account.serverPref === '') {
                            services_1.Log('NRelay', 'Preferred server not found. Choosing first server.', services_1.LogLevel.Warning);
                            server = this.internalServerList[keys[0]];
                        }
                        server = this.internalServerList[account.serverPref];
                    }
                    else {
                        reject(new Error(account.alias + ' couldn\'t get servers.'));
                        return;
                    }
                }
                const client = new core_1.Client(server, this.buildVersion, account);
                this.clients[account.alias] = client;
                resolve(client);
            };
            services_1.Log('NRelay', `Adding ${account.alias}`, services_1.LogLevel.Info);
            if (charInfo || account.charInfo) {
                if (models_1.environment.debug) {
                    services_1.Log('NRelay', `Using provided character info for ${account.alias}.`, services_1.LogLevel.Info);
                }
                if (charInfo) {
                    account.charInfo = charInfo;
                }
                handler(account);
            }
            else {
                this.getAccountInfo(account).then(handler).catch((error) => {
                    const accError = this.handleAccountInfoError(error, account);
                    if (accError) {
                        reject(accError);
                    }
                    else {
                        reject(error);
                    }
                });
            }
        });
    }
    static removeClient(alias) {
        if (this.clients[alias]) {
            this.clients[alias].destroy();
            delete this.clients[alias];
            services_1.Log('NRelay', `Removed ${alias}`, services_1.LogLevel.Info);
            return true;
        }
        return false;
    }
    static getClient(alias) {
        if (!this.clients.hasOwnProperty(alias)) {
            return null;
        }
        return this.clients[alias];
    }
    static getClients() {
        if (!this.clients) {
            return new Array(0);
        }
        return Object.keys(this.clients).map((k) => this.clients[k]);
    }
    static loadServers() {
        services_1.Log('NRelay', 'Loading server list', services_1.LogLevel.Info);
        return new Promise((resolve, reject) => {
            services_1.Http.get(models_1.SERVER_ENDPOINT).then((data) => {
                services_1.Log('NRelay', 'Server list loaded.', services_1.LogLevel.Success);
                this.internalServerList = services_1.parseServers(data);
                resolve();
            }).catch((err) => {
                services_1.Log('NRelay', `Error loading server list: ${err.message}`);
                reject(err);
            });
        });
    }
    static get serverList() {
        return this.internalServerList;
    }
    static getAccountInfo(account) {
        return new Promise((resolve, reject) => {
            const handler = (data) => {
                const info = services_1.parseAccountInfo(data);
                this.internalServerList = services_1.parseServers(data);
                if (info) {
                    account.charInfo = info;
                    resolve(account);
                }
                else {
                    reject(data);
                }
            };
            if (account.proxy) {
                if (net.isIP(account.proxy.host) === 0) {
                    services_1.Log('NRelay', 'Resolving proxy hostname.', services_1.LogLevel.Info);
                    dns.lookup(account.proxy.host, (err, address, family) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        services_1.Log('NRelay', 'Proxy hostname resolved!', services_1.LogLevel.Success);
                        account.proxy.host = address;
                        services_1.Http.proxiedGet(models_1.SERVER_ENDPOINT, account.proxy, {
                            guid: account.guid,
                            password: account.password
                        }).then(handler, reject);
                    });
                }
                else {
                    services_1.Http.proxiedGet(models_1.SERVER_ENDPOINT, account.proxy, {
                        guid: account.guid,
                        password: account.password
                    }).then(handler, reject);
                }
            }
            else {
                services_1.Http.get(models_1.SERVER_ENDPOINT, {
                    guid: account.guid,
                    password: account.password
                }).then(handler, reject);
            }
        });
    }
    static proceed() {
        const accInfo = services_1.Storage.getAccountConfig();
        if (accInfo instanceof Error) {
            services_1.Log('NRelay', 'Couldn\'t load acc-config.json.', services_1.LogLevel.Error);
            services_1.Log('NRelay', accInfo.message, services_1.LogLevel.Warning);
            return;
        }
        this.buildVersion = accInfo.buildVersion;
        if (accInfo.localServer) {
            if (accInfo.localServer.enabled) {
                services_1.LocalServer.init(accInfo.localServer.port || LOCAL_SERVER_DEFAULT_PORT);
            }
        }
        const loadResources = new Promise((resolve, reject) => {
            Promise.all([core_1.ResourceManager.loadTileInfo(), core_1.ResourceManager.loadObjects()]).then(() => {
                resolve();
            }).catch((error) => {
                services_1.Log('NRelay', 'An error occurred while loading tiles and objects.', services_1.LogLevel.Warning);
                resolve();
            });
        });
        loadResources.then(() => {
            core_1.PluginManager.loadPlugins();
        });
        for (let i = 0; i < accInfo.accounts.length; i++) {
            const acc = accInfo.accounts[i];
            setTimeout(() => {
                this.addClient(acc).then(() => {
                    services_1.Log('NRelay', `Authorized ${acc.alias}`, services_1.LogLevel.Success);
                }).catch((error) => {
                    services_1.Log('NRelay', `${acc.alias}: ${error.message}`, services_1.LogLevel.Error);
                });
            }, (i * 1000));
        }
    }
    static handleAccountInfoError(response, acc) {
        if (!response) {
            return new Error('Empty response');
        }
        const accInUse = ACCOUNT_IN_USE_REGEX.exec(response);
        if (accInUse) {
            const time = +accInUse[1] + 1;
            setTimeout(() => {
                this.addClient(acc);
            }, time * 1000);
            return new Error(`Account in use error. Reconnecting in ${time} seconds.`);
        }
        else {
            const error = services_1.parseError(response);
            return error;
        }
    }
    constructor() {
        this.updateEnvironment();
        CLI.clients = {};
        if (models_1.environment.log) {
            services_1.Storage.createLog();
        }
        if (models_1.environment.debug) {
            services_1.Log('NRelay', 'Starting in debug mode...');
        }
        else {
            services_1.Log('NRelay', 'Starting...');
        }
        if (this.hasFlag('--no-update')) {
            services_1.Log('NRelay', 'Not checking for updates.', services_1.LogLevel.Info);
            CLI.proceed();
        }
        else {
            const forceUpdate = this.hasFlag('--force-update');
            const update = (force = false) => {
                services_1.Updater.getLatest(force).then(() => {
                    process.exit(0);
                }).catch((error) => {
                    services_1.Log('NRelay', `Error while updating: ${error.message}`, services_1.LogLevel.Error);
                });
            };
            if (forceUpdate) {
                services_1.Log('NRelay', 'Forcing an update...', services_1.LogLevel.Info);
                update(true);
            }
            else {
                services_1.Log('NRelay', 'Checking for updates...', services_1.LogLevel.Info);
                services_1.Updater.checkVersion().then((needsUpdate) => {
                    if (needsUpdate) {
                        services_1.Log('NRelay', 'An update is available. Downloading...');
                        update();
                    }
                    else {
                        CLI.proceed();
                    }
                }).catch(() => {
                    services_1.Log('NRelay', 'Error while checking for update, starting anyway.', services_1.LogLevel.Info);
                    CLI.proceed();
                });
            }
        }
    }
    updateEnvironment() {
        if (this.hasFlag('--no-log')) {
            models_1.environment.log = false;
        }
        if (this.hasFlag('--debug')) {
            models_1.environment.debug = true;
        }
    }
    hasFlag(flag) {
        for (let i = 0; i < args.length; i++) {
            if (args[i] === flag) {
                return true;
            }
        }
        return false;
    }
}
exports.CLI = CLI;
