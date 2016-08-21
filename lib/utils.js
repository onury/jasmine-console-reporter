/**
 *  Activity Logger
 *  @author   Onur Yıldırım (onur@cutepilot.com)
 *  @license  MIT
 */
module.exports = (function () {
    'use strict';

    var path = require('path');

    var utils = {
        // windows returns 'win32' even on 64 bit but we still check for win64,
        // just in case...
        isWindows: process.platform === 'win32'
            || process.platform === 'win64'
    };

    utils.plural = function (str, count) {
        return count === 1 ? str : str + 's';
    };

    utils.repeat = function (string, times) {
        return new Array(times + 1).join(string);
    };

    utils.indent = function (str, times, indentChar) {
        indentChar = indentChar || ' ';
        var i,
            newArr = [],
            lines = (str || '').split('\n');
        for (i = 0; i < lines.length; i++) {
            newArr.push(utils.repeat(indentChar, times) + lines[i]);
        }
        return newArr.join('\n');
    };

    utils.symbol = function (name) {
        switch (name) {
            case 'dot':
                return utils.isWindows ? '.' : '∙';
            case 'info':
                return utils.isWindows ? 'i' : 'ℹ';
            case 'success':
                return utils.isWindows ? '√' : '✔'; // ✓
            case 'warning':
                return utils.isWindows ? '‼' : '⚠';
            case 'error':
                return utils.isWindows ? '×' : '✖'; // ✕
            case 'disabled':
                return utils.isWindows ? '!' : '•';
            default:
                return '';
        }
    };

    utils.reStack = function (stack, cleanLevel, style) {
        if (!stack) return stack;

        // (error) message is the string until we see
        // the first "   at ... (path:line:column)\n"
        var message = String(stack).split(/[ \t]+at [^\n]+?:\d+:\d+\)?\n/)[0] || '';
        // the rest is stack lines
        stack = String(stack).slice(message.length).split('\n');

        if (cleanLevel > 0) {
            var cleanPath = cleanLevel >= 2
                ? 'node_modules'
                : path.join('node_modules', 'jasmine-core');
            cleanPath = path.sep + cleanPath + path.sep;
            // remove stack lines with jasmine-core path.
            stack = stack.filter(function (stackLine) {
                var pathCheck = stackLine.indexOf(cleanPath) === -1,
                    sepCheck = cleanLevel >= 3
                        ? stackLine.indexOf(path.sep) > -1
                        : true;
                return (pathCheck && sepCheck);
            });
        }

        // make the file paths clickable by removing the wrapping parenths.
        stack = stack.map(function (stackLine) {
            stackLine = stackLine.replace(/\(([^\(]+?)\)/g, '$1'); // '( $1 )'
            if (style) {
                stackLine = stackLine.replace(/([^:\/\\ ]+):(\d+):(\d+)/, function (m, $1, $2, $3) {
                    return style.yellow($1) + ':' + style.white($2) + ':' + style.white($3);
                });
            }
            return stackLine;
        });
        // add back the error message and rest of stack
        if (style) message = style.red(message);
        return message + stack.join('\n');
    };

    utils.extend = function (defaults, object) {
        object = object || {};
        var key;
        for (key in defaults) {
            if (defaults.hasOwnProperty(key)
                    && object[key] === undefined) {
                object[key] = defaults[key];
            }
        }
        return object;
    };

    // Normalizes and tries to get a numeric value. This is used for options
    // that support both Boolean and Number values.
    utils.optionBoolToNum = function (value, numTrue, numFalse) {
        if (typeof value === 'boolean') {
            return value ? numTrue : numFalse;
        }
        return typeof value === 'number' ? value : undefined;
    };

    return utils;

})();
