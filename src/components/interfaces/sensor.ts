import type { UUID } from "node:crypto";
import type { Stateful } from "./stateful";

export interface NumericSensor extends Stateful {
	get state(): number;
	unit: string;
	name: string;
	toString();
}

export interface BooleanSensor extends Stateful {
	events: {
		state: UUID;
		//TODO: add this to esphome and assistant sensors
		// on: UUID,
		// off: UUID
	};
	get state(): boolean;
}

export interface StringSensor extends Stateful {
	get state(): string;
}
