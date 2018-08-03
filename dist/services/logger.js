"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const models_1 = require("./../models");
const c = chalk.constructor();
class Logger {
}
exports.Logger = Logger;
function Log(sender, message, level = LogLevel.Message) {
    const senderString = (`[${getTime()} | ${sender}]`);
    let printString = pad(senderString, 30) + message;
    if (Logger.logStream && models_1.environment.log) {
        Logger.logStream.write(pad(LogLevel[level].toUpperCase(), 8) + printString + '\n');
    }
    switch (level) {
        case LogLevel.Info:
            printString = c.gray(printString);
            break;
        case LogLevel.Message:
            printString = (printString);
            break;
        case LogLevel.Warning:
            printString = c.yellow(printString);
            break;
        case LogLevel.Error:
            printString = c.red(printString);
            break;
        case LogLevel.Success:
            printString = c.green(printString);
            break;
        default:
            printString = message;
            break;
    }
    console.log(printString);
}
exports.Log = Log;
function getTime() {
    const now = new Date();
    return now.toTimeString().split(' ')[0];
}
function pad(str, paddingLength) {
    if (str.length > paddingLength) {
        return str;
    }
    return (str + ' '.repeat(paddingLength - str.length));
}
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Info"] = 0] = "Info";
    LogLevel[LogLevel["Message"] = 1] = "Message";
    LogLevel[LogLevel["Warning"] = 2] = "Warning";
    LogLevel[LogLevel["Error"] = 3] = "Error";
    LogLevel[LogLevel["Success"] = 4] = "Success";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
