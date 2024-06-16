import { client } from "../mqtt";
import { MqttClient } from "mqtt";

export class Component {
    client: MqttClient

    constructor() {
        this.client = client
    }
}