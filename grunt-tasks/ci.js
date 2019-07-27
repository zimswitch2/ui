module.exports = function (grunt) {
    grunt.registerTask('convert_toggles_to_tags', 'Convert the redaction feature toggles into cucumber tags.', function () {

        if (grunt.option('tags')){
            console.log('Tags were specified, so ignoring feature toggles.');
            return;
        }

        console.log('Converting toggles into cucumber tags');

        var toggles = grunt.config.get('redact').toggles || {};
        var tags = [];
        for (var toggleName in toggles) {
            if (!toggles[toggleName]) {
                tags.push('~@' + toggleName);
            } else {
                tags.push('~@excludeWhen_' + toggleName);
            }
        }

        console.log('Excluding the following tags:');
        console.log(tags);

        var additionalCucumberOpts = {
            protractor: {
                acceptance_cucumber: {
                    options: {
                        args: {
                            cucumberOpts: {
                                tags: tags
                            }
                        }
                    }
                }
            }
        };

        grunt.config.merge(additionalCucumberOpts);
    });

    grunt.registerTask('ci', "Run all unit tests and acceptance tests and package", [
        /* Prep */
        'clean:all',
        'copy:srcToTarget',
        'jshint',
        'redact:everythingOn',

        /* Unit tests */
        'karma:unit',

        /* Build */
        'exec:package_build_number',
        'copy:srcToTarget',
        'redact:releaseToggles',
        'sass',
        'minify',

        /* acceptance tests */
        'check_stub',
        'env:setVariables',
        'configureProxies:server',
        'mkdir:acceptanceReports',
        'connect:acceptance',
        'protractor:acceptance',
        'convert_toggles_to_tags',
        'protractor:acceptance_cucumber',

        /* Package */
        'copy:targetToDist',
        'copy:targetToDistLazyLoadedFiles',
        'exec:create_distributable_package'
    ]);

    grunt.registerTask('ci:docker', "Run all unit tests and acceptance tests and package", [
        /* Prep */
        'clean:all',
        'copy:srcToTarget',
        'jshint',
        'redact:everythingOn',

        /* Unit tests */
        'karma:docker',

        /* Build */
        'exec:package_build_number',
        'copy:srcToTarget',
        'redact:releaseToggles',
        'sass',
        'minify',

        /* acceptance tests */
        'check_stub',
        'env:setVariables',
        'configureProxies:server',
        'mkdir:acceptanceReports',
        'connect:acceptance',
        'protractor:acceptance_docker_jasmine',
        'convert_toggles_to_tags',
        'protractor:acceptance_docker_cucumber',

        /* Package */
        'copy:targetToDist',
        'copy:targetToDistLazyLoadedFiles',
        'exec:create_distributable_package',
    ]);

    grunt.registerTask('ci:docker_reports', "Copy all the reporting results to the right place", [
        'elastic_formatter',
        'copy:unitResults',
        'copy:coverageResults',
        'copy:acceptanceResults'
    ]);

    grunt.registerTask('ci:report', "Copy all of the reporting results to the right place.", [
        'elastic_formatter',
        'copy:unitResults',
        'copy:coverageResults',
        'copy:acceptanceResults'
    ]);
};
