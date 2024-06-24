import { Sun } from "../../../src/components/sun"
import { client } from "../../../src/mqtt"
import { BASE_TOPIC } from "../../../src/topics";
jest.useFakeTimers()

jest.mock('../../../src/mqtt', () => ({
    client: {
        publish: jest.fn((newTopic: string, newPayload: string) => { })
    }
}));

describe('Sun', () => {
    var sun: Sun
    var calls: Record<string, string> = {};

    beforeAll(async () => {
        sun = new Sun(41.3831173, 2.1640883);
        jest.runOnlyPendingTimers();
        (client.publish as jest.Mock).mock.calls.forEach(element => {
            calls[element[0]] = element[1]
        });
    })

    it('should notify of sun changes', async () => {
        expect(calls[BASE_TOPIC + "sun/sunset"]).toStrictEqual("now")
        expect(calls[BASE_TOPIC + "sun/sunrise"]).toStrictEqual("now")
    })

    it('should publish sun times', async () => {
        expect(calls[BASE_TOPIC + "sun/sunset/time"]).toStrictEqual(sun.nextSunset.toISOString())
        expect(calls[BASE_TOPIC + "sun/sunrise/time"]).toStrictEqual(sun.nextSunrise.toISOString())
    })
})