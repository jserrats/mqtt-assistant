import mqtt from "mqtt";
import { router } from "./router";
import * as topic from "./topics";

const MQTT_SERVER = process.env.MQTT_SERVER;
if (MQTT_SERVER === undefined) {
	throw new Error("[!] Missing MQTT_SERVER");
}

export const client = mqtt.connect(`mqtt://${MQTT_SERVER}`, {
	will: {
		topic: topic.STATUS_TOPIC,
		payload: Buffer.from("offline"),
		retain: true,
	},
});

client.on("connect", () => {
	client.subscribe(`${topic.ZIGBEE2MQTT_TOPIC}#`, (err) => {
		if (!err) {
			client.publish(topic.STATUS_TOPIC, "online");
		}
	});
	client.subscribe(`${topic.ESPHOME_TOPIC}#`);
});

client.on("message", (topic, message) => {
	router.route(topic, message.toString());
});
