import { Sun } from "../../../src/components/sun";
import { client } from "../../../src/mqtt";
import { BASE_TOPIC } from "../../../src/topics";
jest.useFakeTimers();

jest.mock("../../../src/mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => {}),
	},
}));

describe("Sun", () => {
	let sun: Sun;
	const calls: Record<string, string> = {};

	beforeAll(async () => {
		sun = new Sun(41.3831173, 2.1640883);
		(client.publish as jest.Mock).mock.calls.forEach((element) => {
			calls[element[0]] = element[1];
		});
	});

	it("should notify of sun changes", async () => {
		console.log(calls);
		expect(calls["weather/sun"]).toBeDefined();
	});

	it("should publish sun times", async () => {
		expect(calls["weather/sun/sunset"]).toStrictEqual(
			sun.nextSunset.toISOString(),
		);
		expect(calls["weather/sun/sunrise"]).toStrictEqual(
			sun.nextSunrise.toISOString(),
		);
	});
});
