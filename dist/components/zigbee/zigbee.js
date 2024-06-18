"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZigbeeComponent = void 0;
const topics_1 = require("../../topics");
//import { TelegramClient } from "../telegram"
const router_1 = require("../../router");
const component_1 = require("../component");
class ZigbeeComponent extends component_1.Component {
    topic;
    linkquality = 0;
    name;
    constructor(name) {
        super();
        this.name = name;
        this.topic = topics_1.ZIGBEE2MQTT_TOPIC + name;
        router_1.router.addAutomation({
            trigger: { topic: this.topic, payload: "*" },
            callback: (message) => { this.updateComponent(JSON.parse(message.payload)); }
        });
    }
    updateComponent(message) {
        this.linkquality = message["linkquality"];
    }
}
exports.ZigbeeComponent = ZigbeeComponent;
