/**
 *  Simple Timer
 *  @author   Onur Yıldırım (onur@cutepilot.com)
 *  @license  MIT
 */
module.exports = (function () {
    'use strict';

    // ---------------------------
    //  CLASS: Timer
    // ---------------------------

    function Timer() {
        this._startTime = 0;
        this._endTime = 0;
    }

    Timer.prototype.start = function () {
        this._startTime = Date.now();
    };

    Timer.prototype.stop = function () {
        this._endTime = Date.now();
    };

    Timer.prototype.elapsed = function () {
        this.stop();
        var t = (this._endTime - this._startTime) / 1000;
        return t.toFixed(3);
    };

    return Timer;

})();
