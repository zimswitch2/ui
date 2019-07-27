module.exports = function (grunt) {
    var Promise = require('bluebird');
    var fs = Promise.promisifyAll(require('fs'));
    var http = Promise.promisifyAll(require('http'));
    var xml2js = require('xml2js');
    var parser = Promise.promisifyAll(new xml2js.Parser());
    var moment = require('moment');

    var directory = 'target/test/functional/acceptance/reports/junit/';
    var username = 'mcdc',
        password = 'mcdc123',
        host = 'dchop67.standardbank.co.za',
        port = '9200';

    var verbose = grunt.option('verbose');

    var parseAcceptanceTestResult = function (file) {
        return fs.readFileAsync(directory + file).then(function (file) {
            return parser.parseStringAsync(file);
        });
    };

    var formatResults = function (results) {
        var flatten = function (previous, current) {
            return previous.concat(current);
        };

        return results
            .map(function (result) {
                return result.testsuites.testsuite;
            }).reduce(flatten, [])
            .map(function (testsuite) {
                var attributes = testsuite['$'];
                var testcases = testsuite.testcase;

                if (!testcases) return [];

                return testcases.map(function (item) {
                    var testcase = item['$'];
                    var failures = item['failure'];

                    var testsuiteName = attributes.name
                        .match(/[^.]*[^.]/)[0]
                        .replace('ACCEPTANCE - ', '');

                    testcase.testsuite = testsuiteName;
                    testcase.timestamp = moment().toDate();
                    testcase.time = new Number(testcase.time);
                    testcase.result = 'SUCCESS';

                    if (failures && failures.length) {
                        testcase.result = 'FAILED';
                        testcase.failures = failures.map(function (failure) {
                            var formattedFailure = failure['$'];
                            formattedFailure.detail = failure['_'];

                            return formattedFailure;
                        });
                    }
                    return testcase;
                });
            })
            .reduce(flatten, []);
    };

    var sendResultsToElasticSearch = function (requestData) {
        var opts = {
            host: host,
            port: port,
            auth: username + ':' + password,
            path: '/ibr-acceptance-' + moment().format('YYYY-MM-DD') + '/results',
            method: 'POST',
            headers: {
                "Content-Type": 'application/json',
                "Accept": 'application/json'
            }
        };

        var defer = Promise.defer();

        if (verbose) console.log('Sending ' + requestData.name + '.');

        var request = http.request(opts, function (res) {
            var data = '';
            res.on('data', function (chunk) {
                /* Do nothing. If this isn't here, node doesn't release the socket. */
                data += chunk;
            });

            res.on('end', function () {
                defer.resolve();
                if (verbose) {
                    console.log('Complete ' + requestData.name + '.');
                    console.log(data);
                } else {
                    process.stdout.write('.');
                }
            });
        });

        request.on('error', function (e) {
            console.log('Problem with request: ' + e.message);
            defer.reject();
        });

        request.write(JSON.stringify(requestData));
        request.end();

        return defer.promise;
    };

    var sendAllResultsToElasticSearch = function (results) {
        console.log('Sending ' + results.length + ' results to elasticsearch.');
        return Promise.all(results.map(sendResultsToElasticSearch));
    };

    var elastic_formatter = function () {
        console.log('Looking for acceptance test results at:' + directory);

        if (!fs.existsSync(directory)) {
            console.log('Could not find acceptance test report directory: ' + directory)
            return;
        }

        var done = this.async();

        fs.readdirAsync(directory).then(function (files) {
            console.log('Reading ' + files.length + ' files.');
            var readFiles = files.map(parseAcceptanceTestResult);

            return Promise.all(readFiles)
                .then(formatResults)
                .then(sendAllResultsToElasticSearch)
                .finally(done);
        });
    };

    grunt.registerTask('elastic_formatter', 'Formats and sends all test results to elastic search.', elastic_formatter);
};
