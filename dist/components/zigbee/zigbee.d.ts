import { Component } from "../component";
export declare class ZigbeeComponent extends Component {
    topic: string;
    linkquality: number;
    constructor(name: string);
    updateComponent(message: InboundZigbeeInfo): void;
}
export type InboundZigbeeInfo = {
    linkquality: number;
};
