import type { UUID } from "node:crypto";
import type { Stateful } from "./stateful";

export interface NumericSensor extends Stateful {
	get state(): number;
	unit: string;
	name: string;
	toString(): string;
}

export interface BooleanSensor extends Stateful {
	events: {
		state: UUID;
		on: UUID;
		off: UUID;
	};
	get state(): boolean;
}

export interface StringSensor extends Stateful {
	get state(): string;
}
