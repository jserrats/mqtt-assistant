import type { Trigger } from "../../../types";
import { type InboundZigbeeInfo, ZigbeeComponent } from "../zigbee";

export class GenericZigbeeSensor extends ZigbeeComponent {
	triggerTopic = `${this.topic}/trigger`;
	trigger: Record<string, Trigger>;
	updateCallback: CallableFunction | undefined;

	constructor(name: string, options?: GenericZigbeeSensorOptions) {
		super(name);
		if (options !== undefined && options.updateCallback !== undefined) {
			this.updateCallback = options.updateCallback;
		}
	}

	protected updateComponent(message: InboundZigbeeInfo): void {
		super.updateComponent(message);
		if (typeof this.updateCallback !== "undefined") {
			this.updateCallback(this);
		}
	}
}

export type GenericZigbeeSensorOptions = {
	updateCallback?: CallableFunction;
};
