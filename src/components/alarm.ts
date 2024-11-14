import { BASE_TOPIC } from "../topics";
import { Component } from "./component";
import type { BinarySensorESPHome } from "./esphome/entities/sensors/binary-sensor";
import type { ExposesContact } from "./zigbee/exposes/exposes";

export class Alarm extends Component {
	private sensors: ContactSensors;
	private topic: string;
	state: boolean;

	constructor(name: string, contactSensors: ContactSensors) {
		super();
		this.topic = `${BASE_TOPIC}alarms/${name}`;
		this.sensors = contactSensors;
		this.sensors.forEach((sensor) => {
			sensor.on(sensor.events.state, () => {
				this.updateState();
			});
		});
		this.updateState();
	}

	updateState() {
		let output = true;
		this.sensors.forEach((sensor) => {
			output = output && (sensor.state === undefined ? false : sensor.state);
		});
		this.state = output;
		this.publishState();
	}

	publishState() {
		//TODO: standarize this output
		this.client.publish(this.topic, this.state ? "SAFE" : "UNSAFE");
	}
}

type ContactSensors = Array<ExposesContact | BinarySensorESPHome>;
