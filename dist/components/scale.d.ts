import { Component } from "./component";
import { Automation } from "../types";
export declare class Scale extends Component {
    topic: string;
    updater: Automation;
    constructor(name: string, { averageWeight, data: UserData }: {
        averageWeight: any;
        data: any;
    });
    processScaleInfo(message: InboundScaleInfo): void;
}
type InboundScaleInfo = {
    weight: number;
    impedance: number;
};
export {};
