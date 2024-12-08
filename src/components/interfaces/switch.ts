import type { Stateful } from "./stateful";

export interface Switch extends Stateful {
	get state(): boolean;
	setOn(): void;
	setOff(): void;
	toggle(): void;
}
