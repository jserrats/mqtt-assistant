import { EventEmitter } from "node:events";
import { SwitchZigbee } from "../devices/switch";
import { telegram } from "../../telegram";

// TODO: add units
export class ExposesZigbee<T> extends EventEmitter {
    state: T;
    static exposes: string
    protected _exposes: string = (this.constructor as typeof ExposesZigbee<T>).exposes

    updateExposes(message: object): void {
        if ((this.state === undefined) ||
            (message[this._exposes] != this.state)) {
            this.state = message[this._exposes];
            this.emit(this._exposes, message[this._exposes])
            this.emit('state', message[this._exposes])
        }
    }
}

export class ExposesNumber extends ExposesZigbee<number> {
}

export class ExposesString extends ExposesZigbee<string> {
}

export class ExposesBoolean extends ExposesZigbee<boolean> {
}



export class ExposesSeteableNumber extends ExposesNumber {
    private device: SwitchZigbee

    max: number
    min: number

    constructor(device: SwitchZigbee, max, min) {
        super()
        this.max = max
        this.min = min
        this.device = device
    }

    set(level: number) {
        if (this.isValidValue(level)) {
            this.device.setOn({ [this._exposes]: level });
        }
    }

    private isValidValue(value: number): boolean {
        if (
            value > this.max &&
            value < this.min
        ) {
            telegram.warning(
                `Brightness value ${value} out of bounds for light ${this.device.name}`,
            );
            return false;
        }
        return true;
    }


}