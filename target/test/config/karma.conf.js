module.exports = function (config) {
    "use strict";
    config.set({
        basePath: '../../',

        files: [
            'test/lib/sinon-1.12.1.js',
            'test/lib/offlineJS_Mocks.js',
            // bower:js
            'bower_components/jquery/jquery.js',
            'bower_components/jquery.scrollTo/jquery.scrollTo.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-animate/angular-animate.js',
            'bower_components/angular-cookie/angular-cookie.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/angular-base64/angular-base64.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/angular-sanitize/angular-sanitize.js',
            'bower_components/moment/moment.js',
            'bower_components/pdfmake/build/pdfmake.js',
            'bower_components/lodash/lodash.js',
            'bower_components/pdfmake/build/vfs_fonts.js',
            'bower_components/chartjs/Chart.js',
            'bower_components/flux-angular/release/flux-angular.js',
            'bower_components/angular-messages/angular-messages.js',
            // endbower
            'bower_components/angular-cache/dist/angular-cache.js',
            'main/assets/js/lib/**/*.js',
            'test/lib/feature.js',
            'main/**/*Module.js',
            'main/domain/**/*.js',
            'main/common/**/*.js',
            'main/features/**/*.js',
            'test/lib/promise-mocker.js',
            'test/lib/builders.js',
            'test/lib/chance.js',
            '../node_modules/jasmine-promise-matchers/src/main.js',
            'test/helpers/*.js',
            'test/unit/**/*.js',
            'test/integration/**/*.js',
            {
                pattern: 'test/unit/fixtures/*.json',
                watched: true,
                served: true,
                included: false
            }, {
                pattern: 'main/**/partials/**/*.html',
                watched: true,
                served: true,
                included: false
            },
            {
                pattern: 'toggle/*.json',
                watched: true,
                served: true,
                included: false
            }
        ],

        exclude: [
            '**/report/**/*'
        ],

        reporters: ['progress', 'junit', 'coverage', 'html'],

        preprocessors: {
            'main/features/**/!(accountOrigination|overviewMenu|businessBanking).js': ['coverage'],
            'main/common/**/!(autoLogin|fixIeSelect|lookups|singleSignOnFlow).js': ['coverage']
        },

        junitReporter: {
            outputDir: 'test/unit/report/junit/',
            outputFile: undefined,
            suite: ''
        },

        htmlReporter: {
            outputFile: 'test/unit/report/junit/test-results.html'
        },

        coverageReporter: {
            check: {
                each: {
                    'statements': 100,
                    'branches': 100,
                    'lines': 100,
                    'functions': 100
                }
            },
            reporters: [
                {type: 'json'},
                {type: 'html'}
            ],
            dir: 'test/unit/report/coverage/',
            subdir: '.'
        },

        // to avoid DISCONNECTED messages
        browserDisconnectTimeout: 10000, // default 2000
        browserDisconnectTolerance: 1, // default 0
        browserNoActivityTimeout: 60000, //default 10000

        //reportSlowerThan: 100,

        autoWatch: true,

        frameworks: ['jasmine'],

        browsers: ['Chrome'],

        plugins: [
            'karma-chrome-launcher',
            'karma-junit-reporter',
            'karma-jasmine',
            'karma-coverage',
            'karma-htmlfile-reporter'
        ]
    });
};