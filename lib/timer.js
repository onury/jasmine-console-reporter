/**
 *  Simple Timer
 *  @author   Onur Yıldırım (onur@cutepilot.com)
 *  @license  MIT
 */
module.exports = (function () {
    'use strict';

    function Timer() {
        this.startTime = 0;
        this.endTime = 0;
    }

    Timer.prototype.start = function () {
        this.startTime = Date.now();
    };

    Timer.prototype.stop = function () {
        this.endTime = Date.now();
    };

    Timer.prototype.elapsed = function () {
        this.stop();
        const t = (this.endTime - this.startTime) / 1000;
        return t.toFixed(3);
    };

    return Timer;

})();
