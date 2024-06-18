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
