"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PowerE1603 = void 0;
const zigbee_1 = require("./zigbee");
class PowerZigbee extends zigbee_1.ZigbeeComponent {
    constructor() {
        super(...arguments);
        this.set_topic = this.topic + "/set";
        this.state = false;
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
    set(order) {
        this.client.publish(this.set_topic, order ? "ON" : "OFF");
    }
    updateComponent(message) {
        this.state = (message.state == "ON");
        super.updateComponent(message);
    }
}
/**
 * TRADFRI control outlet
 */
class PowerE1603 extends PowerZigbee {
}
exports.PowerE1603 = PowerE1603;
