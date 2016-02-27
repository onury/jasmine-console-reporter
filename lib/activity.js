/**
 *  Activity Logger
 *  @author   Onur Yıldırım (onur@cutepilot.com)
 *  @license  MIT
 */
module.exports = (function () {
    'use strict';

    // ---------------------------
    //  CLASS: Activity
    // ---------------------------

    function defaultLogger() {
        process.stdout.write.apply(process.stdout, arguments);
    }

    // example:
    // var activity = new Activity(80);
    // activity.start('* please wait...');
    // asterisk will be replaced with rotating line animation (\ | / —) on
    // each interval. For ANSI codes, see:
    // http://academic.evergreen.edu/projects/biophysics/technotes/program/ansi_esc.htm
    function Activity(interval, log) {
        this._ticks = 0;
        this._interval = interval || 60;
        this.running = false;
        this._log = typeof log !== 'function'
            ? defaultLogger
            : log;
    }

    Activity.prototype.stop = function () {
        if (this._timer) {
            clearInterval(this._timer);
            this._timer = null;
        }
        // clear the full title
        if (this.running) {
            this._log('\x1B[u\r\x1B[K');
        }
        this.running = false;
        this._ticks = 0;
        this._row = null;
    };

    function _activityRun() {
        this._ticks += 1;
        var rotate = ['\\', '|', '/', '-'],
            c = rotate[this._ticks % 4],
            title = this.title ?
                this.title.replace(/\*/g, c)
                : c;
        // move cursor to last saved position, clear line and update activity
        // title.
        this._log('\x1B[u' + title);
    }

    Activity.prototype.start = function (title) {
        var $this = this;
        $this.stop();
        $this.title = title;
        $this.running = true;
        // save cursor position
        this._log('\x1B[s');
        $this._timer = setInterval(function () {
            _activityRun.apply($this);
        }, $this._interval);
    };

    return Activity;

})();
