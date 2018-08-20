'use strict';

// dep modules
const chalk = require('chalk');
const ansiStyle = require('ansi-styles');
const emoji = require('node-emoji');
// own modules
const utils = require('./utils');

const defaultEmojiMap = {
    noSpecs: 'zzz',
    passedStatus: 'punch',
    failedStatus: 'x',
    incompleteStatus: 'warning'
};

/**
 *  StyleFactory
 *  @author   Onur Yıldırım <onur@cutepilot.com>
 *  @license  MIT
 */
module.exports = {
    create(options) {

        const colors = options.colors;
        const emojiMap = typeof options.emoji === 'boolean'
            ? Object.assign({}, defaultEmojiMap)
            : Object.assign(defaultEmojiMap, options.emoji);

        const aStyles = ['green', 'red', 'yellow', 'cyan', 'white', 'gray', 'underline'];
        const style = {};

        aStyles.forEach(s => {
            style[s] = colors === 2
                ? str => ansiStyle[s].open + str + ansiStyle[s].close
                : (colors === 1 ? str => chalk[s](str) : str => str);
        });

        style.fromKeyword = (keyword, defaultStyle) => {
            switch (keyword) {
                case 'passed':
                case 'complete':
                    return style.green;
                case 'failed':
                    return style.red;
                case 'pending':
                case 'disabled':
                case 'incomplete':
                    return style.yellow;
                default:
                    return style[defaultStyle || 'gray'];
            }
        };

        style.symbol = name => {
            switch (name) {
                case 'dot':
                    return utils.isWindows ? '.' : '∙';
                case 'info':
                    return utils.isWindows ? 'i' : 'ℹ';
                case 'success':
                    return utils.isWindows ? '√' : '✔'; // ✓
                case 'warning':
                    return utils.isWindows ? '‼' : '!'; // ⚠
                case 'error':
                    return utils.isWindows ? '×' : '✖'; // ✕
                case 'disabled':
                    return utils.isWindows ? '!' : '•';
                default:
                    return '';
            }
        };

        // { ok: 500 }                     >=500 yellow, <500 gray
        // { warn: 1000 }                  >=1000 yellow, <1000 gray
        // { ouch: 1000 }                  >=1000 red, <1000 gray
        // { ok: 500, ouch: 2000 }         >=2000 red, <500 gray, >=500 && <2000 yellow
        // { warn: 1000, ouch: 2000 }      >=1000 yellow, >=2000 red, <1000 gray
        style.time = ms => {
            let { ok, warn, ouch } = options.timeThreshold;
            if (ouch && ms >= ouch) return style.red;
            if (warn && ms >= warn) return style.yellow;
            if (ok && ms >= ok) return warn ? style.white : style.yellow;
            return style.gray;
        };

        style.emoji = {};
        Object.keys(emojiMap).forEach(key => {
            style.emoji[key] = options.emoji
                ? emoji.emojify(`:${emojiMap[key].replace(/:/g, '')}:  `)
                : '';
        });

        return style;
    }
};
