import { BaseMQTTSensor } from "../base";

export class CustomSensor<Type extends number | string | boolean> extends BaseMQTTSensor<Type> {
	private logic: (message: string) => Type;

	constructor(name: string, logic: (message: string) => Type) {
		super(name);
		this.logic = logic;
	}

	updateComponent(message: string) {

		const state = this.logic(message);

		if (state !== this.state) {
			this.emit("state", state);
			this.state = state;
		}

		const publishState: string = typeof state === "boolean" ? state ? "ON" : "OFF" : state.toString()
		this.client.publish(this.stateTopic, publishState, {
			retain: true,
		});
	}
}
