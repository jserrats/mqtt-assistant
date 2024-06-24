import { Component } from "./component"
import { ContactSensorZigbee } from "./zigbee/sensor"
import { ContactSensorESPHome } from "./esphome/binary-sensor"
import { router } from "../router"
import { BASE_TOPIC } from "../topics"

export class Alarm extends Component {
    private sensors: ContactSensors
    private topic: string
    safe = true

    constructor(name: string, contactSensors: ContactSensors) {
        super()
        this.topic = BASE_TOPIC + "alarms/" + name
        this.sensors = contactSensors
        this.sensors.forEach(sensor => {
            router.addAutomation({
                trigger: sensor.trigger.all, callback: () => {
                    this.updateState()
                }
            })
        });
        this.updateState()
    }

    updateState() {
        var output = true
        this.sensors.forEach(sensor => {
            output = output && sensor.contact
        })
        this.safe = output
        this.publishState()
    }

    publishState() {
        this.client.publish(this.topic, this.safe ? "SAFE" : "UNSAFE")
    }
}

type ContactSensors = Array<ContactSensorZigbee | ContactSensorESPHome>