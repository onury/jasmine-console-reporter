/**
 *  Activity Logger
 *  @author   Onur Yıldırım (onur@cutepilot.com)
 *  @license  MIT
 */
module.exports = (() => {
    'use strict';

    const path = require('path');

    let utils = {
        // windows returns 'win32' even on 64 bit but we still check for win64,
        // just in case...
        isWindows: process.platform === 'win32'
            || process.platform === 'win64'
    };

    utils.log = () => {
        process.stdout.write.apply(process.stdout, arguments);
    };

    utils.plural = (str, count) => {
        return count === 1 ? str : str + 's';
    };

    utils.capitalize = string => {
        return string.slice(0, 1).toUpperCase() + string.slice(1);
    };

    utils.repeat = (string, times) => {
        return new Array(times + 1).join(string);
    };

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

    // Normalizes and tries to get a numeric value. This is used for options
    // that support both Boolean and Number values.
    utils.optionBoolToNum = (value, numTrue, numFalse) => {
        if (typeof value === 'boolean') {
            return value ? numTrue : numFalse;
        }
        return typeof value === 'number' ? value : undefined;
    };

    return utils;

})();
