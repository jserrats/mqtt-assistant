import { Component } from "./component"
import { Automation } from "../types";
import { router } from "../router"

export class Scale extends Component {
    topic: string
    updater: Automation

    constructor(name: string, { averageWeight, data: UserData }) {
        super()
        this.topic = name
        this.updater = {
            trigger: { topic: this.topic, payload: "*" },
            callback: (message: string) => { this.processScaleInfo(JSON.parse(message)) }
        }
        router.addAutomation(this.updater)
    }

    processScaleInfo(message: InboundScaleInfo): void {

    }

}

type InboundScaleInfo = {
    weight: number,
    impedance: number
}

type UserData = {
    averageWeight: number,
    age: number,
    sex: "male" | "female"
}