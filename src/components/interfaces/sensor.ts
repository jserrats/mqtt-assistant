import type { Stateful } from "./stateful";

export interface NumericSensor extends Stateful {
	get state(): number;
	unit: string;
	name: string;
	toString();
}

export interface BooleanSensor extends Stateful {
	get state(): boolean;
}

export interface StringSensor extends Stateful {
	get state(): string;
}
