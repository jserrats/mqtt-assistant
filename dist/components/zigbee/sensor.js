"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherSensorZigbee = exports.ContactSensorZigbee = exports.PresenceSensorZigbee = void 0;
const zigbee_1 = require("./zigbee");
class PresenceSensorZigbee extends zigbee_1.ZigbeeComponent {
    constructor() {
        super(...arguments);
        this.occupancy = false;
        this.actionTopic = this.topic + "/action";
        this.trigger = {
            occupied: { topic: this.actionTopic, payload: "ON" },
            cleared: { topic: this.actionTopic, payload: "OFF" },
            all: { topic: this.actionTopic, payload: "*" }
        };
    }
    updateComponent(message) {
        if (this.occupancy == !message.occupancy) {
            this.triggerItself();
        }
        this.occupancy = message.occupancy;
        super.updateComponent(message);
    }
    triggerItself() {
        this.client.publish(this.actionTopic, !this.occupancy ? "ON" : "OFF");
    }
}
exports.PresenceSensorZigbee = PresenceSensorZigbee;
class ContactSensorZigbee extends zigbee_1.ZigbeeComponent {
    constructor(name, options) {
        super(name);
        this.contact = false;
        this.inverted = false;
        this.actionTopic = this.topic + "/action";
        this.trigger = {
            whenClosed: { topic: this.actionTopic, payload: "CLOSED" },
            whenOpened: { topic: this.actionTopic, payload: "OPEN" },
            all: { topic: this.actionTopic, payload: "*" }
        };
        if (typeof options !== "undefined" && typeof options.inverted !== "undefined") {
            this.inverted = options.inverted;
        }
    }
    updateComponent(message) {
        if (this.contact !== !(message.contact === this.inverted)) {
            this.contact = !this.contact;
            this.triggerItself(this.contact);
        }
        super.updateComponent(message);
    }
    triggerItself(contact) {
        this.client.publish(this.actionTopic, !contact ? "OPEN" : "CLOSED");
    }
}
exports.ContactSensorZigbee = ContactSensorZigbee;
class WeatherSensorZigbee extends zigbee_1.ZigbeeComponent {
    constructor(name, updateCallback) {
        super(name);
        this.updateCallback = updateCallback;
    }
    updateComponent(message) {
        this.temperature = message.temperature;
        this.humidity = message.humidity;
        super.updateComponent(message);
        if (typeof this.updateCallback !== "undefined") {
            this.updateCallback(this);
        }
    }
}
exports.WeatherSensorZigbee = WeatherSensorZigbee;
