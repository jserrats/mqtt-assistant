import type { Trigger } from "../../types";

import { InboundZigbeeInfo } from "../zigbee/zigbee";

export interface Sensor {
	state: number;
	//trigger: Record<string, Trigger>;
	updateComponent(message: InboundZigbeeInfo | string)
}
