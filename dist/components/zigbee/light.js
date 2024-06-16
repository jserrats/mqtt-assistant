"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LightLED1623G12 = exports.LightZigbee = void 0;
const zigbee_1 = require("./zigbee");
class LightZigbee extends zigbee_1.ZigbeeComponent {
    constructor() {
        super(...arguments);
        this.setTopic = this.topic + "/set";
        this.state = false;
        this.brightness = 254;
    }
    setBrightness(level) {
        if (level > 0 && level < 255) {
            this.brightness = level;
        }
        // apply new brightness only if the light is already on
        if (this.state) {
            this.set(true);
        }
    }
    on(options) {
        if (typeof (options === null || options === void 0 ? void 0 : options.brightness) !== 'undefined') {
            this.setBrightness(options.brightness);
        }
        this.set(true);
    }
    off() {
        this.set(false);
    }
    toggle() {
        this.set(!this.state);
    }
    set(order) {
        this.client.publish(this.setTopic, JSON.stringify(Object.assign({ state: order ? "ON" : "OFF" }, this.getOptions())));
    }
    getOptions() {
        return { brightness: this.brightness };
    }
    updateComponent(message) {
        this.state = (message.state == "ON");
        this.brightness = message.brightness;
        super.updateComponent(message);
    }
}
exports.LightZigbee = LightZigbee;
/**
 * TRADFRI bulb E26/27, white spectrum, globe, opal, 1055/1100/1160 lm
 */
class LightLED1623G12 extends LightZigbee {
    constructor() {
        super(...arguments);
        this.colorTemp = 250;
    }
    /**Sets Light color temp in mired scale. @param colorTemp 250 (normal) to 454 (warm)*/
    setColorTemp(colorTemp) {
        if (colorTemp > 249 && colorTemp < 455) {
            this.colorTemp = colorTemp;
        }
        // apply new color only if the light is already on
        if (this.state) {
            this.set(true);
        }
    }
    /**
     *
     * @param brightness (0-254)
     * @param colorTemp (250-454)
     */
    on(options) {
        if (typeof (options === null || options === void 0 ? void 0 : options.colorTemp) !== 'undefined') {
            this.setColorTemp(options.colorTemp);
        }
        const brightness = options === null || options === void 0 ? void 0 : options.brightness;
        super.on({ brightness });
    }
    getOptions() {
        return Object.assign({ color_temp: this.colorTemp }, super.getOptions());
    }
    updateComponent(message) {
        this.colorTemp = message.color_temp;
        super.updateComponent(message);
    }
}
exports.LightLED1623G12 = LightLED1623G12;
