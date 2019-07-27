var protractorConf = require('../protractor.conf.js');

exports.config = {
    seleniumAddress: "http://hub:4444/wd/hub",
    baseUrl: 'https://ibr-haproxy:443',
    specs: ['../../functional/acceptance/**/*.js'],
    exclude: ['../../functional/acceptance/**/step_definitions/*.js'],
    directConnect: false,
    framework: 'jasmine2',

    splitTestsBetweenCapabilities: false,
    capabilities: {
        browserName: 'chrome',
        shardTestFiles: true,
        maxInstances: 6,
        platform: 'LINUX'
    },

    onPrepare: function() {
        console.log('waiting for session...');
        return browser.driver.getSession().then(function() {
            console.log('...acquired.');
            protractorConf.setup({
                testType: 'acceptance',
                runsOnCi: true,
                ignoreConsoleErrors: true,
                windowX: 1920,
                windowY: 1080
            });
        });
    },

    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 120000
    }
};
