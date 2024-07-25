import type { Trigger } from "../../../types";
import { Component } from "../../component";
import { ESPHomeComponent } from "../esphome";

export class GenericESPHomeSensor extends ESPHomeComponent {
	protected triggerTopic = `${this.baseTopic}/trigger`;
	trigger: Record<string, Trigger>;
	updateCallback: CallableFunction | undefined;

	constructor(
		name: string,
		component: string,
		options?: GenericESPHomeSensorOptions,
	) {
		super(name, component);
		if (options !== undefined && options.updateCallback !== undefined) {
			this.updateCallback = options.updateCallback;
		}
	}

	protected updateComponent(message: string): void {
		if (typeof this.updateCallback !== "undefined") {
			this.updateCallback(this);
		}
	}
}

export type GenericESPHomeSensorOptions = {
	updateCallback?: CallableFunction;
};
