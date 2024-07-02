export type Trigger = {
	topic: string;
	payload: string;
};

export type Automation = {
	trigger: Trigger;
	callback: CallableFunction;
};

export type AutomationMultipleTriggers = {
	trigger: Trigger[];
	callback: CallableFunction;
};
