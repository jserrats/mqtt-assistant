import type { UUID } from "node:crypto";
import type { Eventful } from "./eventful";

export interface Stateful extends Eventful {
	events: { state: UUID };
	get state(): boolean | number | string;
}
