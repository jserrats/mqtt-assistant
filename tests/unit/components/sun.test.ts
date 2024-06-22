import { Sun } from "../../../src/components/sun"
import { client } from "../../../src/mqtt"

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

        (client.publish as jest.Mock).mock.calls.forEach(element => {
            calls[element[0]] = element[1]
        });
    })

    it('should notify of sun changes', async () => {
        expect(calls["automations/sun/sunset"]).toStrictEqual("now")
        expect(calls["automations/sun/sunrise"]).toStrictEqual("now")
    })

    it('should publish sun times', async () => {
        expect(calls["automations/sun/sunset/time"]).toStrictEqual(sun.nextSunset.toISOString())
        expect(calls["automations/sun/sunrise/time"]).toStrictEqual(sun.nextSunrise.toISOString())
    })
})