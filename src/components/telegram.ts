import mqtt, { type MqttClient } from "mqtt";

export class TelegramClient {
	client: MqttClient;
	constructor(server?: string) {
		var MQTT_SERVER: string | undefined;
		if (typeof server !== "undefined") {
			MQTT_SERVER = server;
		} else {
			MQTT_SERVER = process.env.MQTT_SERVER;
			if (MQTT_SERVER === undefined) {
				throw new Error("[!] Telegram integration Missing MQTT_SERVER");
			}
		}
		MQTT_SERVER as string;
		this.client = mqtt.connect("mqtt://" + MQTT_SERVER);
	}

	send(message: string) {
		this.client.publish("notify/telegram", message);
	}
}
