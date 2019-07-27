var protractorConf = require('./protractor.conf.js');

exports.config = {
    specs: ['../functional/acceptance/**/*.js'],
    framework: 'jasmine2',

    multiCapabilities: [{
        browserName: 'chrome',
        count: 1
    }],

    onPrepare: function () {
        protractorConf.setup({
            testType: 'acceptance'
        });
    },

    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 50000
    }
};
