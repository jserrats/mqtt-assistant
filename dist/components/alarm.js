"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Alarm = void 0;
const component_1 = require("./component");
const router_1 = require("../router");
const topics_1 = require("../topics");
class Alarm extends component_1.Component {
    constructor(name, contactSensors) {
        super();
        this.safe = true;
        this.topic = topics_1.BASE_TOPIC + "alarms/" + name;
        this.sensors = contactSensors;
        this.sensors.forEach(sensor => {
            router_1.router.addAutomation({
                trigger: sensor.trigger.all, callback: () => {
                    this.updateState();
                }
            });
        });
    }
    updateState() {
        var output = true;
        this.sensors.forEach(sensor => {
            output = output && sensor.contact;
        });
        this.safe = output;
        this.publishState();
    }
    publishState() {
        this.client.publish(this.topic, this.safe ? "SAFE" : "UNSAFE");
    }
}
exports.Alarm = Alarm;
