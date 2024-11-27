import { RemoteZigbee } from "./base";

/**
 * STYRBAR remote control
 * 4 button IKEA powered by 2xAAA
 *
 * https://www.zigbee2mqtt.io/devices/E2001_E2002.html#ikea-e2001%252Fe2002
 */
export class RemoteE2002 extends RemoteZigbee {
	public button = {
		up: `on${this.remoteId}`,
		down: `off${this.remoteId}`,
		holdDown: `brightness_move_down${this.remoteId}`,
		left: `arrow_left_click${this.remoteId}`,
		right: `arrow_right_click${this.remoteId}`,
	};
}

/**
 * TRADFRI shortcut button
 * 1 button IKEA remote powered by CR2032
 *
 * https://www.zigbee2mqtt.io/devices/E1812.html#ikea-e1812
 */
export class RemoteE1812 extends RemoteZigbee {
	public button = {
		click: `on${this.remoteId}`,
	};
}

/**
 * Wireless switch with 4 buttons
 *
 * Tuya
 *
 * https://www.zigbee2mqtt.io/devices/TS0044.html#tuya-ts0044
 */
export class RemoteTS0044 extends RemoteZigbee {
	// 1 | 2
	//-------
	// 3 | 4
	public button = {
		topLeftSingleClick: `1_single${this.remoteId}`,
		topLeftDoubleClick: `1_double${this.remoteId}`,
		topLeftHold: `1_hold${this.remoteId}`,

		topRightSingleClick: `2_single${this.remoteId}`,
		topRightDoubleClick: `2_double${this.remoteId}`,
		topRightHold: `2_hold${this.remoteId}`,

		bottomLeftSingleClick: `3_single${this.remoteId}`,
		bottomLeftDoubleClick: `3_double${this.remoteId}`,
		bottomLeftHold: `3_hold${this.remoteId}`,

		bottomRightSingleClick: `4_single${this.remoteId}`,
		bottomRightDoubleClick: `4_double${this.remoteId}`,
		bottomRightHold: `4_hold${this.remoteId}`,
	};
}

/**
 * TRADFRI E2201
 * 2 button IKEA remote powered by 1xAAA
 *
 * https://www.zigbee2mqtt.io/devices/E2201.html#ikea-e2201
 */
export class RemoteE2201 extends RemoteZigbee {
	public button = {
		topClick: `on${this.remoteId}`,
		bottomClick: `off${this.remoteId}`,
		holdTopClick: `brightness_move_up${this.remoteId}`,
		holdBottomClick: `brightness_move_down${this.remoteId}`,
	};
}
