import { ZigbeeComponent, InboundZigbeeInfo } from "./zigbee";
declare class PowerZigbee extends ZigbeeComponent {
    setTopic: string;
    state: boolean;
    on(): void;
    off(): void;
    toggle(): void;
    private set;
    updateComponent(message: InboundPowerZigbeeInfo): void;
}
/**
 * TRADFRI control outlet
 */
export declare class PowerE1603 extends PowerZigbee {
}
type InboundPowerZigbeeInfo = {
    state: string;
} & InboundZigbeeInfo;
export declare class WattPowerZigbee extends PowerZigbee {
    power: number;
    updateComponent(message: InboundWattPowerZigbeeInfo): void;
}
type InboundWattPowerZigbeeInfo = {
    power: number;
} & InboundPowerZigbeeInfo;
export {};
