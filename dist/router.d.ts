import { Automation, AutomationMultipleTriggers } from "./types";
declare class Router {
    private routes;
    addAutomation(automation: Automation | AutomationMultipleTriggers): void;
    route(newTopic: string, newPayload: string): void;
}
export declare let router: Router;
export {};
