/* eslint camelcase:0 */

module.exports = function (grunt) {
    'use strict';

    var JasmineConsoleReporter = require('./index');
    var reporter = new JasmineConsoleReporter({
        colors: true,        // (0|false)|(1|true)|2
        cleanStack: 1,       // (0|false)|(1|true)|2|3
        verbosity: 4,        // (0|false)|1|2|(3|true)|4
        listStyle: 'indent', // "flat"|"indent"
        activity: true
    });

    grunt.initConfig({
        jasmine_nodejs: {
            options: {
                customReporters: [reporter]
            },
            all: {
                specs: [
                    "test/**"
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-jasmine-nodejs');

    grunt.registerTask('default', ['jasmine_nodejs']);

};
