#!/usr/bin/env node

const Jasmine = require('jasmine');
const JasmineConsoleReporter = require('../index.js');
const jasmineConfig = require('./config/jasmine.config.json');

// setup Jasmine
const jasmine = new Jasmine();
jasmine.loadConfig(jasmineConfig);
jasmine.jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

console.log('');
console.log('--------------------------------------------------');

// setup reporter
const reporterConfigFile = process.argv[2] || './config/reporter.config-1.json';
console.log('DEVELOPMENT TEST:', reporterConfigFile);
console.log('--------------------------------------------------');
const reporterConfig = require(reporterConfigFile);
console.log('original config:', JSON.stringify(reporterConfig));
const reporter = new JasmineConsoleReporter(reporterConfig);
jasmine.env.clearReporters();
jasmine.addReporter(reporter);

// run
console.log('--------------------------------------------------');
console.log('config:', JSON.stringify(reporter.options));
console.log('--------------------------------------------------');
console.log('');
jasmine.execute();
