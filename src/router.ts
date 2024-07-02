import wcmatch from "wildcard-match";
import {
	type Automation,
	type AutomationMultipleTriggers,
	Trigger,
} from "./types";

class Router {
	private routes: Automation[] = [];

	addAutomation(automation: Automation | AutomationMultipleTriggers) {
		if (Array.isArray(automation.trigger)) {
			automation.trigger.forEach((triggerInArray) => {
				this.routes.push({
					trigger: triggerInArray,
					callback: automation.callback,
				});
			});
		} else {
			this.routes.push(automation as Automation);
		}
	}

	route(newTopic: string, newPayload: string) {
		this.routes.forEach((automation: Automation) => {
			if (
				wcmatch(automation.trigger.topic)(newTopic) &&
				wcmatch(automation.trigger.payload)(newPayload)
			) {
				automation.callback({
					topic: newTopic,
					payload: newPayload,
				});
			}
		});
	}
}

export const router = new Router();
