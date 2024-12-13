import type { UUID } from "node:crypto";
import type { TimerLength } from "../timer";
import type { BooleanSensor } from "./sensor";

export interface Switch extends BooleanSensor {
	get state(): boolean;
	setOn(): void;
	setOff(): void;
	toggle(): void;
	newTimeStateEvent(
		time: TimerLength,
		logic: (state: boolean) => boolean,
	): UUID;
}
