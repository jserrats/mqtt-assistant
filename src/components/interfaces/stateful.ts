import type { UUID } from "node:crypto";

export interface Stateful {
	events: { state: UUID };
	get state(): boolean | number | string;
}
