import { BASE_TOPIC } from "../topics"
import { Component } from "./component"
import { getSunrise, getSunset } from 'sunrise-sunset-js';
import { scheduleJob } from 'node-schedule'
export class Sun extends Component {

    nextSunrise: Date
    nextSunset: Date
    private location: [number, number]

    constructor(latitude: number, longitude: number) {
        super()
        this.location = [latitude, longitude]
        this.nextSunrise = getSunrise(...this.location)
        this.nextSunset = getSunset(...this.location)
        this.updateSunrise(this.nextSunrise)
        this.updateSunset(this.nextSunset)

        scheduleJob(this.nextSunrise, () => {
            this.updateSunrise(this.nextSunrise)
        })

        scheduleJob(this.nextSunset, () => {
            this.updateSunset(this.nextSunrise)
        })
    }

    notify(sun: "sunrise" | "sunset") {
        this.client.publish(BASE_TOPIC + "sun/" + sun, "now"
        )
    }

    private updateSunrise(message: Date) {
        this.notify("sunrise")
        this.client.publish(BASE_TOPIC + "sun/sunrise/time", message.toISOString(), { retain: true })
    }

    private updateSunset(message: Date) {
        this.notify("sunset")
        this.client.publish(BASE_TOPIC + "sun/sunset/time", message.toISOString(), { retain: true })
    }
}

