# jasmine-console-reporter

[![npm](http://img.shields.io/npm/v/jasmine-console-reporter.svg)](https://www.npmjs.com/package/jasmine-console-reporter)
[![release](https://img.shields.io/github/release/onury/jasmine-console-reporter.svg)](https://github.com/onury/jasmine-console-reporter)
[![downloads](http://img.shields.io/npm/dm/jasmine-console-reporter.svg)](https://www.npmjs.com/package/jasmine-console-reporter)
[![dependencies](https://david-dm.org/onury/jasmine-console-reporter.svg)](https://david-dm.org/onury/jasmine-console-reporter)
[![license](http://img.shields.io/npm/l/jasmine-console-reporter.svg)](https://github.com/onury/jasmine-console-reporter/blob/master/LICENSE)
[![maintained](https://img.shields.io/maintenance/yes/2017.svg)](https://github.com/onury/jasmine-console-reporter/graphs/commit-activity)  

> © 2017, Onur Yıldırım ([@onury](https://github.com/onury)). MIT License.

Console Reporter for Jasmine. Outputs detailed test results to the console, with beautiful layout and colors. This is the default reporter of [grunt-jasmine-nodejs][grunt-jn].

Example output:

![Example Screenshot](https://raw.github.com/onury/jasmine-console-reporter/master/screenshots/verbose-report.jpg)

## Installation

```shell
npm install jasmine-console-reporter --save-dev
```
_Jasmine Console Reporter version 2+ requires Node.js v4 or newer. For older, you can install `jasmine-console-reporter@1.2.7`_

## Usage

```js
const JasmineConsoleReporter = require('jasmine-console-reporter');
const reporter = new JasmineConsoleReporter({
    colors: 1,           // (0|false)|(1|true)|2
    cleanStack: 1,       // (0|false)|(1|true)|2|3
    verbosity: 4,        // (0|false)|1|2|(3|true)|4
    listStyle: 'indent', // "flat"|"indent"
    activity: false
});
// pass the initialized reporter to whichever task or host...
```

### Options

| Option   | Description |
| -------- | ----------- |
| <h4>**`colors`**</h4>`Number\|Boolean` | Default: `1`. Specifies whether the output should have colored text. Possible integer values: 0 to 2. Set to `1` (or `true`) to enable colors. Set to `2` to use the [ANSI escape codes](https://www.npmjs.com/package/chalk#chalkstyles). Option `2` can be useful if, for example, you're running your tests from a sub-process, and the colors aren't showing up.            |
| <h4>**`cleanStack`**</h4>`Number\|Boolean` | Default: `1`. Specifies the filter level for the error stacks. Possible integer values: 0 to 3. Set to `1` (or `true`) to only filter out lines with jasmine-core path from stacks. Set to `2` to filter out all `node_modules` paths. Set to `3` to also filter out lines with no file path in it.            |
| <h4>**`verbosity`**</h4>`Number\|Boolean` | Default: `4`. Specifies the verbosity level for the reporter output. Possible integer values: 0 to 4. When a `Boolean` value is passed, `true` defaults to `4` and `false` defaults to `0`. Level 0: reports errors only. Level 1: also displays a summary. Level 2: also reports pending specs. Level 3: additionally displays all suites and specs as a list, except disabled specs. Level 4: also lists disabled specs. (_alias: `verbose`_) |
| <h4>**`listStyle`**</h4>`String` | Default: `"indent"`. Indicates the style of suites/specs list output. Possible values: `"flat"` or `"indent"`. Setting this to `"indent"` provides a better view especially when using nested (describe) suites. This option is only effective when verbosity level is set to `3`, `4` or `true`.            |
| <h4>**`activity`**</h4>`Boolean` | Default: `false`. Specifies whether to enable the activity indicator animation that outputs the current spec that is being executed. If your tests log extra data to console, this option should be disabled or they might be overwritten. |

### Full Example with Jasmine (Node.js)

```js
#!/usr/bin/env node

// setup Jasmine
const Jasmine = require('jasmine');
const jasmine = new Jasmine();
jasmine.loadConfig({
    spec_dir: 'test',
    spec_files: ['**/*[sS]pec.js'],
    helpers: ['helpers/**/*.js'],
    random: false,
    seed: null,
    stopSpecOnExpectationFailure: false
});
jasmine.jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;

// setup console reporter
const JasmineConsoleReporter = require('jasmine-console-reporter');
const reporter = new JasmineConsoleReporter({
    colors: 1,           // (0|false)|(1|true)|2
    cleanStack: 1,       // (0|false)|(1|true)|2|3
    verbosity: 4,        // (0|false)|1|2|(3|true)|4
    listStyle: 'indent', // "flat"|"indent"
    activity: false
});

// initialize and execute
jasmine.env.clearReporters();
jasmine.addReporter(reporter);
jasmine.execute();
```

## Change-Log

See [CHANGELOG.md][changelog].

## License

See [MIT][license].


[changelog]:https://github.com/onury/jasmine-console-reporter/blob/master/CHANGELOG.md
[license]:https://github.com/onury/jasmine-console-reporter/blob/master/LICENSE
[grunt-jn]:https://github.com/onury/grunt-jasmine-nodejs
