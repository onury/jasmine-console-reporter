# jasmine-console-reporter

[![version](https://img.shields.io/npm/v/jasmine-console-reporter.svg)](https://www.npmjs.com/package/jasmine-console-reporter)
[![downloads](http://img.shields.io/npm/dm/jasmine-console-reporter.svg)](https://www.npmjs.com/package/jasmine-console-reporter)
![dependencies](https://david-dm.org/onury/jasmine-console-reporter.svg)
![license](https://img.shields.io/npm/l/jasmine-console-reporter.svg)

Console Reporter for Jasmine. Outputs detailed test results to the console, with beautiful layout and colors. This is the default reporter of [grunt-jasmine-nodejs][grunt-jn].

> Author: Onur Yıldırım (onury) © 2016  
> Licensed under the MIT License.

Example output from [grunt-jasmine-nodejs][grunt-jn].

![Example Screenshot](https://raw.github.com/onury/jasmine-console-reporter/master/screenshots/verbose-report.jpg)

## Installation

```shell
npm install jasmine-console-reporter
```

### Usage

```js
var JasmineConsoleReporter = require('jasmine-console-reporter');
var reporter = new JasmineConsoleReporter({
    colors: 1,           // (0|false)|(1|true)|2
    cleanStack: 1,       // (0|false)|(1|true)|2|3
    verbosity: 4,        // (0|false)|1|2|(3|true)|4
    listStyle: 'indent', // "flat"|"indent"
    activity: false
});
// pass the initialized reporter to whichever task or host...
```

### Options

+ **colors** — Type: `Number`|`Boolean` Default: `1`  
Specifies whether the output should have colored text. Possible integer values: 0 to 2. Set to `1` (or `true`) to enable colors. Set to `2` to use the [ANSI escape codes](https://www.npmjs.com/package/chalk#chalkstyles). Option `2` can be useful if, for example, you're running your tests from a sub-process, and the colors aren't showing up.

+ **cleanStack** — Type: `Number|Boolean` Default: `1`  
Specifies the filter level for the error stacks. Possible integer values: 0 to 3. Set to `1` (or `true`) to only filter out lines with jasmine-core path from stacks. Set to `2` to filter out all `node_modules` paths. Set to `3` to also filter out lines with no file path in it.

+ **verbosity** — Type: `Number|Boolean` Default: `4`  
(_alias: `verbose`_) Specifies the verbosity level for the reporter output. Possible integer values: 0 to 4. When a `Boolean` value is passed, `true` defaults to `4` and `false` defaults to `0`. Level 0: reports errors only. Level 1: also displays a summary. Level 2: also reports pending specs. Level 3: additionally displays all suites and specs as a list, except disabled specs. Level 4: also lists disabled specs.

+ **listStyle** — Type: `String` Default: `"indent"`  
Indicates the style of suites/specs list output. Possible values: `"flat"` or `"indent"`. Setting this to `"indent"` provides a better view especially when using nested (describe) suites. This option is only effective when verbosity level is set to `3`, `4` or `true`.

+ **activity** — Type: `Boolean` Default: `false`  
Specifies whether to enable the activity indicator animation that outputs the current spec that is being executed. If your tests log extra data to console, this option should be disabled or they might be overwritten.

## Change-Log

- **v1.2.7** (2016-08-21)
    + `cleanStack` option would render the first line as the error message, not respecting messages with `\n` (new-line) in them. Fixed.
    + Updated dev-dependencies.

    ---

- **v1.2.6** (2016-05-09)
    + Failed specs that don't have an error stack, would not output a warning message. Fixed.
    + Updated dependencies to their latest versions.

    ---

- **v1.2.4** (2016-03-18)
    + Improved `colors` option to support ANSI escape codes. (PR [#1](https://github.com/onury/jasmine-console-reporter/pull/1) by [@msrose](https://github.com/msrose))

    ---

- **v1.2.2** (2016-02-27)
    + Added grunt, jasmine tests, etc...
    + Moved helper classes and utils to separate modules.

    ---

- **v1.2.0** (2016-02-26)
    + Moved the reporter to its own repo.
    + Code revisions and clean-up.

    ---

- **v1.1.3** (2015-07-05)
    + Expanded `verbosity` levels (0 to 4). Setting to `3` will not report disabled specs anymore while listing others. Set to `4` (default) for the most verbose report.
    + Updated dependencies to their latest versions.

    ---

- **v1.1.0** (2015-05-01)
    + Revised dependencies.
    + Code revisions and clean-up.

    ---

- **v1.0.1** (2015-04-27)
    + Changed the default value of `activity` option to `false`. This should not be enabled if your tests log extra data to console. Fixed activity output.

    ---

- **v1.0.0** (2015-04-21)
    + Progressive console output. Each spec result is now output at real-time as it's executed. This effectively helps tracking unhandled errors.
    + Fixed mis-handled _nested_ suites (describe blocks). Each spec result and nested suite is now correctly output in relation to its parent test siute.
    + Highlighted file name, line and column numbers in stacks. Only effective if `colors` is enabled.
    + Fixed the stack-filter to support Windows file paths.
    + Improved option: `cleanStack` now also accepts a `Number` (integer) to determine the filter level. See documentation.
    + Added new option: `listStyle`. See documentation.
    + Improved option: `verbosity` (alias: `verbose`) now also accepts a `Number` (integer) to determine the verbosity level. See documentation.
    + Clickable file paths in error stacks (This is useful only if your terminal supports it. For example, <kbd>CMD</kbd>+<kbd>Click</kbd> will open the file and move the cursor to the target line in iTerm 2 for Mac, if [configured](http://adrian-philipp.com/post/iterm-jumpto-sublimetext).)
    + Added new option: `activity`. See documentation.
    + Updated dependencies to their latest versions.

    ---

- v0.7.2 (2015-03-11)
    + Console Reporter: Fixed *undefined suite description* issue for focused specs (`fit(...)`); which was breaking the spec-run.

    ---

- v0.7.1 (2015-03-06)
    + Console Reporter: Fixed symbols and colors for Windows platforms.

    ---

- v0.7.0 (2015-03-04)
    + Added new option: `cleanStack`.
    + Code revisions and clean-up.

    ---

- v0.6.3 (2015-03-03)
    + Fixes for `null` stack trace & peer jasmine-core. (PR by [@fiznool](https://github.com/fiznool))

    ---

- v0.6.2 (2015-03-01)
    + Improved reporter output.
    + Code clean-up.

    ---

- v0.6.0 (2015-02-12)
    + Cleaner error stacks. Filtered out lines with jasmine-core path.
    + Better reporter console output.

    ---

- v0.5.1 (2015-02-07)
    + Fixed timer (zero elapsed time) issue.

    ---

- v0.5.0 (2015-02-07)
    + Initial release.



[grunt-jn]: https://github.com/onury/grunt-jasmine-nodejs
