var protractorConf = require('../protractor.conf.js');

exports.config = {
    seleniumAddress: "http://10.155.0.94:4444/wd/hub",
    baseUrl        : 'http://10.5.147.34:8888',
    specs          : ['../../functional/acceptance/**/*.js'],

    splitTestsBetweenCapabilities: false,

    multiCapabilities: [
        {
            browserName   : 'internet explorer',
            version       : '9',
            count         : 1,
            shardTestFiles: true,
            maxInstances  : 4,
            platform      : 'WINDOWS'
        }
    ],

    onPrepare: function () {
        protractorConf.setup({
            runsOnCi: true,
            isIe: true
        });
    },

    jasmineNodeOpts: {
        showColors            : true,
        defaultTimeoutInterval: 120000
    }
};