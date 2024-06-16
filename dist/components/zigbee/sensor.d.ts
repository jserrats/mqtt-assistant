import { ZigbeeComponent, InboundZigbeeInfo } from "./zigbee";
export declare class PresenceSensorZigbee extends ZigbeeComponent {
    occupancy: boolean;
    actionTopic: string;
    trigger: {
        occupied: {
            topic: string;
            payload: string;
        };
        cleared: {
            topic: string;
            payload: string;
        };
        all: {
            topic: string;
            payload: string;
        };
    };
    updateComponent(message: PresenceSensorZigbeeComponentInfo): void;
    triggerItself(): void;
}
type PresenceSensorZigbeeComponentInfo = {
    occupancy: boolean;
} & InboundZigbeeInfo;
export declare class ContactSensorZigbee extends ZigbeeComponent {
    contact: boolean;
    private inverted;
    private actionTopic;
    trigger: {
        whenClosed: {
            topic: string;
            payload: string;
        };
        whenOpened: {
            topic: string;
            payload: string;
        };
        all: {
            topic: string;
            payload: string;
        };
    };
    constructor(name: string, options?: ClosureSensorZigbeeOptions);
    updateComponent(message: ClosureSensorZigbeeComponentInfo): void;
    private triggerItself;
}
type ClosureSensorZigbeeComponentInfo = {
    contact: boolean;
} & InboundZigbeeInfo;
type ClosureSensorZigbeeOptions = {
    inverted?: boolean;
};
export declare class WeatherSensorZigbee extends ZigbeeComponent {
    temperature: number | undefined;
    humidity: number | undefined;
    updateCallback: CallableFunction | undefined;
    constructor(name: string, updateCallback?: CallableFunction);
    updateComponent(message: WeatherSensorZigbeeComponentInfo): void;
}
type WeatherSensorZigbeeComponentInfo = {
    temperature: number;
    humidity: number;
} & InboundZigbeeInfo;
export {};
