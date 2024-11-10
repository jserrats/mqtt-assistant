import { router } from "../../../../../router";
import {
	ClosureSensorZigbee,
} from "../closure";

jest.mock("../../../../../mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => { }),
	},
}));

describe("ClosureSensorZigbee", () => {
	it("should trigger the callback", async () => {
		const mockCallback = jest.fn();

		const sensor = new ClosureSensorZigbee("test");
		sensor.closure.on('state', (value) => { expect(value).toBeTruthy(); mockCallback() })
		router.route(
			sensor.topic,
			JSON.stringify({ closure: true }),
		);

		expect(mockCallback).toHaveBeenCalled();
	});

	it("should update the closure correctly", async () => {
		const sensor = new ClosureSensorZigbee("test2");
		expect(sensor.closure.state).toBeUndefined();
		router.route(
			sensor.topic,
			JSON.stringify({ closure: true }),
		);
		expect(sensor.closure.state).toBeTruthy();
		router.route(
			sensor.topic,
			JSON.stringify({ closure: false }),
		);
		expect(sensor.closure.state).toBeFalsy();
	});

	it("should also update the closure correctly if inverted", async () => {
		const sensor = new ClosureSensorZigbee("test3", true);
		expect(sensor.closure.state).toBeUndefined();

		router.route(
			sensor.topic,
			JSON.stringify({ closure: true }),
		);
		expect(sensor.closure.state).toBeFalsy();

		router.route(
			sensor.topic,
			JSON.stringify({ closure: false }),
		);
		expect(sensor.closure.state).toBeTruthy();
	});

	//TODO: fix this test
	// it("should emit the correct states", async () => {
	// 	const mockCallbackTrue = jest.fn();
	// 	const mockCallbackFalse = jest.fn();


	// 	const sensor = new ClosureSensorZigbee("test");

	// 	sensor.closure.once('state', (value) => { expect(value).toBeTruthy(); mockCallbackTrue() })
	// 	router.route(
	// 		sensor.topic,
	// 		JSON.stringify({ closure: true }),
	// 	);
	// 	expect(mockCallbackTrue).toHaveBeenCalled();

	// 	sensor.closure.once('state', (value) => { expect(value).toBeFalsy(); mockCallbackFalse() })
	// 	router.route(
	// 		sensor.topic,
	// 		JSON.stringify({ closure: false }),
	// 	);
	// 	expect(mockCallbackFalse).toHaveBeenCalled();
	// });
});
