import { client } from "../../../src/mqtt"
import { router } from "../../../src/router"
import { Timer, secondsToHms } from "../../../src/components/timer"
import { BASE_TOPIC } from "../../../src/topics";

jest.mock('../../../src/mqtt', () => ({
    client: {
        publish: jest.fn((newTopic: string, newPayload: string) => { router.route(newTopic, newPayload) })
    }
}));


jest.useFakeTimers()

describe('Timer', () => {

    it('should trigger when the timer ends', async () => {
        var timer = new Timer()
        const mockCallback = jest.fn();
        timer.setTimeout({ seconds: 10 }, mockCallback)
        jest.runOnlyPendingTimers();
        expect(mockCallback).toHaveBeenCalled()
    })

    it('should publish countdown time', async () => {
        var timer = new Timer()
        const mockCallback = jest.fn();
        timer.setTimeout({ seconds: 10 }, mockCallback, { publishTopic: "test" })
        jest.runOnlyPendingTimers();
        expect((client.publish as jest.Mock).mock.calls).toHaveLength(40)
    })

    it('time formatting should adjust', async () => {
        expect(secondsToHms(60 * 60 * 2 - 1)).toStrictEqual("1h 59m")
        expect(secondsToHms(60 * 60 - 1)).toStrictEqual("59m 59s")
        expect(secondsToHms(59)).toStrictEqual("59s")
    })

})