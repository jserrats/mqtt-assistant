"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LightESPHome = void 0;
const esphome_1 = require("./esphome");
const router_1 = require("../../router");
class LightESPHome extends esphome_1.ESPHomeComponent {
    constructor(name, component) {
        super(name);
        this.state = false;
        this.trigger = {
            on: { topic: "", payload: "*OFF*" },
            off: { topic: "", payload: "*ON*" }
        };
        this.sensorTopic = this.topic + "/light/" + component + "/state";
        this.commandTopic = this.topic + "/light/" + component + "/command";
        this.trigger.on.topic = this.sensorTopic;
        this.trigger.off.topic = this.sensorTopic;
        this.updater = {
            trigger: { topic: this.sensorTopic, payload: "*" }, callback: (message) => {
                this.updateComponent(message.payload);
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
    toggle() {
        this.set(!this.state);
    }
    set(status) {
        this.client.publish(this.commandTopic, JSON.stringify({ state: status ? "ON" : "OFF" }));
    }
    updateComponent(message) {
        this.state = (JSON.parse(message).state == "ON");
    }
}
exports.LightESPHome = LightESPHome;
