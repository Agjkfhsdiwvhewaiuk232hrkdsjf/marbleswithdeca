"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
const fs = require("fs");
const path = require("path");
const dir = path.dirname(require.main.filename);
class Storage {
    /**
     * Gets the contents of the file at the specified filepath and returns the result as a JSON object.
     * @param filePath The path of the file to read from.
     */
    static get(...filePath) {
        return new Promise((resolve, reject) => {
            this.readText(...filePath).then((data) => {
                resolve(JSON.parse(data));
            }).catch((error) => {
                reject(error);
            });
        });
    }
    /**
     * Reads the contents of the file at the specified filepath and returns the result as plaintext.
     * @param filePath The path of the file to read from.
     */
    static readText(...filePath) {
        return new Promise((resolve, reject) => {
            const fileName = this.makePath(...filePath);
            fs.readFile(fileName, 'utf8', (error, data) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(data);
            });
        });
    }
    /**
     * Writes the `data` string to the file at the specified filepath.
     * @param data The text to write.
     * @param filePath The path of the file to write to.
     */
    static writeText(data, ...filePath) {
        return new Promise((resolve, reject) => {
            const fileName = this.makePath(...filePath);
            fs.writeFile(fileName, data, (error) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve();
                }
            });
        });
    }
    /**
     * Creates a path relative to the `nrelay/` folder.
     * @example
     * ```
     * Storage.makePath('src', 'plugins');
     * // returns C:\path\to\nrelay\src\plugins
     * ```
     * @param filePath The path to create.
     */
    static makePath(...filePath) {
        return path.resolve(__dirname, path.join(dir, ...filePath));
    }
    /**
     * Serializes the `data` object and writes the serialized string to the specified filepath.
     * @param data The data to write.
     * @param filePath The path of the file to write to.
     */
    static set(data, ...filePath) {
        return this.writeText(JSON.stringify(data), ...filePath);
    }
    /**
     * Gets the contents of the `acc-config.json` file and returns
     * it as an `IAccountInfo` object.
     */
    static getAccountConfig() {
        try {
            return require('./../../acc-config.json');
        }
        catch (err) {
            return err;
        }
    }
    /**
     * Creates a log file and sets the `Logger.logStream` property to the newly created write stream.
     */
    static createLog() {
        const logStream = fs.createWriteStream(Storage.makePath('nrelay-log.log'));
        logStream.write(`Log Start (time: ${Date.now()})\n`);
        logger_1.Logger.logStream = logStream;
    }
}
exports.Storage = Storage;
