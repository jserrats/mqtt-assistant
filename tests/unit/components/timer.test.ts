import { client } from "../../../src/mqtt"
import { router } from "../../../src/router"
import { Timer } from "../../../src/components/timer"
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

})