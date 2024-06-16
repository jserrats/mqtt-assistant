import { ZigbeeComponent, InboundZigbeeInfo } from "./zigbee";
declare class PowerZigbee extends ZigbeeComponent {
    set_topic: string;
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
export {};
