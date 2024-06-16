import { MqttClient } from "mqtt";
export declare class TelegramClient {
    client: MqttClient;
    constructor(server?: string);
    send(message: string): void;
}
