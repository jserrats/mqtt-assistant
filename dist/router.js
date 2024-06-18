"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const wildcard_match_1 = __importDefault(require("wildcard-match"));
class Router {
    routes = [];
    addAutomation(automation) {
        if (Array.isArray(automation.trigger)) {
            automation.trigger.forEach((triggerInArray) => {
                this.routes.push({ trigger: triggerInArray, callback: automation.callback });
            });
        }
        else {
            this.routes.push(automation);
        }
    }
    // addAutomationMultipleTriggers({ triggers, callback }: { triggers: Trigger[], callback: CallableFunction }) {
    //     triggers.forEach((trigger: Trigger) => {
    //         this.addAutomation({ trigger, callback })
    //     })
    // }
    route(newTopic, newPayload) {
        this.routes.forEach((automation) => {
            if ((0, wildcard_match_1.default)(automation.trigger.topic)(newTopic) && (0, wildcard_match_1.default)(automation.trigger.payload)(newPayload)) {
                automation.callback({
                    topic: newTopic,
                    payload: newPayload
                });
            }
        });
    }
}
exports.router = new Router();
