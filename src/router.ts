import { Automation, AutomationMultipleTriggers, Trigger } from "./types"
import wcmatch from 'wildcard-match'


class Router {
    private routes: Automation[] = []

    addAutomation(automation: Automation | AutomationMultipleTriggers) {
        if (Array.isArray(automation.trigger)) {
            automation.trigger.forEach((triggerInArray) => {
                this.routes.push({ trigger: triggerInArray, callback: automation.callback })
            })
        } else {
            this.routes.push(automation as Automation)
        }
    }

    route(newTopic: string, newPayload: string) {
        this.routes.forEach((automation: Automation) => {
            if (wcmatch(automation.trigger.topic)(newTopic) && wcmatch(automation.trigger.payload)(newPayload)) {
                automation.callback({
                    topic: newTopic,
                    payload: newPayload
                })
            }
        });

    }
}

export let router = new Router();
