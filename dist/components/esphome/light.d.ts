import { ESPHomeComponent } from "./esphome";
import { Automation } from "../../types";
export declare class LightESPHome extends ESPHomeComponent {
    sensorTopic: string;
    commandTopic: string;
    state: boolean;
    updater: Automation;
    trigger: {
        on: {
            topic: string;
            payload: string;
        };
        off: {
            topic: string;
            payload: string;
        };
    };
    constructor(name: string, component: string);
    on(): void;
    off(): void;
    toggle(): void;
    private set;
    private updateComponent;
}
