import type { UUID } from "node:crypto";

export interface Stateful {
	events: { state: UUID };
	get state(): boolean | number | string;
	on(eventName: string | symbol, listener: (...args: any[]) => void);
	emit(eventName: string | symbol, ...args: any);
}
