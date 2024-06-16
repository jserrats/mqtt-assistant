import { Component } from "./component";
import { ContactSensorZigbee } from "./zigbee/sensor";
import { ContactSensorESPHome } from "./esphome/binary-sensor";
export declare class Alarm extends Component {
    private sensors;
    private topic;
    safe: boolean;
    constructor(name: string, contactSensors: ContactSensors);
    updateState(): void;
    publishState(): void;
}
type ContactSensors = Array<ContactSensorZigbee | ContactSensorESPHome>;
export {};
