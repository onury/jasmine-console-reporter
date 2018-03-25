'use strict';

/**
 *  Test Suite Stats
 *  @author   Onur Yıldırım <onur@cutepilot.com>
 *  @license  MIT
 */
class TestStats {

    constructor() {
        this.reset();
    }

    get elapsed() {
        const t = (this.endTime - this.startTime) / 1000;
        return t.toFixed(3);
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
    }

    get executedSpecs() {
        return this.specs.total - (this.specs.pending + this.specs.disabled + this.specs.excluded);
    }

    init(summary) {
        this.reset();
        this.startTime = Date.now();
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

    addSpec() { // (spec)
        this.specs.total++;
        return this;
    }

    updateSpec(spec) {
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
        this.endTime = Date.now();
    }

}

module.exports = TestStats;
