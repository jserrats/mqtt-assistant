import { MqttClient } from "mqtt/*";
import { Switch } from "../../interfaces";
import { BinaryMQTTSensor } from "../binary-sensor";

export class CustomSwitch extends BinaryMQTTSensor implements Switch {
    private logic: (state: boolean, mqtt: MqttClient) => void;

    constructor(name: string, logic: (state: boolean, mqtt: MqttClient) => void) {
        super(name);
        this.logic = logic;
    }

    setOn(): void {
        this.logic(true, this.client);
        this.state = true;
    }

    setOff(): void {
        this.logic(false, this.client);
        this.state = false;
    }

    toggle(): void {
        this.logic(!this.state, this.client);
        this.state = !this.state;
    }

}
