import { Stateful } from "./stateful";

export interface NumericSensor extends Stateful {
    get state(): number;
    unit: string
    toString()
}
