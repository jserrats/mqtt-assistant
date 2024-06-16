"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sun = void 0;
const topics_1 = require("../topics");
const component_1 = require("./component");
const sunrise_sunset_js_1 = require("sunrise-sunset-js");
const node_schedule_1 = require("node-schedule");
class Sun extends component_1.Component {
    constructor(latitude, longitude) {
        super();
        this.location = [latitude, longitude];
        this.nextSunrise = (0, sunrise_sunset_js_1.getSunrise)(...this.location);
        this.nextSunset = (0, sunrise_sunset_js_1.getSunset)(...this.location);
        this.updateSunrise(this.nextSunrise);
        this.updateSunset(this.nextSunset);
        (0, node_schedule_1.scheduleJob)(this.nextSunrise, () => {
            this.notify("sunrise");
            this.updateSunrise(this.nextSunrise);
        });
        (0, node_schedule_1.scheduleJob)(this.nextSunset, () => {
            this.notify("sunset");
            this.updateSunset(this.nextSunrise);
        });
    }
    notify(sun) {
        this.client.publish(topics_1.BASE_TOPIC + "sun/" + sun, "now");
    }
    updateSunrise(message) {
        this.client.publish(topics_1.BASE_TOPIC + "sun/sunrise/time", message.toISOString(), { retain: true });
    }
    updateSunset(message) {
        this.client.publish(topics_1.BASE_TOPIC + "sun/sunset/time", message.toISOString(), { retain: true });
    }
}
exports.Sun = Sun;
