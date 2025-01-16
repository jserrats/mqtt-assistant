import { client } from "../../../mqtt";
import { router } from "../../../router";
import { ESPHOME_TOPIC } from "../../../topics";
import { type InboundAvailability, MonitorESPHome } from "../monitor";

jest.mock("../../../../src/mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => {
			router.route(newTopic, newPayload);
		}),
	},
}));

describe("ESPHomeMonitor", () => {
	let esphomeMonitor: MonitorESPHome;

	beforeAll(async () => {
		esphomeMonitor = new MonitorESPHome(["ignored"]);
	});

	afterEach(async () => {
		(client.publish as jest.Mock).mockClear();
	});

	it("should notify when a ESPHome component disconnects", async () => {
		client.publish(
			`${ESPHOME_TOPIC}test1/status`,
			"offline" as InboundAvailability,
		);
		expect((client.publish as jest.Mock).mock.calls[1][0]).toStrictEqual(
			"notify/telegram/warning",
		);
	});

	it("should not notify when a ESPHome component is online without being offline before", async () => {
		client.publish(
			`${ESPHOME_TOPIC}test2/status`,
			"online" as InboundAvailability,
		);
		expect((client.publish as jest.Mock).mock.calls).toHaveLength(1);
	});

	it("should notify when a ESPHome component connects after being disconnected", async () => {
		client.publish(
			`${ESPHOME_TOPIC}test1/status`,
			"online" as InboundAvailability,
		);
		expect((client.publish as jest.Mock).mock.calls).toHaveLength(2);
	});

	it("should not notify again", async () => {
		client.publish(
			`${ESPHOME_TOPIC}test1/status`,
			"online" as InboundAvailability,
		);
		expect((client.publish as jest.Mock).mock.calls).toHaveLength(1);
	});

	it("should ignore blacklisted devices", async () => {
		client.publish(
			`${ESPHOME_TOPIC}ignored/status`,
			"offline" as InboundAvailability,
		);
		expect((client.publish as jest.Mock).mock.calls).toHaveLength(1);
	});
});
