"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteTS0044 = exports.RemoteE1812 = exports.RemoteE2002 = exports.RemoteZigbee = void 0;
const zigbee_1 = require("./zigbee");
class RemoteZigbee extends zigbee_1.ZigbeeComponent {
    actionTopic = this.topic + "/action";
}
exports.RemoteZigbee = RemoteZigbee;
/**
 * STYRBAR remote control
 * 4 button IKEA powered by 2xAAA
 */
class RemoteE2002 extends RemoteZigbee {
    trigger = {
        up: { topic: this.actionTopic, payload: "on" },
        down: { topic: this.actionTopic, payload: "off" },
        holdDown: { topic: this.actionTopic, payload: "brightness_move_down" },
        left: { topic: this.actionTopic, payload: "arrow_left_click" },
        right: { topic: this.actionTopic, payload: "arrow_right_click" },
        all: { topic: this.actionTopic, payload: "*" }
    };
}
exports.RemoteE2002 = RemoteE2002;
/**
 * TRADFRI shortcut button
 * 1 button IKEA remote powered by CR2032
 */
class RemoteE1812 extends RemoteZigbee {
    trigger = {
        click: { topic: this.actionTopic, payload: "on" }
    };
}
exports.RemoteE1812 = RemoteE1812;
/**
 * Wireless switch with 4 buttons
 */
class RemoteTS0044 extends RemoteZigbee {
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
        all: { topic: this.actionTopic, payload: "*" }
    };
}
exports.RemoteTS0044 = RemoteTS0044;
