import { client } from "../../mqtt";
import { BASE_TOPIC } from "../../topics";
import { Sun } from "../sun";
jest.useFakeTimers();

jest.mock("../../../src/mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => {}),
	},
}));

describe("Sun", () => {
	let sun: Sun;
	const calls: Record<string, string> = {};

	beforeEach(async () => {
		sun = new Sun(41.3831173, 2.1640883);
	});

	it("should notify of sun changes", async () => {
		expect(
			(client.publish as jest.Mock).mock.calls.some(
				(item) => item[1] === "OFF",
			) ||
				(client.publish as jest.Mock).mock.calls.some(
					(item) => item[1] === "ON",
				),
		).toBeTruthy();

		jest.runOnlyPendingTimers();

		expect((client.publish as jest.Mock).mock.calls).toContainEqual([
			"weather/sun",
			"ON",
			{ retain: true },
		]);
		expect((client.publish as jest.Mock).mock.calls).toContainEqual([
			"weather/sun",
			"OFF",
			{ retain: true },
		]);
	});

	it("should publish sun times", async () => {
		expect(
			(client.publish as jest.Mock).mock.calls.some(
				(item) => item[0] === "weather/sun/sunset",
			),
		).toBeTruthy();
		expect(
			(client.publish as jest.Mock).mock.calls.some(
				(item) => item[0] === "weather/sun/sunrise",
			),
		).toBeTruthy();
	});
});
