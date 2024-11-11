import { RemoteZigbee } from "./base";

/**
 * STYRBAR remote control
 * 4 button IKEA powered by 2xAAA
 *
 * https://www.zigbee2mqtt.io/devices/E2001_E2002.html#ikea-e2001%252Fe2002
 */
export class RemoteE2002 extends RemoteZigbee {
	public button = {
		up: "on",
		down: "off",
		holdDown: "brightness_move_down",
		left: "arrow_left_click",
		right: "arrow_right_click",
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
		click: "on",
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
		topLeftSingleClick: "1_single",
		topLeftDoubleClick: "1_double",
		topLeftHold: "1_hold",

		topRightSingleClick: "2_single",
		topRightDoubleClick: "2_double",
		topRightHold: "2_hold",

		bottomLeftSingleClick: "3_single",
		bottomLeftDoubleClick: "3_double",
		bottomLeftHold: "3_hold",

		bottomRightSingleClick: "4_single",
		bottomRightDoubleClick: "4_double",
		bottomRightHold: "4_hold",
	};
}

/**
 * TRADFRI E2201
 * 2 button IKEA remote powered by 1xAAA
 *
 * https://www.zigbee2mqtt.io/devices/E2201.html#ikea-e2201
 */
export class RemoteE2201 extends RemoteZigbee {
	trigger = {
		topClick: "on",
		bottomClick: "off",
		holdTopClick: "brightness_move_up",
		holdBottomClick: "brightness_move_down",
	};
}
