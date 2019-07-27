var protractorConf = require('../protractor.conf.js');

exports.config = {
    seleniumAddress: "http://10.155.0.94:4444/wd/hub",
    baseUrl        : 'http://10.155.2.164:8888',
    specs          : ['../../functional/acceptance/**/*.js'],

    splitTestsBetweenCapabilities: false,

    multiCapabilities: [
        {
            browserName   : 'chrome',
            count         : 1,
            shardTestFiles: true,
            maxInstances  : 1,
            platform      : 'LINUX'
        }
    ],

    onPrepare: function () {
        protractorConf.setup({
            runsOnCi: true
        });
    },

    jasmineNodeOpts: {
        showColors            : true,
        defaultTimeoutInterval: 120000
    }
};
