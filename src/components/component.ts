import type { UUID } from "node:crypto";
import { randomUUID } from "node:crypto";
import { EventEmitter } from "node:events";
import type { MqttClient } from "mqtt";
import { client } from "../mqtt";
import type { Stateful } from "./interfaces/stateful";
import { Timer, type TimerLength } from "./timer";

export class SimplerEventEmitter {
	private emiter = new EventEmitter();

	public events: Record<string, UUID>;

	on(eventName: string | symbol, listener: (...args: any[]) => void) {
		this.emiter.on(eventName, listener);
		return this;
	}

	emit(eventName: string | symbol, ...args: any) {
		const value = this.emiter.emit(eventName, ...args);
		globalEventManager.emit(eventName, ...args);
		return value;
	}
}

export class Component extends SimplerEventEmitter {
	protected client: MqttClient;

	constructor() {
		super();
		this.client = client;
	}
}

class GlobalEventManager {
	private emiter = new EventEmitter();

	on(
		eventName: Array<string | symbol> | string | symbol,
		listener: (...args: any[]) => void,
	) {
		if (Array.isArray(eventName)) {
			eventName.forEach((eventInArray) => {
				this.emiter.on(eventInArray, listener);
			});
		} else {
			this.emiter.on(eventName, listener);
		}
	}

	emit(eventName: string | symbol, ...args: any) {
		this.emiter.emit(eventName, ...args);
	}
}

export const globalEventManager = new GlobalEventManager();

export class StatefulComponent<T extends string | number | boolean>
	extends Component
	implements Stateful
{
	private _state: T;
	public events = {
		/** Emited when the state property of the object is updated
		 */
		state: randomUUID(),
	};

	get state(): T {
		return this._state;
	}

	protected set state(newState: T) {
		const oldState = this.state;
		this._state = newState;
		if (
			oldState !== newState ||
			(newState !== undefined && oldState === undefined)
		) {
			this.emit(this.events.state, newState);
		}
	}

	public newTimeStateEvent(time: TimerLength, logic: (state: T) => boolean) {
		let timer: NodeJS.Timeout;
		const newTimeoutEvent = randomUUID();

		let seconds = 0;
		if (typeof time.seconds !== "undefined") {
			seconds = time.seconds;
		}
		if (typeof time.minutes !== "undefined") {
			seconds = time.minutes * 60 + seconds;
		}
		if (typeof time.hours !== "undefined") {
			seconds = time.hours * 3600 + seconds;
		}
		const miliseconds = seconds * 1000;

		this.on(this.events.state, (state) => {
			if (logic(state)) {
				timer = setTimeout(() => {
					this.emit(newTimeoutEvent);
				}, miliseconds);
			} else {
				clearTimeout(timer);
			}
		});
		// this.timers.push(timer)

		return newTimeoutEvent;
	}
}
