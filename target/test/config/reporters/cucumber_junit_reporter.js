var reporter = require('cucumber-junit-reporter');

module.exports = reporter({
    reportDir: 'target/test/functional/acceptance/reports/junit/',
    reportPrefix: 'CUCUMBER-ACCEPTANCE-'
});
