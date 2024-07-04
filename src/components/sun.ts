import { getSunrise, getSunset } from "sunrise-sunset-js";
import { Component } from "./component";

export class Sun extends Component {
	nextSunrise: Date;
	nextSunset: Date;
	state: boolean;
	private location: [number, number];

	constructor(latitude: number, longitude: number) {
		super();
		this.location = [latitude, longitude];
		this.scheduleSunrise();
		this.scheduleSunset();

		const todaySunrise = getSunrise(...this.location);
		const todaySunset = getSunset(...this.location);
		const now = new Date();

		this.state = todaySunrise < now && todaySunset > now;
		this.notifyChange();
	}

	private notifyChange() {
		this.client.publish("weather/sun", this.state ? "ON" : "OFF", {
			retain: true,
		});
	}

	private scheduleSunrise() {
		this.nextSunrise = getSunrise(...this.location, this.tomorrow());
		this.publishSunrise(this.nextSunrise);
		setTimeout(() => {
			this.state = true;
			this.notifyChange();
			this.scheduleSunrise();
		}, this.nextSunrise.getTime() - Date.now());
	}

	private scheduleSunset() {
		this.nextSunset = getSunset(...this.location, this.tomorrow());
		this.publishSunset(this.nextSunset);
		setTimeout(() => {
			this.state = false;
			this.notifyChange();
			this.scheduleSunset();
		}, this.nextSunset.getTime() - Date.now());
	}

	private publishSunrise(message: Date) {
		this.client.publish("weather/sun/sunrise", message.toISOString(), {
			retain: true,
		});
	}

	private publishSunset(message: Date) {
		this.client.publish("weather/sun/sunset", message.toISOString(), {
			retain: true,
		});
	}

	private tomorrow(): Date {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		return tomorrow;
	}
}
