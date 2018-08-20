# Jasmine Console Reporter Changelog

All notable changes to this project will be documented in this file. The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org).

## [3.1.0](https://github.com/onury/jasmine-console-reporter/compare/v3.0.2...v3.1.0) (2018-08-21)

### Added
- Execution elapsed time for each spec. [#11](https://github.com/onury/jasmine-console-reporter/issues/11)
- New option: `timeUnit`  (`String`, default: `"ms"`) The time unit to be used to measure spec execution. `"ms"` for milliseconds, `"ns"` for milliseconds including hi-res nanoseconds remainder, `"s"` for seconds including milliseconds remainder.
- New option: `timeThreshold`  (`Object|Number`, default: `{ ok: 500, warn: 1000, ouch: 3000 }`) the expected maximum time(s) (in milliseconds) for any spec to complete its execution. If threshold is exceeded, elapsed time for that spec will be accented in the output. This is only effective if `colors` option is enabled.
- `verbosity` option now also accepts an object, in order to toggle each output section individually. [#11](https://github.com/onury/jasmine-console-reporter/issues/11)

### Changed
- Updated dependencies to latest versions.

### Fixed
- An issue where some options (such as `colors`) would not pick up default values when omitted. Fixes [#10](https://github.com/onury/jasmine-console-reporter/issues/10).


## [3.0.2](https://github.com/onury/jasmine-console-reporter/compare/v3.0.0...v3.0.2) (2018-05-17)

### Changed
- Randomness and random seed displayed if running in random order and `verbosity` is `1` or above. [PR #9](https://github.com/onury/jasmine-console-reporter/pull/9) by [@steverice](https://github.com/steverice).
- Updated dependencies to latest versions.


## [3.0.0](https://github.com/onury/jasmine-console-reporter/compare/v2.0.1...v3.0.0) (2018-04-03)
> _This major version is re-written in ES2015. See breaking changes below._

### Added
- Support for Jasmine v3+ (peer-dependency). Also see [Jasmine v3 changes](https://github.com/jasmine/jasmine/blob/v3.0.0/release_notes/3.0.md).
- Additional information is displayed, if running in *random* order and `verbosity` is set to `4`.
- Overall status (and reason if status is `incomplete`) within report summary.
- Support for non-interactive output terminals. (This allows piping output to a file.)
- New option: `emoji` 👊 (`boolean`, default: `false`). _Note: emojis will be auto-disabled in CI environments._
- New option: `beep` (`boolean`, default: `false`). _Note: beep will be auto-disabled in CI and non-TTY environments._
- Activity spinner styles. Instead of setting to `true`, set `activity` option to a string value to set the style of the spinner. e.g. `"dots"` (default) or `"bouncingBar"`. See all possible values [here](https://github.com/sindresorhus/cli-spinners/blob/master/spinners.json).

### Changed
- **BREAKING**: Requires Node.js v6 or newer.
- Improved exception stack parsing.
- Better activity spinner.

### Fixed
- An issue where exception message is not printed before the stack. Fixes [#7](https://github.com/onury/jasmine-console-reporter/issues/7) & [#8](https://github.com/onury/jasmine-console-reporter/issues/8).


## [2.0.1](https://github.com/onury/jasmine-console-reporter/compare/v1.2.8...v2.0.1) (2017-08-20)

### Changed
- **Breaking**: Due to [`chalk` dependency](https://github.com/chalk/chalk/releases/tag/v2.0.1) upgrade, the reporter now requires Node.js v4 or newer.
- Extensive code revision.

### Fixed
- An issue where the reporter would crash when `colors` option is set to `2` (ANSI colors). Fixes [issue #5](https://github.com/onury/jasmine-console-reporter/issues/5).


## [1.2.8](https://github.com/onury/jasmine-console-reporter/compare/v1.2.7...v1.2.8) (2017-08-20)

> _(**CAUTION**: version 1.2.8 has a [critical bug](https://github.com/onury/jasmine-console-reporter/issues/5). To avoid it, do NOT set `colors` option to `2` (ANSI colors). Or better update to v2+ if you're using Node.js version 4 or newer.)_

### Changed
- Updated `jasmine` and `chalk` to latest versions.
- Clean-up.


## [1.2.7](https://github.com/onury/jasmine-console-reporter/compare/v1.2.6...v1.2.7) (2016-08-21)

### Fixed
- An issue with `cleanStack` option, that would render the first line as the error message, not respecting messages with `\n` (new-line) in them.

### Changed
- Updated dev-dependencies.


## [1.2.6](https://github.com/onury/jasmine-console-reporter/compare/v1.2.4...v1.2.6) (2016-05-09)

### Fixed
- An issue with failed specs that don't have an error stack, would not output a warning message.

### Changed
- Updated dependencies to their latest versions.


## [1.2.4](https://github.com/onury/jasmine-console-reporter/compare/v1.2.2...v1.2.4) (2016-03-18)

### Added
- Support for ANSI escape codes, for `colors` option. (PR [#1](https://github.com/onury/jasmine-console-reporter/pull/1) by [@msrose](https://github.com/msrose))


## [1.2.2](https://github.com/onury/jasmine-console-reporter/compare/v1.2.0...v1.2.2) (2016-02-27)

### Added
- Grunt, jasmine tests, etc...

### Changed
- Moved helper classes and utils to separate modules.


## [1.2.0](https://github.com/onury/jasmine-console-reporter/compare/v1.1.3...v1.2.0) (2016-02-26)

### Changed
- Moved the reporter to its own repo.
- Code revisions and clean-up.


## [1.1.3](https://github.com/onury/jasmine-console-reporter/compare/v1.1.0...v1.1.3) (2015-07-05)

### Changed
- Expanded `verbosity` levels (0 to 4). Setting to `3` will not report disabled specs anymore while listing others. Set to `4` (default) for the most verbose report.
- Updated dependencies to their latest versions.


## [1.1.0](https://github.com/onury/jasmine-console-reporter/compare/v1.0.1...v1.1.0) (2015-05-01)

### Changed
- Updated dependencies.
- Minor code revisions and clean-up.


## [1.0.1](https://github.com/onury/jasmine-console-reporter/compare/v1.0.0...v1.0.1) (2015-04-27)

### Changed
- The default value of `activity` option is now `false`. This should not be enabled if your tests log extra data to console. Fixed activity output.


## [1.0.0](https://github.com/onury/jasmine-console-reporter/compare/v0.7.2...v1.0.0) (2015-04-21)

### Added
- Progressive console output. Each spec result is now output at real-time as it's executed. This effectively helps tracking unhandled errors.
- Highlighting for file name, line and column numbers in stacks. Only effective if `colors` is enabled.
- New option: `listStyle`. See documentation.
- Support for clickable file paths in error stacks (This is useful only if your terminal supports it. For example, <kbd>CMD</kbd>+<kbd>Click</kbd> will open the file and move the cursor to the target line in iTerm 2 for Mac, if [configured](http://adrian-philipp.com/post/iterm-jumpto-sublimetext).)
- New option: `activity`. See documentation.

### Changed
- `cleanStack` option now also accepts a `Number` (integer) to determine the filter level.
`verbosity` option now also accepts a `Number` (integer) to determine the verbosity level.
- Updated dependencies to their latest versions.

### Fixed
- Mis-handled _nested_ suites (describe blocks). Each spec result and nested suite is now correctly output in relation to its parent test siute.
- An issue with the stack-filter. Now also supports Windows file paths.

---

## Pre-Releases:

### 0.7.2 (2015-03-11)

#### Fixed
- The *undefined suite description* issue for focused specs (`fit(...)`); which was breaking the spec-run.

### 0.7.1 (2015-03-06)

#### Fixed
- An issue with displaying symbols and colors for Windows platforms.

### 0.7.0 (2015-03-04)

#### Added
- New option: `cleanStack`.

#### Changed
- Code revisions and clean-up.

### 0.6.3 (2015-03-03)

#### Fixed
- `null` stack trace issue & peer jasmine-core. (PR by [@fiznool](https://github.com/fiznool))

### 0.6.2 (2015-03-01)

#### Changed
- Improved reporter output.
- Code clean-up.

### 0.6.0 (2015-02-12)

#### Changed
- Cleaner error stacks. Filtered out lines with jasmine-core path.
- Better reporter console output.

### 0.5.1 (2015-02-07)

#### Fixed
- Timer (zero elapsed time) issue.

### 0.5.0 (2015-02-07)
Initial release.
