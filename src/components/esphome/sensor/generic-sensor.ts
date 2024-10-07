import type { Trigger } from "../../../types";
import { ESPHomeComponent, type ESPHomeComponentTypes } from "../esphome";

export class GenericESPHomeSensor extends ESPHomeComponent {
	protected triggerTopic = `${this.baseTopic}/trigger`;
	trigger: Record<string, Trigger>;
	updateCallback: CallableFunction | undefined;

	constructor(
		name: string,
		component: string,
		type: ESPHomeComponentTypes,
		options?: GenericESPHomeSensorOptions,
	) {
		super(name, component, type);
		if (options !== undefined && options.updateCallback !== undefined) {
			this.updateCallback = options.updateCallback;
		}
	}

	protected updateComponent(message: string): void {
		// TODO: deprecate callbacks
		if (typeof this.updateCallback !== "undefined") {
			this.updateCallback(this);
		}
	}
}

export type GenericESPHomeSensorOptions = {
	updateCallback?: CallableFunction;
};
