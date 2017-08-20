#!/usr/bin/env node

const Jasmine = require('jasmine');
const JasmineConsoleReporter = require('../index.js');
const jasmineConfig = require('./config/jasmine.config.json');

// setup Jasmine
const jasmine = new Jasmine();
jasmine.loadConfig(jasmineConfig);
jasmine.jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

// setup reporter
const reporterConfigFile = process.argv[2] || './config/reporter.config-1.json';
const reporterConfig = require(reporterConfigFile);
const reporter = new JasmineConsoleReporter(reporterConfig);
jasmine.env.clearReporters();
jasmine.addReporter(reporter);

// run
console.log('');
console.log('--------------------------------------------------');
console.log('DEVELOPMENT TEST:', reporterConfigFile);
console.log('--------------------------------------------------');
console.log('');
console.log('config:', JSON.stringify(reporterConfig, null, 2));
console.log('');
jasmine.execute();
