import { router } from "../router";
import { BASE_TOPIC } from "../topics";
import type { Trigger } from "../types";
import { Component } from "./component";

export class Timer extends Component {
	private timeoutID: NodeJS.Timeout = setTimeout(() => {});
	private intervalID: NodeJS.Timeout = setInterval(() => {});
	private length = 0;
	private seconds = 0;
	private cancelCallback: CallableFunction = () => {};
	private publishTopic = "";

	setTimeout(
		period: TimerLength,
		callback: CallableFunction,
		options?: Options,
	) {
		this.cancelTimeout();
		this.setLength(period);
		if (typeof options !== "undefined") {
			if (typeof options.cancelTrigger !== "undefined") {
				this.setCancelTrigger(options.cancelTrigger);
			}
			if (typeof options.publishTopic !== "undefined") {
				this.publishTopic = `${BASE_TOPIC}timer/${options.publishTopic}`;
				this.intervalID = setInterval(() => {
					this.seconds = this.seconds + 1;
					this.publishTime();
				}, 1000);
			}
			if (typeof options.cancelCallback !== "undefined") {
				this.cancelCallback = options.cancelCallback;
			}
		}
		this.timeoutID = setTimeout(() => {
			clearInterval(this.intervalID);
			callback();
		}, this.length);
	}

	private publishTime() {
		this.client.publish(this.publishTopic, this.seconds.toString());
		this.client.publish(
			`${this.publishTopic}/countdown`,
			(this.length / 1000 - this.seconds).toString(),
		);
		this.client.publish(
			`${this.publishTopic}/text`,
			secondsToHms(this.seconds),
		);
		this.client.publish(
			`${this.publishTopic}/text_countdown`,
			secondsToHms(this.length / 1000 - this.seconds),
		);
	}

	public cancelTimeout() {
		clearTimeout(this.timeoutID);
		if (this.publishTopic !== "") {
			this.seconds = 0;
			this.publishTime();
		}
		clearInterval(this.intervalID);
	}

	private setLength(period: TimerLength) {
		let seconds = 0;
		if (typeof period.seconds !== "undefined") {
			seconds = period.seconds;
		}
		if (typeof period.minutes !== "undefined") {
			seconds = period.minutes * 60 + seconds;
		}
		if (typeof period.hours !== "undefined") {
			seconds = period.hours * 3600 + seconds;
		}
		this.length = seconds * 1000;
	}

	private setCancelTrigger(trigger: Trigger | Trigger[]) {
		if (typeof trigger !== "undefined") {
			if (Array.isArray(trigger)) {
				trigger.forEach((element) => {
					router.addAutomation({
						trigger: element,
						callback: () => {
							this.cancelTimeout();
							this.cancelCallback();
						},
					});
				});
			} else {
				router.addAutomation({
					trigger: trigger,
					callback: () => {
						this.cancelTimeout();
						this.cancelCallback();
					},
				});
			}
		}
	}
}

export type TimerLength = {
	seconds?: number;
	minutes?: number;
	hours?: number;
};

type Options = {
	cancelTrigger?: Trigger | Trigger[];
	cancelCallback?: CallableFunction;
	publishTopic?: string;
};

export function secondsToHms(inSeconds: number) {
	const seconds = Number(inSeconds);
	const h = Math.floor(seconds / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	const s = Math.floor((seconds % 3600) % 60);

	const hDisplay = h > 0 ? `${h}h ` : "";
	const mDisplay = m > 0 ? `${m}m ` : "";
	const sDisplay = h > 0 ? "" : s > 0 ? `${s}s` : "";

	return (hDisplay + mDisplay + sDisplay).trim();
}
