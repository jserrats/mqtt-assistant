import type { Stateful } from "./stateful";

export interface NumericSensor extends Stateful {
	get state(): number;
	unit: string;
	name: string;
	toString();
}
