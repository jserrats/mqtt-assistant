export { router } from "./router";
export {
	zigbee,
	esphome,
	Timer,
	Sun,
	Alarm,
	telegram,
	Weather,
} from "./components";

import { telegram } from "./components";

export function getEnvVariable(varName: string) {
	if (process.env[varName] === undefined) {
		const error = new Error(`Missing environment variable ${varName}`);
		telegram.sendError(error);
		throw error;
	}
	return process.env[varName];
}
