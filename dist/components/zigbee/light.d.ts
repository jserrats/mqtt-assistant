import { ZigbeeComponent, InboundZigbeeInfo } from "./zigbee";
export declare class LightZigbee extends ZigbeeComponent {
    protected setTopic: string;
    state: boolean;
    protected brightness: number;
    setBrightness(level: number): void;
    on(options?: LightOptions): void;
    off(): void;
    toggle(): void;
    protected set(order: boolean): void;
    protected getOptions(): {
        brightness: number;
    };
    updateComponent(message: InboundLightZigbeeInfo): void;
}
/**
 * TRADFRI bulb E26/27, white spectrum, globe, opal, 1055/1100/1160 lm
 */
export declare class LightLED1623G12 extends LightZigbee {
    protected colorTemp: number;
    /**Sets Light color temp in mired scale. @param colorTemp 250 (normal) to 454 (warm)*/
    setColorTemp(colorTemp: number): void;
    /**
     *
     * @param brightness (0-254)
     * @param colorTemp (250-454)
     */
    on(options?: TemperatureLightOptions): void;
    protected getOptions(): {
        brightness: number;
        color_temp: number;
    };
    updateComponent(message: InboundTemperatureLightZigbeeInfo): void;
}
type InboundLightZigbeeInfo = {
    state: string;
    brightness: number;
} & InboundZigbeeInfo;
type InboundTemperatureLightZigbeeInfo = {
    color_temp: number;
} & InboundLightZigbeeInfo;
type LightOptions = {
    brightness?: number;
};
type TemperatureLightOptions = {
    colorTemp?: number;
} & LightOptions;
export {};
