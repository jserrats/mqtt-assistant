"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timer = void 0;
const component_1 = require("./component");
const router_1 = require("../router");
class Timer extends component_1.Component {
    timeoutID = setTimeout(() => { });
    intervalID = setInterval(() => { });
    length = 0;
    seconds = 0;
    cancelCallback = () => { };
    publishTopic = "";
    setTimeout(period, callback, options) {
        this.cancelTimeout();
        this.setLength(period);
        if (typeof options !== 'undefined') {
            if (typeof options.cancelTrigger !== 'undefined') {
                this.setCancelTrigger(options.cancelTrigger);
            }
            if (typeof options.publishTopic !== 'undefined') {
                this.publishTopic = options.publishTopic;
                this.intervalID = setInterval(() => {
                    this.seconds = this.seconds + 1;
                    this.publishTime();
                }, 1000);
            }
            if (typeof options.cancelCallback !== 'undefined') {
                this.cancelCallback = options.cancelCallback;
            }
        }
        this.timeoutID = setTimeout(() => { clearInterval(this.intervalID); callback(); }, this.length);
    }
    publishTime() {
        this.client.publish("automations/timer/" + this.publishTopic, this.seconds.toString());
        this.client.publish("automations/timer/" + this.publishTopic + "/countdown", (this.length / 1000 - this.seconds).toString());
        this.client.publish("automations/timer/" + this.publishTopic + "/text", Timer.secondsToHms(this.seconds));
        this.client.publish("automations/timer/" + this.publishTopic + "/text_countdown", Timer.secondsToHms(this.length / 1000 - this.seconds));
    }
    static secondsToHms(seconds) {
        seconds = Number(seconds);
        var h = Math.floor(seconds / 3600);
        var m = Math.floor(seconds % 3600 / 60);
        var s = Math.floor(seconds % 3600 % 60);
        var hDisplay = h > 0 ? h + ("h ") : "";
        var mDisplay = m > 0 ? m + ("m ") : "";
        var sDisplay = s > 0 ? s + ("s") : "";
        return hDisplay + mDisplay + sDisplay;
    }
    cancelTimeout() {
        clearTimeout(this.timeoutID);
        if (this.publishTopic !== "") {
            this.seconds = 0;
            this.publishTime();
        }
        clearInterval(this.intervalID);
    }
    setLength(period) {
        let seconds = 0;
        if (typeof period.seconds !== 'undefined') {
            seconds = period.seconds;
        }
        if (typeof period.minutes !== 'undefined') {
            seconds = period.minutes * 60 + seconds;
        }
        if (typeof period.hours !== 'undefined') {
            seconds = period.hours * 3600 + seconds;
        }
        this.length = seconds * 1000;
    }
    setCancelTrigger(trigger) {
        if (typeof trigger !== 'undefined') {
            if (Array.isArray(trigger)) {
                trigger.forEach((element) => {
                    router_1.router.addAutomation({ trigger: element, callback: () => { this.cancelTimeout(); this.cancelCallback(); } });
                });
            }
            else {
                router_1.router.addAutomation({ trigger: trigger, callback: () => { this.cancelTimeout(); this.cancelCallback(); } });
            }
        }
    }
}
exports.Timer = Timer;
