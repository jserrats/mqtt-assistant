import type { UUID } from "node:crypto";

export interface Stateful {
	state: boolean | number | string;
	events: { state: UUID };
}
