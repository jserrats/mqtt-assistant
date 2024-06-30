import { BASE_TOPIC } from "../topics"
import { Component } from "./component"
import { getSunrise, getSunset } from 'sunrise-sunset-js';

export class Sun extends Component {

    nextSunrise: Date
    nextSunset: Date
    private location: [number, number]

    constructor(latitude: number, longitude: number) {
        super()
        this.location = [latitude, longitude]

        this.scheduleSunrise()
        this.scheduleSunset()
    }

    private notify(sun: "sunrise" | "sunset") {
        this.client.publish(BASE_TOPIC + "sun/" + sun, "now"
        )
    }

    private scheduleSunrise() {
        this.nextSunrise = getSunrise(...this.location, this.tomorrow())
        this.publishSunrise(this.nextSunrise)
        setTimeout(() => {
            this.notify("sunrise")
            this.scheduleSunrise()
        }, this.nextSunrise.getTime() - Date.now())
    }

    private scheduleSunset() {
        this.nextSunset = getSunset(...this.location, this.tomorrow())
        this.publishSunset(this.nextSunset)
        setTimeout(() => {
            this.notify("sunset")
            this.scheduleSunset()
        }, this.nextSunset.getTime() - Date.now())
    }

    private publishSunrise(message: Date) {
        this.client.publish(BASE_TOPIC + "sun/sunrise/time", message.toISOString(), { retain: true })
    }

    private publishSunset(message: Date) {
        this.client.publish(BASE_TOPIC + "sun/sunset/time", message.toISOString(), { retain: true })
    }

    private tomorrow(): Date {
        var tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        return tomorrow
    }
}

