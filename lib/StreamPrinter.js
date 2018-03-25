'use strict';

// dep modules
const Spinner = require('ora');
const ci = require('ci-info');

/**
 *  Stream Printer
 *  @author   Onur Yıldırım <onur@cutepilot.com>
 *  @license  MIT
 */
class StreamPrinter {

    constructor(options = {}) {
        this.options = Object.assign({
            stream: process.stdout,
            spinner: 'dots',
            emoji: true
        }, options);
        this.stream = this.options.stream;
        this.spinner = new Spinner(this.options);
    }

    spin(str) {
        this.spinner.start(str);
    }

    spinStop() {
        this.spinner.stop();
    }

    str(...args) {
        if (args.length) {
            this.stream.write(...args);
        }
        return this;
    }

    line(...args) {
        this.stream.write('\n');
        this.str(...args);
        return this;
    }

    newLine(num = 1) {
        this.stream.write(new Array(num + 1).join('\n'));
        return this;
    }

    clearLine(num = 1) {
        if (!this.stream.isTTY) return this;

        num = num < 1 ? 1 : num;
        for (let i = 0; i < num; i++) {
            if (i > 0) {
                this.stream.moveCursor(0, -1);
            }
            this.stream.clearLine();
            this.stream.cursorTo(0);
        }
        return this;
    }

    moveCursor(x, y) {
        this.stream.moveCursor(x, y);
    }

    cursorTo(x, y) {
        this.stream.cursorTo(x, y);
    }

    beep() {
        if (!this.stream.isTTY || ci.isCI) return;
        this.stream.write('\u0007');
    }
}

module.exports = StreamPrinter;
