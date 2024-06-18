import { ESPHOME_TOPIC } from "../../topics"

import { Automation } from "../../types";
import { Component } from "../component"

export class ESPHomeComponent extends Component {
    topic: string
    name: string
    constructor(name: string) {
        super()
        this.topic = ESPHOME_TOPIC + name
        this.name = name
    }
}



// import { ESPHomeComponent } from "./index"
// import { Trigger } from "../types"

// export class Scale extends ESPHomeComponent {
//     weight_topic = this.topic + "weight/*"
//     impedance_topic = this.topic + "weight/*"
//     weight: Trigger = { topic: this.weight_topic, payload: "on" }
//     impedance: Trigger = { topic: this.weight_topic, payload: "on" }


// }