'use strict';

const perfy = require('perfy');
const perfOverall = 'jcr:overall';

/**
 *  Test Suite Stats
 *  @author   Onur Yıldırım <onur@cutepilot.com>
 *  @license  MIT
 */
class TestStats {

    constructor(options) {
        this.reset();
        this.options = options || {};
    }

    get elapsed() {
        return String((this.perf || {}).time || 0);
    }

    _getSpecTime(perfyResult) {
        const num = perfyResult.fullMilliseconds;
        const time = { str: '', num };
        if (this.options.timeUnit === 's') {
            time.str = String(perfyResult.time) + 's';
        } else if (this.options.timeUnit === 'ns') {
            time.str = String(perfyResult.fullMilliseconds) + 'ms';
        } else {
            time.str = (num < 0.5 && num > 0 ? '<1' : num.toFixed(0)) + 'ms';
        }
        return time;
    }

    reset() {
        this.failedSpecList = [];
        this.pendingSpecList = [];
        this.failedSuiteList = [];
        this.failures = 0;
        this.suites = {
            total: 0,
            disabled: 0,
            failed: 0
        };
        this.specs = {
            defined: 0,
            total: 0,
            failed: 0,
            passed: 0,
            pending: 0,
            disabled: 0,
            excluded: 0
        };
        this.expects = {
            total: 0,
            failed: 0,
            passed: 0
        };
        perfy.destroy(perfOverall);
        this.perf = null;
    }

    get executedSpecs() {
        return this.specs.total - (this.specs.pending + this.specs.disabled + this.specs.excluded);
    }

    init(summary) {
        this.reset();
        perfy.start(perfOverall);
        this.specs.defined = summary.totalSpecsDefined;
        return this;
    }

    addSuite() { // (suite)
        this.suites.total++;
        return this;
    }

    updateSuite(suite) {
        if (suite.status === 'disabled') {
            this.suites.disabled++;
        }

        const failed = suite.failedExpectations || [];
        if (failed.length > 0) {
            this.failedSuiteList.push(suite);
            this.suites.failed++;
            this.failures++;
        }

        return this;
    }

    addSpec(spec) {
        perfy.start(spec.id);
        this.specs.total++;
        return this;
    }

    updateSpec(spec) {
        spec._time = this._getSpecTime(perfy.end(spec.id));
        this.expects.failed += spec.failedExpectations.length;
        this.expects.passed += spec.passedExpectations.length;
        this.expects.total = (this.expects.failed + this.expects.passed);

        switch (spec.status) {
            case 'pending':
                this.specs.pending++;
                this.pendingSpecList.push(spec);
                break;
            // this is new in Jasmine 2.3.x
            case 'disabled':
                this.specs.disabled++;
                break;
            case 'excluded':
                this.specs.excluded++;
                break;
            case 'failed':
                this.failures++;
                this.specs.failed++;
                this.failedSpecList.push(spec);
                break;
            case 'passed':
                this.specs.passed++;
                break;
            default:
                // unknown status
                break;
        }

        return this;
    }

    done() { // (summary)
        this.perf = perfy.end(perfOverall);
    }

}

module.exports = TestStats;
