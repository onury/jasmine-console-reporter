'use strict';

// dep modules
const ci = require('ci-info');
// own modules
const StreamPrinter = require('./lib/StreamPrinter');
const StyleFactory = require('./lib/StyleFactory');
const TestStats = require('./lib/TestStats');
const utils = require('./lib/utils');

const INDENT_CHAR = ' ';
const INDENT_UNIT = 3;

/**
 *  Jasmine Console Reporter
 *  @author   Onur Yıldırım <onur@cutepilot.com>
 *  @license  MIT
 */
class JasmineConsoleReporter {

    constructor(options = {}) {
        options.verbosity = utils.optionBoolToNum(options.verbosity, 4, 0);
        options.cleanStack = utils.optionBoolToNum(options.cleanStack, 1, 0);
        options.colors = utils.optionBoolToNum(options.colors, 1, 0);

        this.options = Object.assign({
            colors: 1,              // 0 to 2
            cleanStack: 1,          // 0 to 3
            verbosity: 4,           // 0 to 4
            activity: false,        // bool or string ("dots")
            listStyle: 'indent',    // "indent"|"flat"
            emoji: true,
            beep: true
        }, options);

        // disable emojis on CI platforms
        if (ci.isCI) this.options.emoji = false;

        const pOpts = typeof options.activity === 'string'
            ? { spinner: options.activity }
            : undefined;
        this.print = new StreamPrinter(pOpts);
        this.style = StyleFactory.create(this.options);
        this.stats = new TestStats();

        this.report = {
            listAll: options.verbosity >= 4, // also list disabled specs and some additional info
            list: options.verbosity >= 3,
            pendingSpecs: options.verbosity >= 2,
            stats: options.verbosity >= 1,
            none: options.verbosity <= 0
        };

        // Keeping track of suite (describe) nest levels.
        this._depth = -1;
        // Just keeping a flag to determine whether an extra new line is
        // needed when there is a remaining spec after a nested suite is
        // finished.
        this._isSuiteDone = false;
    }

    _specFailureDetails(spec, num) {
        this.print.line(this.style.red(num + '. '));
        const title = spec.fullName.replace(spec.description, ': ' + spec.description);
        this.print.str(this.style.cyan(title));
        let i, failedExpectation, errInfo;
        for (i = 0; i < spec.failedExpectations.length; i++) {
            failedExpectation = spec.failedExpectations[i];
            if (failedExpectation.stack) {
                errInfo = utils.restack(failedExpectation, this.options.cleanStack, this.style);
            } else {
                errInfo = 'Error: ' + (failedExpectation.message || 'Unknown Error');
                errInfo = this.style.red(errInfo);
            }
            this.print.line(utils.indent(errInfo, INDENT_UNIT));
        }
        this.print.newLine();
    }

    _specPendingDetails(spec, num) {
        this.print.line(this.style.yellow(num + '. '));
        const title = spec.fullName.replace(spec.description, ': ' + spec.description);
        this.print.str(this.style.cyan(title));
        const pendingReason = spec.pendingReason
            ? this.style.yellow('Reason: ' + spec.pendingReason)
            : this.style.gray('(No pending reason)');
        this.print.line(utils.indent(pendingReason, INDENT_UNIT));
        this.print.newLine();
    }

    _suiteFailureDetails(suite) {
        suite.failedExpectations.forEach(ex => {
            this.print.line(this.style.red('>> An error was thrown in an afterAll'));
            const stack = utils.restack(ex, this.options.cleanStack, this.style);
            this.print.line(utils.indent(stack, INDENT_UNIT));
        });
        this.print.newLine(2);
    }

    _finalReport(doneSummary) {
        if (this.stats.failedSpecList.length > 0) {
            this.print.line(this.style.white(this.style.underline('Failed Specs')) + this.style.white(':'));
            this.print.newLine();
            this.stats.failedSpecList.forEach((spec, index) => {
                this._specFailureDetails(spec, index + 1);
            });
        }

        if (this.report.pendingSpecs && this.stats.pendingSpecList.length > 0) {
            this.print.line(this.style.white(this.style.underline('Pending Specs')) + this.style.white(':'));
            this.print.newLine();
            this.stats.pendingSpecList.forEach((spec, index) => {
                this._specPendingDetails(spec, index + 1);
            });
        }

        // verbosity >= 2
        // if (report.pendingSpecs) { }

        if (this.report.stats) {
            this.print.line(this.style.white(this.style.underline('Summary') + ':'));
            this.print.newLine();

            if (doneSummary && doneSummary.overallStatus) {
                const status = doneSummary.overallStatus;
                const oStyle = this.style.fromKeyword(status);
                this.print.line(this.style.emoji[status + 'Status'] + oStyle(utils.capitalize(status)));
                if (doneSummary.incompleteReason) {
                    this.print.str(this.style.gray(' (' + doneSummary.incompleteReason + ')'));
                }
            }

            if (this.stats.specs.total > 0) {
                const executedSuites = this.stats.suites.total - this.stats.suites.disabled;
                this.print.line('Suites:  ' + this.style.white(executedSuites) + ' of ' + this.stats.suites.total);
                if (this.stats.suites.disabled) {
                    this.print.str(this.style.yellow(' (' + this.stats.suites.disabled + ' disabled)'));
                }

                this.print.line('Specs:   ' + this.style.white(this.stats.executedSpecs) + ' of ' + this.stats.specs.defined);
                const specsInfo = [];
                if (this.stats.specs.pending) {
                    specsInfo.push(this.stats.specs.pending + ' pending');
                }

                if (this.stats.specs.disabled > 0) {
                    specsInfo.push(this.stats.specs.disabled + ' disabled');
                }
                if (this.stats.specs.excluded > 0) {
                    specsInfo.push(this.stats.specs.excluded + ' excluded');
                }
                if (specsInfo.length) {
                    this.print.str(this.style.yellow(' (' + specsInfo.join(', ') + ')'));
                }

                let exInfo;
                const totalExpects = this.stats.expects.total;
                this.print.line('Expects: ' + this.style.white(totalExpects));
                if (totalExpects === 0) {
                    exInfo = this.style.yellow(' (none executed)');
                } else {
                    const fc = this.stats.expects.failed;
                    exInfo = ' (' + fc + ' ' + utils.plural('failure', fc) + ')';
                    if (fc > 0) exInfo = this.style.red(exInfo);
                }

                this.print.str(exInfo);
            }

            this.print.line(this.style.gray('Finished in ' + this.stats.elapsed + ' ' + utils.plural('second', this.stats.elapsed)));
            this.print.newLine(2);
        } else {
            this.print.newLine();
        }

        this.stats.failedSuiteList.forEach(suite => {
            this._suiteFailureDetails(suite);
        });

        if (this.options.beep && this.stats.expects.falied > 0) {
            this.print.beep();
        }
    }

    jasmineStarted(summary) {
        this.stats.init(summary);

        this.print.newLine();

        if (summary.totalSpecsDefined === 0) {
            this.print.newLine();
            this.print.str(this.style.emoji.noSpecs + this.style.yellow('No specs defined!'));
            return;
        }

        this.print.str('Executing ' + summary.totalSpecsDefined + ' defined specs...');

        const isRandom = summary.order && summary.order.random;
        if (this.report.stats && isRandom) {
            this.print.newLine();
            this.print.str(this.style.gray('Running in random order... (seed: ' + summary.order.seed + ')'));
        }
        this.print.newLine();

        if (this.report.list) {
            this.print.line(this.style.white(this.style.underline('Test Suites & Specs')) + this.style.white(':'));
            this.print.newLine();
        }
    }

    suiteStarted(suite) {
        this._depth++;
        this.stats.addSuite(suite);

        const isFirstSuite = this.stats.suites.total === 1;
        if (!isFirstSuite && this.report.list) {
            this.print.newLine();
        }

        if (this.report.list) {
            this._depth = this._depth || 0;
            const ind = this.options.listStyle === 'indent'
                ? utils.repeat(INDENT_CHAR, this._depth * INDENT_UNIT)
                : '';
            const title = this.style.cyan(this.stats.suites.total + '. ' + suite.description);
            this.print.line(ind + title);
        }

        this._isSuiteDone = false;
    }

    suiteDone(suite) {
        this.stats.updateSuite(suite);
        this._depth--;
        this._isSuiteDone = true;
    }

    specStarted(spec) {
        this.stats.addSpec(spec);
        if (this.report.list) {
            this.print.newLine(this._isSuiteDone ? 2 : 1);
        }

        // show the activity animation and current spec to be executed, if
        // enabled.
        if (this.options.activity) {
            const ind = this.report.list && this.options.listStyle === 'indent'
                ? utils.repeat(INDENT_CHAR, (this._depth + 1) * INDENT_UNIT)
                : '';
            this.print.spin(ind + this.style.gray(spec.description));
        }
    }

    specDone(spec) {
        this.stats.updateSpec(spec);
        if (this.options.activity) this.print.spinStop();

        if (this.report.list) {
            this._depth = this._depth || 0;
            let title = '';
            const ind = this.options.listStyle === 'indent'
                ? utils.repeat(INDENT_CHAR, (this._depth + 1) * INDENT_UNIT)
                : '';

            switch (spec.status) {
                case 'pending':
                    title = this.style.yellow(this.style.symbol('warning') + ' ' + spec.description);
                    break;
                case 'disabled':
                case 'excluded':
                    // we don't print disableds and exludeds if verbosity < 4
                    if (!this.report.listAll) {
                        // clear the new line printed on spec-start
                        // this.print.clearLine();
                        this.print.clearLine(2);
                        this.print.moveCursor(0, -1);
                        return;
                    }
                    title = this.style.gray(this.style.symbol('disabled') + ' ' + spec.description);
                    break;
                case 'failed': {
                    const fc = spec.failedExpectations.length;
                    const f = ' (' + fc + ' ' + utils.plural('failure', fc) + ')';
                    title = this.style.red(this.style.symbol('error') + ' ' + spec.description + f);
                    break;
                }
                case 'passed':
                    title = this.style.green(this.style.symbol('success') + ' ' + spec.description);
                    break;
                default:
                    // unknown status
                    break;
            }

            this.print.str(ind + title);
        }
    }

    jasmineDone(summary) {
        this.stats.done(summary);

        this.print.newLine();
        if (this.stats.specs.defined > 0) {
            if (this.report.list) this.print.newLine();
            this.print.str(this.style.gray('>> Done!'));
            this.print.newLine(2);
        }

        this._finalReport(summary);
    }
}

module.exports = JasmineConsoleReporter;
