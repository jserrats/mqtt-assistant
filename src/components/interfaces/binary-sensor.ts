import type { Trigger } from "../../types";

export interface BinarySensor {
	state?: boolean;
	trigger: Record<string, Trigger>;
}
