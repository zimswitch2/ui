var protractorConf = require('./protractor.conf.js');

exports.config = {
    specs: ['../functional/smoke/*.js'],
    framework: 'jasmine2',
    allScriptsTimeout: 60000,

    multiCapabilities: [{
        browserName: 'chrome',
        count: 1
    }],

    onPrepare: function () {
        protractorConf.setup({
            testType: 'smoke',
            ignoreConsoleErrors: true
        });
    },

    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 70000
    }
};
