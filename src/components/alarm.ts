import { router } from "../router";
import { BASE_TOPIC } from "../topics";
import { Component } from "./component";
import type { ContactSensorESPHome } from "./esphome/sensor/binary-sensor";
import type { ClosureSensorZigbee } from "./zigbee/devices/closure";

export class Alarm extends Component {
	private sensors: ContactSensors;
	private topic: string;
	safe = true;

	constructor(name: string, contactSensors: ContactSensors) {
		super();
		this.topic = `${BASE_TOPIC}alarms/${name}`;
		this.sensors = contactSensors;
		this.sensors.forEach((sensor) => {
			router.addAutomation({
				trigger: sensor.trigger.all,
				callback: () => {
					this.updateState();
				},
			});
		});
		this.updateState();
	}

	updateState() {
		let output = true;
		this.sensors.forEach((sensor) => {
			output =
				output && (sensor.contact === undefined ? false : sensor.contact);
		});
		this.safe = output;
		this.publishState();
	}

	publishState() {
		this.client.publish(this.topic, this.safe ? "SAFE" : "UNSAFE");
	}
}

type ContactSensors = Array<ClosureSensorZigbee | ContactSensorESPHome>;
