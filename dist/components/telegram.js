"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramClient = void 0;
const mqtt_1 = __importDefault(require("mqtt"));
class TelegramClient {
    constructor(server) {
        var MQTT_SERVER;
        if (typeof server !== "undefined") {
            MQTT_SERVER = server;
        }
        else {
            MQTT_SERVER = process.env.MQTT_SERVER;
            if (MQTT_SERVER === undefined) {
                throw new Error("[!] Telegram integration Missing MQTT_SERVER");
            }
        }
        MQTT_SERVER;
        this.client = mqtt_1.default.connect("mqtt://" + MQTT_SERVER);
    }
    send(message) {
        this.client.publish("notify/telegram", message);
    }
}
exports.TelegramClient = TelegramClient;
