"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WattPowerZigbee = exports.PowerE1603 = void 0;
const zigbee_1 = require("./zigbee");
class PowerZigbee extends zigbee_1.ZigbeeComponent {
    setTopic = this.topic + "/set";
    state = false;
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
        this.client.publish(this.setTopic, order ? "ON" : "OFF");
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
class WattPowerZigbee extends PowerZigbee {
    power = 0;
    updateComponent(message) {
        this.power = message.power;
        super.updateComponent(message);
    }
}
exports.WattPowerZigbee = WattPowerZigbee;
