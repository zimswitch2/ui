var protractorConf = require('./protractor.conf.js');

exports.config = {
    specs: ['../functional/e2e/**/*.feature'],
    framework: 'cucumber',

    directConnect: true,

    multiCapabilities: [{
        browserName: 'chrome',
        count: 1
    }],

    onPrepare: function () {
        protractorConf.setup({
            testType: 'e2e',
            framework: 'cucumber'
        });

            //var Cucumber = require('cucumber');
            //var JsonFormatter = Cucumber.Listener.JsonFormatter();
            //var fs = require('fs');
            //
            //JsonFormatter.log = function (json) {
            //    fs.writeFile('cucumberReport.json', json, function (err) {
            //        if (err) throw err;
            //        console.log('json file location: cucumberReport.json');
            //    });
            //};
    },

    cucumberOpts: {
        require: ['../functional/acceptance/**/step_definitions/*.js', 'reporters/cucumber_junit_reporter.js','../functional/e2e/**/step_definition/*.js'],
        format: 'pretty'
    }
};