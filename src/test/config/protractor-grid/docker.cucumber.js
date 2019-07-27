var protractorConf = require('../protractor.conf.js');

exports.config = {
    seleniumAddress: "http://hub:4444/wd/hub",
    baseUrl: 'https://ibr-haproxy:443',
    specs: ['../../functional/acceptance/**/*.feature'],
    framework: 'cucumber',
    directConnect: false,

    splitTestsBetweenCapabilities: false,
    multiCapabilities: [{
        browserName: 'chrome',
        shardTestFiles: true,
        maxInstances: 6,
        platform: 'LINUX'
    }],

    onPrepare: function() {
        protractorConf.setup({
            testType: 'acceptance',
            framework: 'cucumber',
            windowX: 1920,
            windowY: 1080
        });
    },

    cucumberOpts: {
        require: ['../../functional/acceptance/**/step_definitions/*.js', '../reporters/cucumber_junit_reporter.js'],
        format: 'pretty'
    }
};
