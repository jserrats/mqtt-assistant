"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactSensorESPHome = exports.BinarySensorESPHome = void 0;
const esphome_1 = require("./esphome");
const router_1 = require("../../router");
class BinarySensorESPHome extends esphome_1.ESPHomeComponent {
    constructor(name, component) {
        super(name);
        this.state = false;
        this.trigger = {
            on: { topic: "", payload: "ON" },
            off: { topic: "", payload: "OFF" },
            all: { topic: "", payload: "*" }
        };
        this.sensorTopic = this.topic + "/binary_sensor/" + component + "/state";
        this.trigger.off.topic = this.sensorTopic;
        this.trigger.on.topic = this.sensorTopic;
        this.trigger.all.topic = this.sensorTopic;
        this.updater = {
            trigger: { topic: this.topic, payload: "*" }, callback: (message) => {
                this.updateComponent(message.payload);
            }
        };
        router_1.router.addAutomation(this.updater);
    }
    updateComponent(message) {
        this.state = (message == "ON");
    }
}
exports.BinarySensorESPHome = BinarySensorESPHome;
class ContactSensorESPHome extends BinarySensorESPHome {
    constructor() {
        super(...arguments);
        this.contact = false;
    }
    updateComponent(message) {
        this.contact = (message == "ON");
    }
}
exports.ContactSensorESPHome = ContactSensorESPHome;
