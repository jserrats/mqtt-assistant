"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = void 0;
const mqtt_1 = require("../mqtt");
class Component {
    constructor() {
        this.client = mqtt_1.client;
    }
}
exports.Component = Component;
