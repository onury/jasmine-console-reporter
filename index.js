/**
 *  Jasmine Console Reporter
 *  @author   Onur Yıldırım (onur@cutepilot.com)
 *  @license  MIT
 */
module.exports = (function () {
    'use strict';

    // Own modules
    const Timer = require('./lib/timer');
    const Activity = require('./lib/activity');
    const utils = require('./lib/utils');

    // Dep modules
    const chalk = require('chalk');
    const ansiStyle = require('ansi-styles');

    // ---------------------------
    //  UTILITY METHODS
    // ---------------------------

    function log() {
        process.stdout.write.apply(process.stdout, arguments);
    }

    // ---------------------------
    //  CLASS: JasmineConsoleReporter
    // ---------------------------

    function JasmineConsoleReporter(options) {
        this.name = 'Jasmine Console Reporter';

        options = options || {};
        options.verbosity = utils.optionBoolToNum(options.verbosity, 4, 0);
        options.cleanStack = utils.optionBoolToNum(options.cleanStack, 1, 0);
        options.colors = utils.optionBoolToNum(options.colors, 1, 0);

        // extend options with defaults
        options = utils.extend({
            colors: 1,     // 0 to 2
            cleanStack: 1, // 0 to 3
            verbosity: 4,  // 0 to 4
            activity: false,
            listStyle: 'indent'
        }, options);

        const report = {
            listAll: options.verbosity >= 4, // also list disabled specs
            list: options.verbosity >= 3,
            pendingSpecs: options.verbosity >= 2,
            stats: options.verbosity >= 1,
            none: options.verbosity <= 0
        };

        const listStyle = {
            flat: options.listStyle === 'flat',
            indent: options.listStyle === 'indent'
        };

        const printer = options.print || log;
        let timer = new Timer();
        let activity = options.activity
            ?  new Activity(null, log)
            : null;

        const failedSpecList = [];
        const pendingSpecList = [];
        const failedSuiteList = [];
        const stats = {
            failures: 0,
            suites: {
                total: 0,
                disabled: 0,
                failed: 0
            },
            specs: {
                defined: 0,
                total: 0,
                failed: 0,
                passed: 0,
                pending: 0,
                disabled: 0
            },
            expects: {
                total: 0,
                failed: 0,
                passed: 0
            }
        };
        // Keeping track of suite (describe) nest levels.
        let depth = -1;
        // Just keeping a flag to determine whether an extra new line is
        // needed when there is a remaining spec after a nested suite is
        // finished.
        let isSuiteDone = false;
        const INDENT_CHAR = ' ';
        const INDENT_UNIT = 3;

        // ---------------------------
        //  HELPER METHODS
        // ---------------------------

        function styleFactory(color) {
            return function (str) {
                switch (options.colors) {
                    case 2: // ANSI colors
                        return ansiStyle[color].open + str + ansiStyle[color].close;
                    case 1:
                        return chalk[color](str);
                    default:
                        return str;
                }
            };
        }

        // ansi styles
        var style = {
            green: styleFactory('green'),
            red: styleFactory('red'),
            yellow: styleFactory('yellow'),
            // blue: styleFactory('blue'),
            cyan: styleFactory('cyan'),
            white: styleFactory('white'),
            gray: styleFactory('gray'),
            underline: styleFactory('underline')
        };

        const print = {
            str: function () {
                printer.apply(printer, arguments);
            },
            line: function () {
                printer('\n');
                if (arguments.length) {
                    printer.apply(printer, arguments);
                }
            },
            newLine: function (num) {
                num = num || 1;
                printer(new Array(num + 1).join('\n'));
            },
            // return: function () {
            //     printer('\r');
            //     if (arguments.length) {
            //         printer.apply(printer, arguments);
            //     }
            // },
            suite: function (suite) {
                if (!report.list) return;
                depth = depth || 0;
                const ind = listStyle.indent
                    ? utils.repeat(INDENT_CHAR, depth * INDENT_UNIT)
                    : '';
                const title = style.cyan(stats.suites.total + ') ' + suite.description);
                print.line(ind + title);
            },
            spec: function (spec) {
                // console.log('spec', spec.description, spec.status);
                if (!report.list) return;
                depth = depth || 0;
                let title = '';
                const ind = listStyle.indent
                    ? utils.repeat(INDENT_CHAR, (depth + 1) * INDENT_UNIT)
                    : '';

                switch (spec.status) {
                    case 'pending':
                        title = style.yellow(utils.symbol('warning') + ' ' + spec.description);
                        break;
                    case 'disabled':
                        // we don't print disableds if verbosity < 4
                        if (!report.listAll) {
                            // clear the new line printed on spec-start
                            print.clearLine();
                            return;
                        }
                        title = style.gray(utils.symbol('disabled') + ' ' + spec.description);
                        break;
                    case 'failed':
                        var fc = spec.failedExpectations.length,
                            f = ' (' + fc + ' ' + utils.plural('failure', fc) + ')';
                        title = style.red(utils.symbol('error') + ' ' + spec.description + f);
                        break;
                    case 'passed':
                        title = style.green(utils.symbol('success') + ' ' + spec.description);
                        break;
                    default:
                        // unknown status
                        break;
                }

                print.str(ind + title);
            },
            end: function () {
                if (report.list) {
                    print.newLine(2);
                }
                print.str(style.gray('>> Done!'));
                print.newLine();
            },
            clearLine: function (num) {
                num = typeof num !== 'number' ? 1 : num;
                num = num < 1 ? 1 : num;
                let i;
                for (i = 0; i < num; i++) {
                    process.stdout.clearLine(0);
                    process.stdout.moveCursor(0, -1);
                }
            }
        };

        // ---------------------------
        //  REPORT METHODS
        // ---------------------------

        function specFailureDetails(spec, num) {
            print.line(style.red(num + ') '));
            const title = spec.fullName.replace(spec.description, ': ' + spec.description);
            print.str(style.cyan(title));
            let i, failedExpectation, errInfo;
            for (i = 0; i < spec.failedExpectations.length; i++) {
                failedExpectation = spec.failedExpectations[i];
                if (failedExpectation.stack) {
                    errInfo = utils.reStack(failedExpectation.stack, options.cleanStack, style);
                } else {
                    errInfo = 'Error: ' + (failedExpectation.message || 'Unknown Error');
                    errInfo = style.red(errInfo);
                }
                print.line(utils.indent(errInfo, INDENT_UNIT));
            }
            print.newLine();
        }

        function specPendingDetails(spec, num) {
            print.line(style.yellow(num + ') '));
            const title = spec.fullName.replace(spec.description, ': ' + spec.description);
            print.str(style.cyan(title));
            const pendingReason = spec.pendingReason
                ? style.yellow('Reason: ' + spec.pendingReason)
                : style.gray('(No pending reason)');
            print.line(utils.indent(pendingReason, INDENT_UNIT));
            print.newLine();
        }

        function suiteFailureDetails(suite) {
            let i, failedExpectation, stack;
            for (i = 0; i < suite.failedExpectations.length; i++) {
                failedExpectation = suite.failedExpectations[i];
                print.line(style.red('>> An error was thrown in an afterAll'));
                stack = utils.reStack(failedExpectation.stack, options.cleanStack, style);
                print.line(utils.indent(stack, INDENT_UNIT));
            }
            print.newLine(2);
        }

        function finalReport() {
            let i;
            const seconds = timer.elapsed();

            if (failedSpecList.length > 0) {
                print.line(style.red(style.underline('Failed Specs')) + style.red(':'));
                print.newLine();
                for (i = 0; i < failedSpecList.length; i++) {
                    specFailureDetails(failedSpecList[i], i + 1);
                }
            }

            if (report.pendingSpecs && pendingSpecList.length > 0) {
                print.line(style.yellow(style.underline('Pending Specs')) + style.yellow(':'));
                print.newLine();
                for (i = 0; i < pendingSpecList.length; i++) {
                    specPendingDetails(pendingSpecList[i], i + 1);
                }
            }

            // verbosity >= 2
            // if (report.pendingSpecs) { }

            if (report.stats) {
                print.line(style.white(style.underline('Summary') + ':'));
                print.newLine();

                if (stats.specs.total > 0) {
                    const executedSuites = stats.suites.total - stats.suites.disabled;
                    print.line('Suites:  ' + style.white(executedSuites) + ' of ' + stats.suites.total);
                    if (stats.suites.disabled) {
                        print.str(style.yellow(' (' + stats.suites.disabled + ' disabled)'));
                    }

                    const executedSpecs = stats.specs.total - (stats.specs.pending + stats.specs.disabled);
                    print.line('Specs:   ' + style.white(executedSpecs) + ' of ' + stats.specs.defined);
                    const specsInfo = [];
                    if (stats.specs.pending) {
                        specsInfo.push(stats.specs.pending + ' pending');
                    }
                    // var disabledSpecs = stats.specs.defined - stats.specs.total;
                    if (stats.specs.disabled > 0) {
                        specsInfo.push(stats.specs.disabled + ' disabled');
                    }
                    if (specsInfo.length) {
                        print.str(style.yellow(' (' + specsInfo.join(', ') + ')'));
                    }

                    print.line('Expects: ' + style.white(stats.expects.total));
                    const fc = stats.expects.failed;
                    let f = ' (' + fc + ' ' + utils.plural('failure', fc) + ')';
                    if (fc > 0) {
                        f = style.red(f);
                    }
                    print.str(f);

                } else {
                    print.str(style.yellow('No specs executed.'));
                }

                print.line(style.gray('Finished in ' + seconds + ' ' + utils.plural('second', seconds)));
                print.newLine(2);
            } else {
                print.newLine();
            }

            for (i = 0; i < failedSuiteList.length; i++) {
                suiteFailureDetails(failedSuiteList[i]);
            }
        }

        // ---------------------------
        //  CLASS METHODS
        // ---------------------------

        this.jasmineStarted = function (summary) {
            stats.suites.total = 0;
            stats.specs.total = 0;
            stats.failures = 0;

            print.newLine();
            stats.specs.defined = summary.totalSpecsDefined;
            print.str('>> Executing ' + summary.totalSpecsDefined + ' defined specs...');
            print.newLine();
            timer.start();

            if (report.list) {
                print.line(style.cyan(style.underline('Test Suites & Specs')) + style.cyan(':'));
                print.newLine();
            }
        };

        this.suiteStarted = function (suite) {
            depth++;

            const isFirstSuite = !stats.suites.total;
            if (!isFirstSuite && report.list) {
                print.newLine();
            }
            stats.suites.total++;

            print.suite(suite);
            isSuiteDone = false;
        };

        this.suiteDone = function (suite) {
            const disabled = suite.status === 'disabled';

            if (disabled) {
                stats.suites.disabled++;
                // if (report.list) {
                //     // if suite is disabled, print extra info and line.
                //     print.str(style.gray(' (disabled)'));
                //     // print.newLine();
                // }
            }

            depth--;

            const failed = suite.failedExpectations || [];
            if (failed.length > 0) {
                failedSuiteList.push(suite);
                stats.suites.failed++;
                stats.failures++;
            }
            isSuiteDone = true;
        };

        this.specStarted = function (spec) {
            if (report.list) {
                print.newLine(isSuiteDone ? 2 : 1);
            }

            // show the activity animation and current spec to be executed, if
            // enabled.
            if (options.activity && activity) {
                const ind = report.list && listStyle.indent
                    ? utils.repeat(INDENT_CHAR, (depth + 1) * INDENT_UNIT)
                    : '';
                activity.start(ind + '* ' + style.gray(spec.description));
            }
        };

        this.specDone = function (spec) {

            if (options.activity && activity) activity.stop();

            stats.specs.total++;
            stats.expects.failed += spec.failedExpectations.length;
            stats.expects.passed += spec.passedExpectations.length;
            stats.expects.total = (stats.expects.failed + stats.expects.passed);

            switch (spec.status) {
                case 'pending':
                    stats.specs.pending++;
                    pendingSpecList.push(spec);
                    break;
                // this is new in Jasmine 2.3.x
                case 'disabled':
                    stats.specs.disabled++;
                    break;
                case 'failed':
                    stats.failures++;
                    stats.specs.failed++;
                    failedSpecList.push(spec);
                    break;
                case 'passed':
                    stats.specs.passed++;
                    break;
                default:
                    // unknown status
                    break;
            }

            print.spec(spec);
        };

        this.jasmineDone = function () { // (summary)
            print.end();
            print.newLine();
            finalReport();
            if (activity) activity = null;
            if (timer) timer = null;
        };

    }

    // ---------------------------
    //  EXPORT
    // ---------------------------

    return JasmineConsoleReporter;

})();
