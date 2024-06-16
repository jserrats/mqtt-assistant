import { Trigger } from "../types";
import { Component } from "./component";
export declare class Timer extends Component {
    private timeoutID;
    private intervalID;
    private length;
    private seconds;
    private cancelCallback;
    private publishTopic;
    setTimeout(period: Length, callback: CallableFunction, options?: Options): void;
    private publishTime;
    private static secondsToHms;
    cancelTimeout(): void;
    private setLength;
    private setCancelTrigger;
}
type Length = {
    seconds?: number;
    minutes?: number;
    hours?: number;
};
type Options = {
    cancelTrigger?: Trigger | Trigger[];
    cancelCallback?: CallableFunction;
    publishTopic?: string;
};
export {};
