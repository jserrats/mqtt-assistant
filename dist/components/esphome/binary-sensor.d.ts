import { ESPHomeComponent } from "./esphome";
import { Automation } from "../../types";
export declare class BinarySensorESPHome extends ESPHomeComponent {
    sensorTopic: string;
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
        all: {
            topic: string;
            payload: string;
        };
    };
    constructor(name: string, component: string);
    updateComponent(message: string): void;
}
export declare class ContactSensorESPHome extends BinarySensorESPHome {
    contact: boolean;
    updateComponent(message: string): void;
}
