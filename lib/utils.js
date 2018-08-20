const path = require('path');

/**
 *  Activity Logger
 *  @author   Onur Yıldırım (onur@cutepilot.com)
 *  @license  MIT
 */
module.exports = (() => {

    const utils = {
        // windows returns 'win32' even on 64 bit but we still check for win64,
        // just in case...
        isWindows: process.platform === 'win32'
            || process.platform === 'win64'
    };

    utils.type = obj => ({}).toString.call(obj).match(/\s(\w+)/i)[1].toLowerCase();

    utils.isNum = value => typeof value === 'number';

    utils.log = (...args) => {
        process.stdout.write.apply(process.stdout, args);
    };

    utils.plural = (str, count) => count === 1 ? str : str + 's';

    utils.capitalize = string => string.slice(0, 1).toUpperCase() + string.slice(1);

    utils.repeat = (string, times) => new Array(times + 1).join(string);

    utils.indent = (str, times, indentChar) => {
        indentChar = indentChar || ' ';
        const newArr = [];
        const lines = (str || '').split('\n');
        for (let i = 0; i < lines.length; i++) {
            newArr.push(utils.repeat(indentChar, times) + lines[i]);
        }
        return newArr.join('\n');
    };

    let pStackLine = /[ \t]+at [^\r\n]+/g;
    utils.restack = (expectation, cleanLevel, style) => {
        if (!expectation) return '';

        let stack = String(expectation.stack || '');
        let message = typeof expectation.message === 'string'
            ? expectation.message
            : (stack.split(pStackLine)[0] || '');
        message = message.replace(/[\r\n]+$/, '');

        let stackLines = stack.match(pStackLine);

        if (cleanLevel > 0) {
            let cleanPath = cleanLevel >= 2
                ? 'node_modules'
                : path.join('node_modules', 'jasmine-core');
            cleanPath = path.sep + cleanPath + path.sep;
            // remove stack lines with jasmine-core path.
            stackLines = stackLines.filter(line => {
                const pathCheck = line.indexOf(cleanPath) === -1;
                const sepCheck = cleanLevel >= 3
                    ? line.indexOf(path.sep) > -1
                    : true;
                return (pathCheck && sepCheck);
            });
        }

        stackLines = stackLines.map(line => {
            // make the file paths CMD+clickable by removing the wrapping parenths.
            line = line.replace(/\(([^(]+?)\)/g, '$1'); // '( $1 )'
            if (style) {
                // add colors/styles to file name, line and column numbers
                line = line.replace(/([^:/\\ ]+):(\d+):(\d+)/, (m, $1, $2, $3) => {
                    return style.yellow($1) + ':' + style.white($2) + ':' + style.white($3);
                });
            }
            return line;
        });
        // add back the error message and rest of stack
        if (style) message = style.red(message);
        return message + '\n' + stackLines.join('\n');
    };

    utils.extend = (defaults, object) => {
        object = object || {};
        for (let key in defaults) {
            if (defaults.hasOwnProperty(key) && object[key] === undefined) {
                object[key] = defaults[key];
            }
        }
        return object;
    };

    // ---------------------------

    const defaultOpts = {
        colors: 1,              // 0 to 2
        cleanStack: 1,          // 0 to 3
        verbosity: {            // object or number (0 to 4)
            specs: true,
            failed: true,
            pending: true,
            disabled: true,
            summary: true
        },
        activity: false,        // bool or string ("dots")
        listStyle: 'indent',    // "indent"|"flat"
        timeUnit: 'ms',         // s|ms|ns
        timeThreshold: { ok: 500, warn: 1000, ouch: 3000 }, // number|object
        emoji: true,
        beep: true
    };

    // Normalizes and tries to get a numeric value. This is used for options
    // that support both Boolean and Number values.
    function _boolToNum(value, numTrue, numFalse, defaultVal) {
        if (typeof value === 'boolean') {
            return value ? numTrue : numFalse;
        }
        return typeof value === 'number' ? value : defaultVal;
    }

    function _mormalizeVerbosity(verbosity) {
        if (utils.type(verbosity) === 'object') {
            return Object.assign({}, defaultOpts.verbosity, verbosity);
        }
        const v = _boolToNum(verbosity, 4, 0, null);
        if (v === null) return Object.assign({}, defaultOpts.verbosity);
        return {
            failed: true, // always true
            disabled: v >= 4, // also list disabled specs and some additional info
            specs: v >= 3,
            pending: v >= 2,
            summary: v >= 1
        };
    }

    function _keep(n, min) {
        return typeof n === 'number' && n > (min || 0);
    }

    function _normalizeThreshold(threshold) {
        const t = Object.assign({}, threshold);
        if (!_keep(t.ok, 0)) delete t.ok;
        if (!_keep(t.warn, t.ok)) delete t.warn;
        if (!_keep(t.ouch, t.warn)) delete t.ouch;
        return t;
    }

    utils.getOptions = options => {
        let opts = options || {};
        opts.cleanStack = _boolToNum(opts.cleanStack, 1, 0, defaultOpts.cleanStack);
        opts.colors = _boolToNum(opts.colors, 1, 0, defaultOpts.colors);
        opts = Object.assign({}, defaultOpts, opts);
        opts.verbosity = _mormalizeVerbosity(opts.verbosity);
        const threshold = opts.timeThreshold;
        const t = utils.type(threshold);
        opts.timeThreshold = t === 'number'
            ? { ouch: threshold }
            : t === 'object'
                ? _normalizeThreshold(threshold)
                : Object.assign({}, defaultOpts.timeThreshold);
        return opts;
    };

    // ---------------------------

    return utils;

})();
