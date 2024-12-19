import { randomUUID } from "node:crypto";
import { router } from "../router";
import { BASE_TOPIC } from "../topics";
import type { Trigger } from "../types";
import { Component } from "./component";

export class Timer extends Component {
	private timeoutID: NodeJS.Timeout = setTimeout(() => {});
	private intervalID: NodeJS.Timeout = setInterval(() => {});
	private length = 0;
	private seconds = 0;
	private publishTopic: string;
	public isRunning = false;
	public events = {
		timeout: randomUUID(),
		cancel: randomUUID(),
	};

	constructor(period: TimerLength, publish?: string) {
		super();
		this.setLength(period);
		this.publishTopic = publish ? `${BASE_TOPIC}timer/${publish}` : "";
	}
	public start() {
		this.internalCancel();
		if (this.publishTopic !== "") {
			this.intervalID = setInterval(() => {
				this.seconds = this.seconds + 1;
				this.publishTime();
			}, 1000);
		}
		this.timeoutID = setTimeout(() => {
			clearInterval(this.intervalID);
			this.emit(this.events.timeout);
		}, this.length);
		this.isRunning = true;
	}

	public cancel() {
		this.emit(this.events.cancel);
		this.internalCancel();
	}

	private internalCancel() {
		clearTimeout(this.timeoutID);
		this.isRunning = false;
		if (this.publishTopic !== "") {
			this.seconds = 0;
			this.publishTime();
		}
		clearInterval(this.intervalID);
	}

	public addCancelTriggers(trigger: Trigger | Trigger[]) {
		if (typeof trigger !== "undefined") {
			if (Array.isArray(trigger)) {
				trigger.forEach((element) => {
					router.addAutomation({
						trigger: element,
						callback: () => {
							this.cancel();
						},
					});
				});
			} else {
				router.addAutomation({
					trigger: trigger,
					callback: () => {
						this.cancel();
					},
				});
			}
		}
	}

	private publishTime() {
		this.client.publish(this.publishTopic, this.seconds.toString(), {
			retain: true,
		});
		this.client.publish(
			`${this.publishTopic}/countdown`,
			(this.length / 1000 - this.seconds).toString(),
			{
				retain: true,
			},
		);
		this.client.publish(
			`${this.publishTopic}/text`,
			secondsToHms(this.seconds),
			{
				retain: true,
			},
		);
		this.client.publish(
			`${this.publishTopic}/text_countdown`,
			secondsToHms(this.length / 1000 - this.seconds),
			{
				retain: true,
			},
		);
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
}

export type TimerLength = {
	seconds?: number;
	minutes?: number;
	hours?: number;
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
