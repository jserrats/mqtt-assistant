"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwitchESPHome = void 0;
const esphome_1 = require("./esphome");
const router_1 = require("../../router");
class SwitchESPHome extends esphome_1.ESPHomeComponent {
    sensorTopic;
    commandTopic;
    state = false;
    updater;
    trigger = {
        on: { topic: "", payload: "ON" },
        off: { topic: "", payload: "OFF" }
    };
    constructor(name, component) {
        super(name);
        this.sensorTopic = this.topic + "/switch/" + component + "/state";
        this.commandTopic = this.topic + "/switch/" + component + "/command";
        this.trigger.off.topic = this.sensorTopic;
        this.trigger.on.topic = this.sensorTopic;
        this.updater = {
            trigger: { topic: this.topic, payload: "*" }, callback: (message) => {
                this.updateComponent(message);
            }
        };
        router_1.router.addAutomation(this.updater);
    }
    on() {
        this.set(true);
    }
    off() {
        this.set(false);
    }
    set(status) {
        this.client.publish(this.commandTopic, status ? "ON" : "OFF");
    }
    updateComponent(message) {
        this.state = (message == "ON");
    }
}
exports.SwitchESPHome = SwitchESPHome;
