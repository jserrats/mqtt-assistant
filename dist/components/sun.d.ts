import { Component } from "./component";
export declare class Sun extends Component {
    nextSunrise: Date;
    nextSunset: Date;
    private location;
    constructor(latitude: number, longitude: number);
    private notify;
    private updateSunrise;
    private updateSunset;
}
