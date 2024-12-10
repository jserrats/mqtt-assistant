import type { Switch } from "./switch";

export interface Light extends Switch {}

export interface BrightLight extends Light {
	brightness: {
		max: number;
		min: number;
		set(level: number): void;
	};
}

export interface TemperatureLight extends BrightLight {
	colorTemp: {
		max: number;
		min: number;
		set(level: number): void;
	};
}
