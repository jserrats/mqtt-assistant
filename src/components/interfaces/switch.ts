import type { UUID } from "node:crypto";
import type { TimerLength } from "../timer";
import type { Stateful } from "./stateful";

export interface Switch extends Stateful{
	get state(): boolean;
	setOn(): void;
	setOff(): void;
	toggle(): void;
	newTimeStateEvent(
		time: TimerLength,
		logic: (state: boolean) => boolean,
	): UUID;
}
