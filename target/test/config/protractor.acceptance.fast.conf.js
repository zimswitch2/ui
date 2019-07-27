var protractorConf = require('./protractor.conf.js');

exports.config = {
    specs: [
        '../functional/acceptance/**/*.js'        
        ],

    exclude: [
        '../functional/acceptance/**/steps/*.js',
        '../functional/acceptance/**/*Steps.js'
    ],

    framework: 'jasmine2',

    directConnect: true,

    multiCapabilities: [{
        browserName: 'chrome',
        count: 1,
        shardTestFiles: true,
        maxInstances: 6
    }],

    onPrepare: function () {
        protractorConf.setup({
            testType: 'acceptance'
        });
    },

    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 50000,
        allScriptsTimeout: 20000 //default timeout to 20 seconds
    }
};
