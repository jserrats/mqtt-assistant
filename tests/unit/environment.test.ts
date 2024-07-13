import { getEnvVariable } from "../../src/environment";


describe("index", () => {
	it("should throw an error when the env does not exist", async () => {
		const t = () => { getEnvVariable("681e567f-8032-45b4-acea-618a6c28bd72") }
		expect(t).toThrow("Missing environment variable 681e567f-8032-45b4-acea-618a6c28bd72")
	});

	it("should retrieve env variables", async () => {
		process.env["681e567f-8032-45b4-acea-618a6c28bd72"] = "TEST_VALUE"
		expect(getEnvVariable("681e567f-8032-45b4-acea-618a6c28bd72")).toStrictEqual("TEST_VALUE")
	});
});