import { router } from "../../../router";
import type { InboundZigbeeInfo } from "../zigbee";
import { GenericZigbeeSensor } from "./sensor";

export class PresenceSensorZigbee extends GenericZigbeeSensor {
	occupancy?: boolean;
	trigger = {
		occupied: { topic: this.triggerTopic, payload: "ON" },
		cleared: { topic: this.triggerTopic, payload: "OFF" },
		all: { topic: this.triggerTopic, payload: "*" },
	};

	updateComponent(message: PresenceSensorZigbeeComponentInfo): void {
		if (this.occupancy === !message.occupancy) {
			this.triggerItself();
		}
		this.occupancy = message.occupancy;
		super.updateComponent(message);
	}

	private triggerItself() {
		router.route(this.triggerTopic, !this.occupancy ? "ON" : "OFF");
	}
}

export type PresenceSensorZigbeeComponentInfo = {
	occupancy: boolean;
} & InboundZigbeeInfo;
