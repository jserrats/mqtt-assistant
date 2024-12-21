import type { Stateful } from "../../../interfaces/stateful";
import { StatefulESPHomeDevice } from "../../esphome";

export class BaseESPHomeSensor<T extends boolean | string | number>
	extends StatefulESPHomeDevice<T>
	implements Stateful {}
