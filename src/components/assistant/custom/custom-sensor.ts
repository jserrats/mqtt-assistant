import type { StatefulComponent } from "../../component";
import { BaseMQTTSensor } from "../base";

export class CustomSensor<
	Type extends number | string | boolean,
> extends BaseMQTTSensor<Type> {
	private logic: (message: boolean | string | number) => Type;

	constructor(
		name: string,
		observed:
			| StatefulComponent<number>
			| StatefulComponent<string>
			| StatefulComponent<boolean>,
		logic: (state: boolean | string | number) => Type,
	) {
		super(name);
		observed.on(observed.events.state, (state) => {
			this.calculateState(state);
		});
		this.logic = logic;
	}

	protected calculateState(message: boolean | string | number) {
		const state = this.logic(message);

		if (state !== this.state) {
			this.state = state;
			const publishState: string =
				typeof state === "boolean" ? (state ? "ON" : "OFF") : state.toString();
			this.client.publish(this.stateTopic, publishState, {
				retain: true,
			});
		}
	}
}
