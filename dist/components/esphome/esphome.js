"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ESPHomeComponent = void 0;
const topics_1 = require("../../topics");
const component_1 = require("../component");
class ESPHomeComponent extends component_1.Component {
    topic;
    name;
    constructor(name) {
        super();
        this.topic = topics_1.ESPHOME_TOPIC + name;
        this.name = name;
    }
}
exports.ESPHomeComponent = ESPHomeComponent;
