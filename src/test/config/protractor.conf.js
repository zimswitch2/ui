var path = require('path');

exports.setup = function(params) {
    var testType = params.testType || 'acceptance';
    var ignoreConsoleErrors = params.ignoreConsoleErrors || false;
    var framework = params.framework || 'jasmine2';

    var junitXmlReportPath = 'target/test/functional/' + testType + '/reports/junit/';

    _ = require('lodash');

    if (framework === 'jasmine2') {
        require('../helpers/customMatchers.js');
    }

    // Set browser screen size and maximize window
    var windowX = params.windowX || 1920;
    var windowY = params.windowY || 1080;
    browser.manage().window().setSize(windowX, windowY);
    browser.manage().window().maximize();

    // Get test data from JSON file
    browser.params = _.merge(require('../functional/functionalTestData.js'), require('../config/data/pages.js'));

    // Set URL parameters
    browser.loginUrl = 'index.html';
    browser.registerUrl = 'index.html#/register';
    browser.resetPasswordUrl = 'index.html#/reset-password';

    // Disable animations so tests run more quickly
    var disableNgAnimate = function() {
        angular.module('disableNgAnimate', []).run(function($animate) {
            $animate.enabled(false);
        });
    };

    browser.addMockModule('disableNgAnimate', disableNgAnimate);

    if (framework === 'jasmine2') {
        var jasmineReporters = require('jasmine-reporters');
        jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
            savePath: junitXmlReportPath,
            consolidateAll: false,
            consolidate: true,
            filePrefix: 'result-'
        }));

        if (!ignoreConsoleErrors) {
            var errorFilters = [
                /Synchronous XMLHttpRequest/,
                /\/sbg-ib\/rest\/SecurityService\/AuthenticateDI .* the server responded with a status of 401/,
                /\/sbg-ib\/rest\/SecurityService\/CreateDigitalId .* the server responded with a status of 401/,
                /\/sbg-ib\/rest\/SecurityService\/CreateDigitalId .* the server responded with a status of 500/
            ];

            // Fail on console errors
            afterEach(function() {
                browser.manage().logs().get('browser').then(function(consoleErrors) {
                    var actualErrors = _.filter(consoleErrors, function(logEntry) {
                        return _.every(errorFilters, function(messagePattern) {
                            return !logEntry.message.match(messagePattern);
                        });
                    });
                    expect(require('util').inspect(actualErrors)).toEqual('[]');
                });
            });
        }
    }
};
