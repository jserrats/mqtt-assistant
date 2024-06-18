"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scale = void 0;
const component_1 = require("./component");
const router_1 = require("../router");
class Scale extends component_1.Component {
    topic;
    updater;
    constructor(name, { averageWeight, data: UserData }) {
        super();
        this.topic = name;
        this.updater = {
            trigger: { topic: this.topic, payload: "*" },
            callback: (message) => { this.processScaleInfo(JSON.parse(message)); }
        };
        router_1.router.addAutomation(this.updater);
    }
    processScaleInfo(message) {
    }
}
exports.Scale = Scale;
