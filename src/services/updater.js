"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const child_process_1 = require("child_process");
const https = require("https");
const fs_1 = require("fs");
const services_1 = require("./../services");
const ASSET_ENDPOINT = 'https://static.drips.pw/rotmg/production/#/';
const PACKET_REGEX = /public static const ([A-Z_]+):int = (\d+);/g;
const dir = path.dirname(require.main.filename);
class Updater {
    static checkVersion() {
        return new Promise((resolve, reject) => {
            https.get(ASSET_ENDPOINT.replace('#', 'current') + 'version.txt', (res) => {
                let raw = '';
                res.on('data', (chunk) => {
                    raw += chunk;
                });
                res.on('end', () => {
                    if (!raw) {
                        resolve(false);
                        return;
                    }
                    this.latestVersion = raw;
                    const filename = path.join(dir, 'src', 'services', 'updater-assets', 'version.txt');
                    let currentVersion = null;
                    try {
                        currentVersion = fs.readFileSync(filename, { encoding: 'utf8' });
                    }
                    catch (_a) {
                        try {
                            fs.mkdirSync(path.join(dir, 'src', 'services', 'updater-assets'));
                        }
                        catch (error) {
                            if (error.code !== 'EEXIST') {
                                reject(error);
                            }
                        }
                        fs.writeFileSync(filename, '', { encoding: 'utf8' });
                    }
                    if (currentVersion !== raw) {
                        resolve(true);
                        return;
                    }
                    resolve(false);
                });
                res.on('error', (error) => {
                    reject(error);
                });
            });
        });
    }
    static getLatest(force = false) {
        return new Promise((resolve, reject) => {
            if (!this.latestVersion && !force) {
                return this.checkVersion().then(() => {
                    reject(new Error('No local version found.'));
                }).catch((error) => {
                    services_1.Log('Updater', 'Error getting latest version', services_1.LogLevel.Error);
                    reject(error);
                });
            }
            const url = ASSET_ENDPOINT.replace('#', 'current');
            const clientPath = path.join(dir, 'src', 'services', 'updater-assets', 'client.swf');
            if (!fs.existsSync(path.join(dir, 'resources'))) {
                fs.mkdirSync(path.join(dir, 'resources'));
            }
            const groundTypesPath = path.join(dir, 'resources', 'GroundTypes.json');
            const objectsPath = path.join(dir, 'resources', 'Objects.json');
            this.emptyFile(clientPath);
            this.emptyFile(groundTypesPath);
            this.emptyFile(objectsPath);
            const clientStream = fs_1.createWriteStream(clientPath);
            const groundTypesStream = fs_1.createWriteStream(groundTypesPath);
            const objectsStream = fs_1.createWriteStream(objectsPath);
            Promise.all([
                new Promise((resolve1, reject1) => {
                    services_1.Log('Updater', 'Downloading latest client.swf', services_1.LogLevel.Info);
                    https.get(url + 'client.swf', (res) => {
                        res.on('data', (chunk) => {
                            clientStream.write(chunk);
                        });
                        res.on('end', () => {
                            services_1.Log('Updater', 'Downloaded client.swf', services_1.LogLevel.Success);
                            clientStream.end();
                            resolve1();
                        });
                        res.on('error', (error) => {
                            reject1(error);
                        });
                    });
                }),
                new Promise((resolve2, reject2) => {
                    services_1.Log('Updater', 'Downloading latest GroundTypes.json', services_1.LogLevel.Info);
                    https.get(url + 'json/GroundTypes.json', (res) => {
                        res.on('data', (chunk) => {
                            groundTypesStream.write(chunk);
                        });
                        res.on('end', () => {
                            services_1.Log('Updater', 'Downloaded GroundTypes.json', services_1.LogLevel.Success);
                            groundTypesStream.end();
                            resolve2();
                        });
                        res.on('error', (error) => {
                            reject2(error);
                        });
                    });
                }),
                new Promise((resolve3, reject3) => {
                    services_1.Log('Updater', 'Downloading latest Objects.json', services_1.LogLevel.Info);
                    https.get(url + 'json/Objects.json', (res) => {
                        res.on('data', (chunk) => {
                            objectsStream.write(chunk);
                        });
                        res.on('end', () => {
                            services_1.Log('Updater', 'Downloaded Objects.json', services_1.LogLevel.Success);
                            objectsStream.end();
                            resolve3();
                        });
                        res.on('error', (error) => {
                            reject3(error);
                        });
                    });
                })
            ]).then(() => {
                services_1.Log('Updater', 'Unpacking client.swf', services_1.LogLevel.Info);
                this.unpackSwf().then(() => {
                    services_1.Log('Updater', 'Unpacked client.swf', services_1.LogLevel.Success);
                    services_1.Log('Updater', 'Updating assets', services_1.LogLevel.Info);
                    this.updateAssets().then(() => {
                        services_1.Log('Updater', 'Finished! Rebuild the source to apply the update.', services_1.LogLevel.Success);
                        resolve();
                    }).catch((updateError) => {
                        reject(updateError);
                    });
                }).catch((error) => {
                    services_1.Log('Updater', 'Error while unpacking swf', services_1.LogLevel.Error);
                    reject(error);
                });
            }).catch((error) => {
                services_1.Log('Updater', `Error: ${error.message}`, services_1.LogLevel.Error);
                reject(error);
            });
        });
    }
    static emptyFile(filePath) {
        try {
            fs.truncateSync(filePath, 0);
        }
        catch (_a) {
            fs.writeFileSync(filePath, '', { encoding: 'utf8' });
        }
    }
    static unpackSwf() {
        return new Promise((resolve, reject) => {
            const args = [
                '-jar',
                (`"${path.join(dir, 'lib', 'jpexs', 'ffdec.jar')}"`),
                '-selectclass kabam.rotmg.messaging.impl.GameServerConnection',
                '-export script',
                (`"${path.join(dir, 'src', 'services', 'updater-assets', 'decompiled')}"`),
                (`"${path.join(dir, 'src', 'services', 'updater-assets', 'client.swf')}"`)
            ];
            child_process_1.exec(`java ${args.join(' ')}`, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
    }
    static updateAssets() {
        return new Promise((resolve, reject) => {
            let raw = null;
            try {
                raw = fs.readFileSync(path.join(dir, 'src', 'services', 'updater-assets', 'decompiled', 'scripts', 'kabam', 'rotmg', 'messaging', 'impl', 'GameServerConnection.as'), { encoding: 'utf8' });
            }
            catch (err) {
                reject(err);
                return;
            }
            const packets = {};
            let match = PACKET_REGEX.exec(raw);
            while (match != null) {
                packets[match[1].replace('_', '')] = +match[2];
                match = PACKET_REGEX.exec(raw);
            }
            this.updatePackets(packets);
            this.updateVersion();
            resolve();
        });
    }
    static updatePackets(newPackets) {
        const filePath = path.join(dir, 'src', 'networking', 'packet-type.ts');
        fs.truncateSync(filePath, 0);
        let raw = 'export enum PacketType {\n';
        const keys = Object.keys(newPackets);
        for (let i = 0; i < keys.length; i++) {
            raw += (`    ${keys[i]} = ${newPackets[keys[i]] + (i === keys.length - 1 ? '\n' : ',\n')}`);
        }
        raw += '}\n';
        fs.writeFileSync(filePath, raw, { encoding: 'utf8' });
        services_1.Log('Updater', 'Updated PacketType enum', services_1.LogLevel.Info);
    }
    static updateVersion() {
        const filePath = path.join(dir, 'src', 'services', 'updater-assets', 'version.txt');
        try {
            fs.truncateSync(filePath, 0);
        }
        catch (_a) {
        }
        fs.writeFileSync(filePath, this.latestVersion, { encoding: 'utf8' });
    }
}
exports.Updater = Updater;
