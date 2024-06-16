import { ZigbeeComponent } from "./zigbee";
export declare class RemoteZigbee extends ZigbeeComponent {
    actionTopic: string;
}
/**
 * STYRBAR remote control
 * 4 button IKEA powered by 2xAAA
 */
export declare class RemoteE2002 extends RemoteZigbee {
    trigger: {
        up: {
            topic: string;
            payload: string;
        };
        down: {
            topic: string;
            payload: string;
        };
        holdDown: {
            topic: string;
            payload: string;
        };
        left: {
            topic: string;
            payload: string;
        };
        right: {
            topic: string;
            payload: string;
        };
        all: {
            topic: string;
            payload: string;
        };
    };
}
/**
 * TRADFRI shortcut button
 * 1 button IKEA remote powered by CR2032
 */
export declare class RemoteE1812 extends RemoteZigbee {
    trigger: {
        click: {
            topic: string;
            payload: string;
        };
    };
}
/**
 * Wireless switch with 4 buttons
 */
export declare class RemoteTS0044 extends RemoteZigbee {
    trigger: {
        topLeftSingleClick: {
            topic: string;
            payload: string;
        };
        topLeftDoubleClick: {
            topic: string;
            payload: string;
        };
        topLeftHold: {
            topic: string;
            payload: string;
        };
        topRightSingleClick: {
            topic: string;
            payload: string;
        };
        topRightDoubleClick: {
            topic: string;
            payload: string;
        };
        topRightHold: {
            topic: string;
            payload: string;
        };
        bottomLeftSingleClick: {
            topic: string;
            payload: string;
        };
        bottomLeftDoubleClick: {
            topic: string;
            payload: string;
        };
        bottomLeftHold: {
            topic: string;
            payload: string;
        };
        bottomRightSingleClick: {
            topic: string;
            payload: string;
        };
        bottomRightDoubleClick: {
            topic: string;
            payload: string;
        };
        bottomRightHold: {
            topic: string;
            payload: string;
        };
        all: {
            topic: string;
            payload: string;
        };
    };
}
