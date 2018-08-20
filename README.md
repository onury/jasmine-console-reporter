# jasmine-console-reporter

[![npm](http://img.shields.io/npm/v/jasmine-console-reporter.svg?style=flat-square)](https://www.npmjs.com/package/jasmine-console-reporter)
[![release](https://img.shields.io/github/release/onury/jasmine-console-reporter.svg?style=flat-square)](https://github.com/onury/jasmine-console-reporter)
[![license](http://img.shields.io/npm/l/jasmine-console-reporter.svg?style=flat-square)](https://github.com/onury/jasmine-console-reporter/blob/master/LICENSE)
[![downloads](http://img.shields.io/npm/dm/jasmine-console-reporter.svg?style=flat-square)](https://www.npmjs.com/package/jasmine-console-reporter)
[![dependencies](https://david-dm.org/onury/jasmine-console-reporter.svg?style=flat-square)](https://david-dm.org/onury/jasmine-console-reporter)
[![maintained](https://img.shields.io/maintenance/yes/2018.svg?style=flat-square)](https://github.com/onury/jasmine-console-reporter/graphs/commit-activity)  

> © 2018, Onur Yıldırım ([@onury](https://github.com/onury)). MIT License.

Progressive Console Reporter for Jasmine. (for Jasmine v3+)  
Outputs detailed test results to the console, with beautiful layout and colors.  

Example screen:

<p align="center">
    <a href="https://github.com/onury/jasmine-console-reporter">
        <img src="https://raw.github.com/onury/jasmine-console-reporter/master/screenshots/jcr-screen.jpg" width="100%" alt="JCR Screen" />
    </a>
</p>

Overall summary outputs:

<p align="center">
    <a href="https://github.com/onury/jasmine-console-reporter">
        <img src="https://raw.github.com/onury/jasmine-console-reporter/master/screenshots/jcr-summary.jpg" width="100%" alt="JCR Summaries" />
    </a>
</p>

## Installation

```shell
npm i jasmine-console-reporter --save-dev
```
_JCR v3+ requires peer dependency Jasmine v3+ and works on Node.js v6+. See [compatibility table](#compatibility-table)._

## Usage

```js
const JasmineConsoleReporter = require('jasmine-console-reporter');
const reporter = new JasmineConsoleReporter({
    colors: 1,           // (0|false)|(1|true)|2
    cleanStack: 1,       // (0|false)|(1|true)|2|3
    verbosity: 4,        // (0|false)|1|2|(3|true)|4|Object
    listStyle: 'indent', // "flat"|"indent"
    timeUnit: 'ms',      // "ms"|"ns"|"s"
    timeThreshold: { ok: 500, warn: 1000, ouch: 3000 }, // Object|Number
    activity: false,     // boolean or string ("dots"|"star"|"flip"|"bouncingBar"|...)
    emoji: true,
    beep: true
});
// pass the initialized reporter to whichever task or host...
```

### Options

| Option   | Description |
| -------- | ----------- |
| <h4>**`colors`**</h4>`Number\|Boolean` | Default: `1`. Specifies whether the output should have colored text. Possible integer values: 0 to 2. Set to `1` (or `true`) to enable colors. Set to `2` to use the [ANSI escape codes](https://www.npmjs.com/package/chalk#chalkstyles). Option `2` can be useful if, for example, you're running your tests from a sub-process, and the colors aren't showing up.            |
| <h4>**`cleanStack`**</h4>`Number\|Boolean` | Default: `1`. Specifies the filter level for the error stacks. Possible integer values: 0 to 3. Set to `1` (or `true`) to only filter out lines with jasmine-core path from stacks. Set to `2` to filter out all `node_modules` paths. Set to `3` to also filter out lines with no file path in it.            |
| <h4>**`verbosity`**</h4>`Number\|Boolean\|Object` | Default: `4`. Specifies the verbosity level for the reporter output. Possible integer values: 0 to 4. When a `Boolean` value is passed, `true` defaults to `4` and `false` defaults to `0`. Level 0: reports errors only. Level 1: also displays a summary. Level 2: also reports pending specs. Level 3: additionally displays all suites and specs as a list, except disabled and excluded specs. Level 4: lists all. Or set to an object to toggle each output section individually. Any omitted value will default to `true`. e.g. `{ pending: false, disabled: false, specs: false, summary: true }` |
| <h4>**`listStyle`**</h4>`String` | Default: `"indent"`. Indicates the style of suites/specs list output. Possible values: `"flat"` or `"indent"`. Setting this to `"indent"` provides a better view especially when using nested (describe) suites. This option is only effective when verbosity level is set to `3`, `4` or `true`.            |
| <h4>**`timeUnit`**</h4>`String` | Default: `"ms"`. Specifies the time unit to be used to measure spec execution. `"ms"` for milliseconds, `"ns"` for milliseconds including hi-res nanoseconds remainder, `"s"` for seconds including milliseconds remainder. _Note that overall time in final summary is always reported in seconds._|
| <h4>**`timeThreshold`**</h4>`Number|Object` | Default: `{ ok: 500, warn: 1000, ouch: 3000 }`. Specifies the expected maximum time(s) (in milliseconds) for any spec to complete its execution. If threshold is exceeded, elapsed time for that spec will be accented in the output. This is only effective if `colors` option is enabled. |
| <h4>**`activity`**</h4>`Boolean\|String` | Default: `false`. Specifies whether to enable the activity indicator animation that outputs the current spec that is being executed. Set to a string value to set/change the [spinner style](https://github.com/sindresorhus/cli-spinners/blob/master/spinners.json).|
| <h4>**`emoji`**</h4>`Boolean\|Object` | Default: `false`. Whether to output some emojis within the report, for a little fun. To customize emojis, you can set an object. _Note that emojis will be auto-disabled in CI environments._ |
| <h4>**`beep`**</h4>`Boolean` | Default: `true`. Whether to play system beep when tests finish with status "failed". _Note that beep will be auto-disabled in CI and non-TTY environments._ |

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
    verbosity: 4,        // (0|false)|1|2|(3|true)|4|Object
    listStyle: 'indent', // "flat"|"indent"
    timeUnit: 'ms',      // "ms"|"ns"|"s"
    timeThreshold: { ok: 500, warn: 1000, ouch: 3000 }, // Object|Number
    activity: true,
    emoji: true,         // boolean or emoji-map object
    beep: true
});

// initialize and execute
jasmine.env.clearReporters();
jasmine.addReporter(reporter);
jasmine.execute();
```

## Change-Log

See [CHANGELOG.md][changelog].

### Compatibility Table

| Jasmine Console Reporter | Node           | Jasmine   |
| ------------------------ | -------------- | --------- | 
| v3.x                     | v6 and newer   | v3.x      |
| v2.x                     | v4 and newer   | v2.x      |
| v1.2.7                   | below v4       | v2.x      |

## License

[MIT][license].


[changelog]:https://github.com/onury/jasmine-console-reporter/blob/master/CHANGELOG.md
[license]:https://github.com/onury/jasmine-console-reporter/blob/master/LICENSE
[grunt-jn]:https://github.com/onury/grunt-jasmine-nodejs
