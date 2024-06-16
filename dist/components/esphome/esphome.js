"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ESPHomeComponent = void 0;
const topics_1 = require("../../topics");
const component_1 = require("../component");
class ESPHomeComponent extends component_1.Component {
    constructor(name) {
        super();
        this.topic = topics_1.ESPHOME_TOPIC + name;
    }
}
exports.ESPHomeComponent = ESPHomeComponent;
// import { ESPHomeComponent } from "./index"
// import { Trigger } from "../types"
// export class Scale extends ESPHomeComponent {
//     weight_topic = this.topic + "weight/*"
//     impedance_topic = this.topic + "weight/*"
//     weight: Trigger = { topic: this.weight_topic, payload: "on" }
//     impedance: Trigger = { topic: this.weight_topic, payload: "on" }
// }
