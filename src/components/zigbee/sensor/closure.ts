import type { BinarySensor } from "../../interfaces/binary-sensor";
import type { InboundZigbeeInfo } from "../zigbee";
import { GenericZigbeeSensor, type GenericZigbeeSensorOptions } from "./sensor";

export class ClosureSensorZigbee
	extends GenericZigbeeSensor
	implements BinarySensor
{
	contact: boolean;
	state: boolean;
	private inverted = false;
	trigger = {
		whenClosed: { topic: this.triggerTopic, payload: "CLOSED" },
		whenOpened: { topic: this.triggerTopic, payload: "OPEN" },
		all: { topic: this.triggerTopic, payload: "*" },
	};

	constructor(name: string, options?: ClosureSensorZigbeeOptions) {
		super(name, options);
		if (
			typeof options !== "undefined" &&
			typeof options.inverted !== "undefined"
		) {
			this.inverted = options.inverted;
		}
	}

	updateComponent(message: ClosureSensorZigbeeComponentInfo): void {
		if (this.contact === undefined) {
			this.contact = false;
		}
		if (this.contact !== !(message.contact === this.inverted)) {
			this.contact = !this.contact;
			this.triggerItself(this.contact);
			this.emit("state", this.contact);
		}
		this.state = this.contact;
		super.updateComponent(message);
	}

	private triggerItself(contact: boolean) {
		this.client.publish(this.triggerTopic, !contact ? "OPEN" : "CLOSED");
	}
}

export type ClosureSensorZigbeeComponentInfo = {
	contact: boolean;
} & InboundZigbeeInfo;

type ClosureSensorZigbeeOptions = {
	inverted?: boolean;
} & GenericZigbeeSensorOptions;
