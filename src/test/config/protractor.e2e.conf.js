var protractorConf = require('./protractor.conf.js');

exports.config = {
    specs: ['../functional/e2e/*.js'],
    framework: 'jasmine2',
    allScriptsTimeout: 20000,

    multiCapabilities: [{
        browserName: 'chrome',
        count: 1
    }],

    onPrepare: function () {
        protractorConf.setup({
            testType: 'e2e'
        });
    },

    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 70000
    }
};
