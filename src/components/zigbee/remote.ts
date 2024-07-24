import { Trigger } from "../../types";
import { ZigbeeComponent } from "./zigbee";

export class RemoteZigbee extends ZigbeeComponent {
	actionTopic = `${this.topic}/action`;
}
/**
 * STYRBAR remote control
 * 4 button IKEA powered by 2xAAA
 */
export class RemoteE2002 extends RemoteZigbee {
	trigger = {
		up: { topic: this.actionTopic, payload: "on" },
		down: { topic: this.actionTopic, payload: "off" },
		holdDown: { topic: this.actionTopic, payload: "brightness_move_down" },
		left: { topic: this.actionTopic, payload: "arrow_left_click" },
		right: { topic: this.actionTopic, payload: "arrow_right_click" },
		all: { topic: this.actionTopic, payload: "*" },
	};
}

/**
 * TRADFRI shortcut button
 * 1 button IKEA remote powered by CR2032
 */
export class RemoteE1812 extends RemoteZigbee {
	trigger = {
		click: { topic: this.actionTopic, payload: "on" },
	};
}

/**
 * Wireless switch with 4 buttons
 */
export class RemoteTS0044 extends RemoteZigbee {
	// 1 | 2
	//-------
	// 3 | 4
	trigger = {
		topLeftSingleClick: { topic: this.actionTopic, payload: "1_single" },
		topLeftDoubleClick: { topic: this.actionTopic, payload: "1_double" },
		topLeftHold: { topic: this.actionTopic, payload: "1_hold" },

		topRightSingleClick: { topic: this.actionTopic, payload: "2_single" },
		topRightDoubleClick: { topic: this.actionTopic, payload: "2_double" },
		topRightHold: { topic: this.actionTopic, payload: "2_hold" },

		bottomLeftSingleClick: { topic: this.actionTopic, payload: "3_single" },
		bottomLeftDoubleClick: { topic: this.actionTopic, payload: "3_double" },
		bottomLeftHold: { topic: this.actionTopic, payload: "3_hold" },

		bottomRightSingleClick: { topic: this.actionTopic, payload: "4_single" },
		bottomRightDoubleClick: { topic: this.actionTopic, payload: "4_double" },
		bottomRightHold: { topic: this.actionTopic, payload: "4_hold" },
		all: { topic: this.actionTopic, payload: "*" },
	};
}

/**
 * TRADFRI E2201
 * 2 button IKEA remote powered by 1xAAA
 */
export class RemoteE2201 extends RemoteZigbee {
	trigger = {
		topClick: { topic: this.actionTopic, payload: "on" },
		bottomClick: { topic: this.actionTopic, payload: "off" },
		holdTopClick: { topic: this.actionTopic, payload: "brightness_move_up" },
		holdBottomClick: {
			topic: this.actionTopic,
			payload: "brightness_move_down",
		},
	};
}
