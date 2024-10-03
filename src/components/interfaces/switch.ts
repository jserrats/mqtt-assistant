export interface Switch {
	state: boolean;
	setOn(): void;
	setOff(): void;
	toggle(): void;
}
