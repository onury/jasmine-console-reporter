## Jasmine Console Reporter Change-Log

### Releases:

#### **v2.0.1** (2017-08-20)

- **Breaking Change**: Due to [`chalk` dependency](https://github.com/chalk/chalk/releases/tag/v2.0.1) upgrade, the reporter now requires Node.js v4 or newer.
- Fixed an issue where the reporter would crash when `colors` option is set to `2` (ANSI colors). Fixes [issue #5](https://github.com/onury/jasmine-console-reporter/issues/5).
- Extensive code revision.

#### **v1.2.8** (2017-08-20)

_(**CAUTION**: version 1.2.8 has a [critical bug](https://github.com/onury/jasmine-console-reporter/issues/5). To avoid it, do NOT set `colors` option to `2` (ANSI colors). Or better update to v2+ if you're using Node.js version 4 or newer.)_
+ Updated `jasmine` and `chalk` to latest versions.
+ Project clean-up.


#### **v1.2.7** (2016-08-21)

- `cleanStack` option would render the first line as the error message, not respecting messages with `\n` (new-line) in them. Fixed.
- Updated dev-dependencies.

#### **v1.2.6** (2016-05-09)

- Failed specs that don't have an error stack, would not output a warning message. Fixed.
- Updated dependencies to their latest versions.

#### **v1.2.4** (2016-03-18)

- Improved `colors` option to support ANSI escape codes. (PR [#1](https://github.com/onury/jasmine-console-reporter/pull/1) by [@msrose](https://github.com/msrose))

#### **v1.2.2** (2016-02-27)

- Added grunt, jasmine tests, etc...
- Moved helper classes and utils to separate modules.

#### **v1.2.0** (2016-02-26)

- Moved the reporter to its own repo.
- Code revisions and clean-up.

#### **v1.1.3** (2015-07-05)

- Expanded `verbosity` levels (0 to 4). Setting to `3` will not report disabled specs anymore while listing others. Set to `4` (default) for the most verbose report.
- Updated dependencies to their latest versions.

#### **v1.1.0** (2015-05-01)

- Revised dependencies.
- Code revisions and clean-up.

#### **v1.0.1** (2015-04-27)

- Changed the default value of `activity` option to `false`. This should not be enabled if your tests log extra data to console. Fixed activity output.

#### **v1.0.0** (2015-04-21)

- Progressive console output. Each spec result is now output at real-time as it's executed. This effectively helps tracking unhandled errors.
- Fixed mis-handled _nested_ suites (describe blocks). Each spec result and nested suite is now correctly output in relation to its parent test siute.
- Highlighted file name, line and column numbers in stacks. Only effective if `colors` is enabled.
- Fixed the stack-filter to support Windows file paths.
- Improved option: `cleanStack` now also accepts a `Number` (integer) to determine the filter level. See documentation.
- Added new option: `listStyle`. See documentation.
- Improved option: `verbosity` (alias: `verbose`) now also accepts a `Number` (integer) to determine the verbosity level. See documentation.
- Clickable file paths in error stacks (This is useful only if your terminal supports it. For example, <kbd>CMD</kbd>+<kbd>Click</kbd> will open the file and move the cursor to the target line in iTerm 2 for Mac, if [configured](http://adrian-philipp.com/post/iterm-jumpto-sublimetext).)
- Added new option: `activity`. See documentation.
- Updated dependencies to their latest versions.

---

### Pre-Releases:

**v0.7.2** (2015-03-11)
- Console Reporter: Fixed *undefined suite description* issue for focused specs (`fit(...)`); which was breaking the spec-run.

**v0.7.1** (2015-03-06)
- Console Reporter: Fixed symbols and colors for Windows platforms.

**v0.7.0** (2015-03-04)
- Added new option: `cleanStack`.
- Code revisions and clean-up.

**v0.6.3** (2015-03-03)
- Fixes for `null` stack trace & peer jasmine-core. (PR by [@fiznool](https://github.com/fiznool))

**v0.6.2** (2015-03-01)
- Improved reporter output.
- Code clean-up.

**v0.6.0** (2015-02-12)
- Cleaner error stacks. Filtered out lines with jasmine-core path.
- Better reporter console output.

**v0.5.1** (2015-02-07)
- Fixed timer (zero elapsed time) issue.

**v0.5.0** (2015-02-07)
- Initial release.
