export interface Eventful {
	on(eventName: string | symbol, listener: (...args: any[]) => void): this;
	emit(eventName: string | symbol, ...args: any): boolean;
}
