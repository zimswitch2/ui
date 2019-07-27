module.exports = function (grunt) {
    var _ = require('lodash');
    var moment = require('moment');

    var developmentToggles = grunt.file.readJSON('src/toggle/developmentToggles.json');
    var developmentToggleStates = _.mapValues(developmentToggles, function (config) {
        return (grunt.option(config.overrideOption) ^ config.default) ? true : false;
    });

    var redactConfigWith = function (businessToggleStates, everythingOn) {
        return {
            options: {
                workingDirectory: 'target',
                jsPatterns: ['**/*.js', '!**/bower_components/**'],
                htmlPatterns: ['**/*.html', '!**/bower_components/**'],
                toggleStates: _.merge(businessToggleStates, developmentToggleStates),
                everythingOn: !!everythingOn
            }
        };
    };

    var togglesFileName = 'src/toggle/releaseToggles.json';
    var releaseToggles = grunt.file.readJSON(togglesFileName);
    var releasesFileName = 'src/toggle/releases.json';
    var releases = grunt.file.readJSON(releasesFileName);

    if (grunt.option('release') && !releases[grunt.option('release')]) {
        grunt.fail.fatal('Release option must be a valid release name. Please see options in "' + releasesFileName + '" file');
    }

    if (grunt.option('toggle') && !releaseToggles[grunt.option('toggle')]) {
        grunt.fail.fatal('Toggle option must be a valid toggle name. Please see options in "' + togglesFileName + '" file');
    }

    var isToggleReleaseBeforeDesiredRelease = function (config, desiredRelease) {
        var targetRelease = releases[config.target];

        if (!targetRelease) {
            return false;
        }

        var targetReleaseDate = moment(targetRelease.date);
        var redactReleaseDate = moment(desiredRelease.date);
        return targetReleaseDate.isBefore(redactReleaseDate) || targetReleaseDate.isSame(redactReleaseDate);
    };

    var toggleStates = _.mapValues(releaseToggles, function (config, toggleName) {
        var ready = (config.ready === undefined || config.ready);

        if (grunt.option('release')) {
            var redactRelease = releases[grunt.option('release')];
            return isToggleReleaseBeforeDesiredRelease(config, redactRelease) && ready;
        }

        if (grunt.option('toggle')) {
            return toggleName === grunt.option('toggle');
        }

        return ready;
    });

    return {
        tasks: {
            redact: {
                toggles: toggleStates,
                releaseToggles: redactConfigWith(toggleStates),
                everythingOn: redactConfigWith(toggleStates, true)
            }
        }
    };
};


