"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const mqtt_1 = __importDefault(require("mqtt"));
const topic = __importStar(require("./topics"));
const router_1 = require("./router");
const MQTT_SERVER = process.env.MQTT_SERVER;
if (MQTT_SERVER === undefined) {
    throw new Error("[!] Missing MQTT_SERVER");
}
else {
    MQTT_SERVER;
}
exports.client = mqtt_1.default.connect("mqtt://" + MQTT_SERVER, {
    will: { topic: topic.STATUS_TOPIC, payload: Buffer.from("offline"), retain: true }
});
exports.client.on("connect", () => {
    exports.client.subscribe(topic.ZIGBEE2MQTT_TOPIC + "#", (err) => {
        if (!err) {
            exports.client.publish(topic.STATUS_TOPIC, "online");
        }
    });
    exports.client.subscribe(topic.ESPHOME_TOPIC + "#");
});
exports.client.on("message", (topic, message) => {
    router_1.router.route(topic, message.toString());
});
