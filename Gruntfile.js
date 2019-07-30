module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.loadTasks('grunt-tasks');

    var developmentPort = 8080;
    var styleGuidePort = process.env.STYLE_GUIDE_LISTEN_AT || 8082;
    var _ = require('lodash');

    var stubEnv = {
        mcaUsername: 'ibrefresh25@sb.co.za',
        mcaPassword: 'passwordJ123',
        cardNumber: '4451215410004246',
        personalFinanceManagementId: 2,
        cellPhoneNumber: '0788541124',
        atmPIN: '34701',
        fromAccount: 'ELITE - 08-144-462-1',
        toAccount: 'PURESAVE - 04-564-023-8',
        authContractsUsername: 'devautomation@sb.co.za',
        authContractsPassword: 'passwordJ123'
    };

    var dev2Env = {
        mcaUsername: 'contract_test_new1@sb.co.za',
        mcaPassword: 'Pro12345',
        cardNumber: '5221008363362356',
        personalFinanceManagementId: 10000,
        cellPhoneNumber: '0748433268',
        atmPIN: '19464',
        fromAccount: 'ELITE - 07-021-634-7',
        toAccount: 'PLUS PLAN - 07-341-432-8',
        authContractsUsername: 'contract_test_new1@sb.co.za',
        authContractsPassword: 'Pro12345'
    };

    var sit2Env = {
        mcaUsername: 'proexplore@sb.co.za',
        mcaPassword: 'Pro123',
        cardNumber: '5221008363362364',
        personalFinanceManagementId: 9,
        cellPhoneNumber: '0845989920',
        atmPIN: '34470',
        fromAccount: 'ELITE - 06-055-841-5',
        toAccount: 'PLUS PLAN - 07-341-433-6',
        authContractsUsername: 'proexplore@sb.co.za',
        authContractsPassword: 'Pro123'
    };

    var dev1Env = {
        mcaUsername: 'koek1@standardbank.co.za',
        mcaPassword: 'Pro123',
        cardNumber: '4890612291724919',
        personalFinanceManagementId: 2,
        cellPhoneNumber: '0742224131',
        atmPIN: '14134',
        fromAccount: 'PRESTIGE - 27-338-548-8',
        toAccount: 'CURRENT - 13-838-453-3',
        authContractsUsername: 'koek1@standardbank.co.za',
        authContractsPassword: 'Pro123'
    };

    var sit1Env = {
        mcaUsername: 'new_contract_test@sb.co.za',
        mcaPassword: 'Pro123',
        cardNumber: '5239826800036006',
        personalFinanceManagementId: 9,
        cellPhoneNumber: '0846820331',
        atmPIN: '64180',
        fromAccount: 'PRESTIGE - 20-155-981-1',
        toAccount: 'ELITE - 20-155-858-0',
        authContractsUsername: 'new_contract_test@sb.co.za',
        authContractsPassword: 'Pro123'
    };

    var prodEnv = {
        mcaUsername: 'chop.chop.sbsa@gmail.com',
        mcaPassword: 'Pro123',
        cardNumber: '5196120166505932',
        personalFinanceManagementId: 9,
        cellPhoneNumber: '0748433268',
        atmPIN: '19464',
        fromAccount: 'ELITE - 07-021-634-7',
        toAccount: 'PLUS PLAN - 07-341-432-8',
        authContractsUsername: 'chop.chop.sbsa@gmail.com',
        authContractsPassword: 'Pro123'
    };

    var environmentSpecificData = {
        local: _.merge({
            baseUrl: 'localhost',
            mcaPort: grunt.option('mca-port') || '9200',
            protractorPort: grunt.option('protractor-port') || 8888
        }, stubEnv),
        docker: _.merge({
            baseUrl: 'ibr-contracts',
            mcaPort: grunt.option('mca-port') || '9200',
            protractorPort: grunt.option('protractor-port') || 8888
        }, stubEnv),
        demo: _.merge({
            baseUrl: 'localhost',
            mcaPort: grunt.option('mca-port') || '9201',
            protractorPort: grunt.option('protractor-port') || 8887
        }, dev2Env),
        dev1: _.merge({
            baseUrl: 'dmcafhtp01.standardbank.co.za',
            mcaPort: '80'
        }, dev1Env),
        sit1: _.merge({
            baseUrl: 'sbg-chop-s1.standardbank.co.za',
            mcaPort: '443'
        }, sit1Env),
        kitchen: _.merge({
            baseUrl: '192.168.56.65',
            mcaPort: '8443'
        }, sit1Env),
        kitchen2: _.merge({
            baseUrl: '192.168.56.65',
            mcaPort: '8443'
        }, sit2Env),
        sit1_testing: _.merge({
            baseUrl: 'dchop177.standardbank.co.za',
            mcaPort: '444'
        }, sit1Env),
        dev2: _.merge({
            baseUrl: 'dchop170.standardbank.co.za',
            mcaPort: '444'
        }, dev2Env),
        sit1_inactive: _.merge({
            baseUrl: 'dchop75.standardbank.co.za',
            mcaPort: '444'
        }, sit2Env),
        prod: _.merge({
            baseUrl: 'experience.standardbank.co.za',
            mcaPort: '443'
        }, prodEnv)
    };

    var envInit = function() {
        var keys = _.keys(environmentSpecificData);
        for (var index in keys) {
            var key = keys[index];
            if (grunt.option(key.replace('_', '-'))) {
                return environmentSpecificData[key];
            }
        }
        return environmentSpecificData.local;
    };

    var currentEnv = envInit();

    var reverseProxy = [{
        context: ['/ebridge.payment.gateway-2.0/sbg-ib', '/BusinessBanking'],
        host: currentEnv.baseUrl,
        port: currentEnv.mcaPort,
        https: _.endsWith(currentEnv.mcaPort, '443') || currentEnv.mcaPort === '444',
        changeOrigin: false,
        forward: false,
        xforward: true
    }];

    var fakeLocationHeaders = function(req, res, next) {
        req.headers.host = '';
        req.headers.referer = '';
        req.headers.origin = '';
        return next();
    };

    var useReverseProxy = function(connect, options) {
        var proxy = require('grunt-connect-proxy/lib/utils').proxyRequest;
        return [
            fakeLocationHeaders,
            proxy, // include the proxy first
            connect().use(
                '/bower_components',

                connect.static('target/bower_components')
            ),
            connect.static(options.base),
            connect.directory(options.base) // serve static files
        ];
    };

    var jsSource = [
        'src/main/**/*Module.js',
        'src/main/domain/**/*.js',
        'src/main/common/**/*.js',
        'src/main/features/**/*.js'
    ];

    var source = [jsSource, 'src/toggle/*.json'];

    var baseProtractorArgs = {
        chromeDriver: 'node_modules/chromedriver/bin/chromedriver',
        seleniumServerJar: process.platform === 'linux' ? undefined :
        'node_modules/selenium-server/lib/runner/selenium-server-standalone-2.35.0.jar',
        directConnect: process.platform === 'linux',
        splitTestsBetweenCapabilities: true
    };

    var monolithicConfigs = {
        connect: {
            server: {
                options: {
                    port: developmentPort,
                    base: 'target/main',
                    hostname: '0.0.0.0',
                    middleware: useReverseProxy,
                    protocol: 'https'
                },
                proxies: reverseProxy
            },
            distri: {
                options: {
                    port: 8081,
                    base: 'distri/main',
                    hostname: '0.0.0.0',
                    middleware: useReverseProxy,
                    protocol: 'https',
                    keepalive: true
                },
                proxies: reverseProxy
            },
            styleguide: {
                options: {
                    port: styleGuidePort,
                    base: 'target/main',
                    hostname: '0.0.0.0',
                    middleware: useReverseProxy,
                    protocol: 'http',
                    keepalive: grunt.option('no-open')
                },
                proxies: reverseProxy
            },
            acceptance: {
                options: {
                    port: currentEnv.protractorPort,
                    base: 'target/main',
                    hostname: '0.0.0.0',
                    middleware: useReverseProxy,
                    protocol: 'https'
                },
                proxies: reverseProxy
            },
            acceptance_fast: {
                options: {
                    port: 8884,
                    base: 'target/main',
                    middleware: useReverseProxy,
                    protocol: 'https'
                },
                proxies: reverseProxy
            },
            e2e: {
                options: {
                    port: 8889,
                    base: 'distri/main',
                    middleware: useReverseProxy,
                    protocol: 'https'
                },
                proxies: reverseProxy
            },
            smoke: {
                options: {
                    port: 8890,
                    base: 'distri/main',
                    middleware: useReverseProxy,
                    protocol: 'https'
                }
            }
        },
        open: {
            dev: {
                path: 'https://localhost:' + developmentPort + '/index.html'
            },
            distri: {
                path: 'https://localhost:8081/'
            },
            coverage: {
                path: 'target/test/unit/report/coverage/index.html'
            },
            styleguide: {
                path: 'http://localhost:' + styleGuidePort + '/styleguide.html'
            }
        },
        watch: {
            options: {
                livereload: true
            },
            js: {
                files: source,
                tasks: ['includeSource', 'copy:jsToTarget', 'redact:releaseToggles']
            },
            bower: {
                files: ['bower.json'],
                tasks: ['bower:install', 'wiredep']
            },
            html: {
                files: 'src/main/**/*.html',
                tasks: ['copy:htmlToTarget', 'redact:releaseToggles']
            },
            sass: {
                files: ['src/main/**/*.scss'],
                tasks: ['copy:sassToTarget', 'sass']
            }
        },
        karma: {
            unit: {
                configFile: 'target/test/config/karma.conf.js',
                singleRun: true
            },
            debug: {
                configFile: 'target/test/config/karma_debug.conf.js',
                singleRun: true
            },
            docker: {
                configFile: 'target/test/config/karma.docker.conf.js'
            },
            watch: {
                configFile: 'src/test/config/karma.conf.js'
            }
        },
        protractor: {
            options: {
                args: baseProtractorArgs
            },
            acceptance: {
                options: {
                    configFile: 'target/test/config/protractor.acceptance.conf.js',
                    keepAlive: false,
                    args: _.merge({
                        baseUrl: 'https://localhost:' + currentEnv.protractorPort + '/'
                    }, baseProtractorArgs)
                }
            },
            acceptance_docker_jasmine: {
                options: {
                    configFile: 'target/test/config/protractor-grid/docker.jasmine.js',
                    keepAlive: false,
                    args: {}
                }
            },
            acceptance_docker_cucumber: {
                options: {
                    configFile: 'target/test/config/protractor-grid/docker.cucumber.js',
                    keepAlive: false,
                    args: {
                        cucumberOpts: {
                            tags: grunt.option('tags')
                        }
                    }
                }
            },
            acceptance_fast: {
                options: {
                    configFile: 'target/test/config/protractor.acceptance.fast.conf.js',
                    keepAlive: false,
                    args: _.merge({
                        baseUrl: 'https://localhost:8884/'
                    }, baseProtractorArgs)
                }
            },
            acceptance_debug: {
                options: {
                    configFile: 'target/test/config/protractor.acceptance.debug.conf.js',
                    keepAlive: false,
                    args: _.merge({
                        baseUrl: 'https://localhost:' + currentEnv.protractorPort + '/'
                    }, baseProtractorArgs)
                }
            },

            acceptance_cucumber: {
                options: {
                    configFile: 'target/test/config/protractor.acceptance.cucumber.conf.js',
                    keepAlive: false,
                    args: _.merge({
                        cucumberOpts: {
                            tags: grunt.option('tags')
                        },
                        baseUrl: 'https://localhost:' + currentEnv.protractorPort + '/'
                    }, baseProtractorArgs)
                }
            },
            smoke_against_local: {
                options: {
                    configFile: 'target/test/config/protractor.smoke.conf.js',
                    keepAlive: true,
                    args: _.merge({
                        baseUrl: 'https://localhost:8890/'
                    }, baseProtractorArgs)
                }
            },
            smoke_against_deployed: {
                options: {
                    configFile: 'target/test/config/protractor.smoke.conf.js',
                    keepAlive: true,
                    args: _.merge({
                        baseUrl: grunt.option('deployedAppUrl')
                    }, baseProtractorArgs)
                }
            },
            e2e_against_local: {
                options: {
                    configFile: 'target/test/config/protractor.e2e.conf.js',
                    keepAlive: true,
                    args: _.merge({
                        baseUrl: 'https://localhost:8889/'
                    }, baseProtractorArgs)
                }
            },
            e2e_against_deployed: {
                options: {
                    configFile: 'target/test/config/protractor.e2e.conf.js',
                    keepAlive: true,
                    args: _.merge({
                        baseUrl: grunt.option('deployedAppUrl')
                    }, baseProtractorArgs)
                }
        },
            e2e_cucumber_against_deployed: {
                options: {
                    configFile: 'target/test/config/protractor.e2e.cucumber.conf.js',
                    keepAlive: true,
                    args: _.merge({
                        cucumberOpts: {
                            tags: grunt.option('tags')
                        },
                        baseUrl: grunt.option('deployedAppUrl') || 'https://dchop177.standardbank.co.za:444/#/'
                    }, baseProtractorArgs)
                }
            },
        },
        sass: {
            dev: {
                options: {
                    includePaths: [
                        'target/main/assets/stylesheets/sass/**/*.sass'
                    ],
                    sourceMap: true
                },
                files: [{
                    "target/main/assets/stylesheets/css/app.css": "target/main/assets/stylesheets/sass/app.scss"
                }, {
                    "target/main/assets/stylesheets/css/style_guide.css": "target/main/assets/stylesheets/sass/style_guide.scss"
                }, {
                    "target/main/assets/ie/css/ie9.css": "target/main/assets/stylesheets/sass/ie9.scss"
                }, {
                    "target/main/assets/ie/css/upgrade_your_browser.css": "target/main/assets/stylesheets/sass/upgrade_your_browser.scss"
                }]
            }
        },
        exec: {
            create_full_source_package: {
                cmd: 'mkdir -p distri && tar -czph --exclude=distri -f distri/ibrefresh.tgz ./'
            },
            create_distributable_package: {
                cmd: 'cd distri/main && tar -czph -f ../' + (grunt.option('packageName') || 'ibrefresh_distributable.tgz') +
                    ' ./'
            },
            package_screenshots: {
                cmd: 'mkdir -p distri && zip -j -r distri/screenshots.zip reports/acceptance/screenshots/'
            },
            package_e2e_screenshots: {
                cmd: 'mkdir -p distri && zip -j -r distri/e2e_screenshots.zip reports/e2e/screenshots/'
            },
            package_coverage: {
                cmd: 'mkdir -p distri && cd reports/coverage/* && zip -r ../../../distri/coverage.zip ./ && cd -'
            },
            package_build_number: {
                cmd: 'mkdir -p distri/main && cd distri/main && echo { \\"buildVersion\\": \\"' + grunt.option('build-version') +
                    '\\", \\"gitRevision\\": \\"' + grunt.option('scm-revision') + '\\" } > version.json'
            },
            clean_test_debug_flags: {
                cmd: "find src/test -name '*.js' -exec perl -pi -e 's/^([ ]*)([fd](describe)|[fi](it))[ ]*[(]/$1$3$4(/' {} \\;"
            },
            clean_acceptance_debug_flags: {
                cmd: "find src/test -name '*.js' -exec perl -pi -e 's/[ ]*browser\.pause[(][)];?[ ]*[\r\n]+//m' {} \\;"
            },
            kill_existing_styleguide_server: {
                cmd: "lsof -Fp -i :" + styleGuidePort + " | sed 's/p//' | xargs kill"
            }
        },
        copy: {
            srcToTarget: {
                expand: true,
                cwd: 'src/',
                src: ['main/.htaccess', '**'],
                dest: 'target/'
            },
            jsToTarget: {
                expand: true,
                cwd: 'src/',
                src: jsSource.map(function(dir) {
                    return dir.replace('src/', '');
                }),
                dest: 'target/'
            },
            sassToTarget: {
                expand: true,
                cwd: 'src/main/assets/stylesheets/sass/',
                src: '**/*.scss',
                dest: 'target/main/assets/stylesheets/sass/'
            },
            testsToTarget: {
                expand: true,
                cwd: 'src/test/',
                src: '**/*.js',
                dest: 'target/test/'
            },
            htmlToTarget: {
                expand: true,
                cwd: 'src/main/',
                src: '**/*.html',
                dest: 'target/main/'
            },
            targetToDist: {
                files: [{
                    expand: true,
                    cwd: 'target/main',
                    dest: 'distri/main',
                    src: ['.htaccess',
                        '**/*.min.js',
                        '**/*.min*.css',
                        'assets/ie/**/*.js',
                        'assets/ie/**/*.swf',
                        'assets/ie/**/*.css',
                        'assets/fonts/*',
                        'assets/images/**',
                        'assets/js/analytics/**/*.js',
                        '**/*.html',
                        '!styleguide/**',
                        '!styleguide.html'
                    ]
                }]
            },
            targetToDistLazyLoadedFiles: {
                files: [{
                    expand: true,
                    cwd: 'target',
                    dest: 'distri/main',
                    src: [
                        'bower_components/pdfmake/build/pdfmake.min.js',
                        'bower_components/pdfmake/build/vfs_fonts.js'
                    ]
                }]
            },
            unitResults: {
                expand: true,
                cwd: 'target/test/unit/report/junit/',
                src: '**/*',
                dest: 'reports/unit/'
            },
            coverageResults: {
                expand: true,
                cwd: 'target/test/unit/report/coverage/',
                src: '*/**/*',
                dest: 'reports/coverage/'
            },
            acceptanceResults: {
                expand: true,
                cwd: 'target/test/functional/acceptance/reports/',
                src: '**/*',
                dest: 'reports/acceptance/'
            },
            e2eResults: {
                expand: true,
                cwd: 'target/test/functional/e2e/reports/',
                src: '**/*',
                dest: 'reports/e2e/'
            }
        },
        env: {
            setVariables: {
                MCA_USERNAME: grunt.option('mcaUsername') || currentEnv.mcaUsername,
                MCA_PASSWORD: grunt.option('mcaPassword') || currentEnv.mcaPassword,
                CARD_NUMBER: currentEnv.cardNumber,
                PERSONAL_FINANCE_MANAGEMENT_ID: currentEnv.personalFinanceManagementId,
                ATM_PIN: currentEnv.atmPIN,
                CELLPHONE_NUMBER: currentEnv.cellPhoneNumber,
                FROM_ACCOUNT: currentEnv.fromAccount,
                TO_ACCOUNT: currentEnv.toAccount,
                AUTH_CONTRACTS_USERNAME: currentEnv.authContractsUsername,
                AUTH_CONTRACTS_PASSWORD: currentEnv.authContractsPassword
            }
        },

        bower: {
            install: {
                options: {
                    copy: false
                }
            }
        },

        bower_concat: {
            all: {
                dependencies: {
                    'angular': ['jquery', 'jquery.scrollTo', 'jquery-color']
                },
                exclude: ['pdfmake'],
                dest: 'target/main/bower.concat.js',
                callback: function(mainFiles) {
                    return _.map(mainFiles, function(filepath) {
                        // Use minified files if available
                        var min = filepath.replace(/\.js$/, '.min.js');
                        return grunt.file.exists(min) ? min : filepath;
                    });
                }
            }
        },

        concat: {
            options: {
                separator: ';'
            },
            distri: {
                src: [
                    'target/main/bower.concat.js',
                    'target/main/assets/js/lib/**/*.js',
                    'target/main/**/*Module.js',
                    'target/main/domain/**/*.js',
                    'target/main/common/**/*.js',
                    'target/main/features/**/*.js'
                ],
                dest: 'target/main/refresh.concat.js'
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            distri: {
                files: {
                    'target/main/refresh.min.js': ['target/main/refresh.concat.js']
                }
            }
        },
        usemin: {
            html: 'target/main/index.html'
        },
        cssmin: {
            combine: {
                files: {
                    'target/main/assets/stylesheets/css/app.min.css': ['target/main/assets/stylesheets/css/app.css'],
                    'target/main/assets/stylesheets/css/style_guide.min.css': ['target/main/assets/stylesheets/css/style_guide.css']
                }
            }
        },
        bless: {
            options: {
                force: true,
                logCount: true
            },
            css: {
                files: {
                    'target/main/assets/stylesheets/css/app.min.css': 'target/main/assets/stylesheets/css/app.min.css'
                }
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                'src/main/domain/**/*.js',
                'src/main/common/**/*.js',
                'src/main/features/**/*.js',
                'src/test/**/*.js',
                '!src/test/config/**/*.js',
                '!src/test/unit/report/**/*.js',
                '!src/test/unit/coverage/**/*.js',
                '!src/test/lib/**/*.js'
            ]
        },
        'ddescribe-iit': {
            files: [
                'src/test/**/*.js'
            ]
        },
        includeSource: {
            client: {
                files: {
                    'src/main/index.html': 'src/main/index.html'
                }
            }
        },
        wiredep: {
            app: {
                src: ['src/main/index.html']
            },
            styleGuide: {
                src: ['src/main/styleguide/styleguide.html']
            },
            test: {
                src: ['src/test/config/karma.conf.js'],
                ignorePath: '../../',
                exclude: [/(.*\.min\.js)/gi],
                devDependencies: true
            }
        },
        mkdir: {
            acceptanceReports: {
                options: {
                    create: ['target/test/functional/acceptance/reports/junit',
                        'target/test/functional/acceptance/reports/screenshots'
                    ]
                }
            },
            e2eReports: {
                options: {
                    create: ['target/test/functional/e2e/reports/junit',
                        'target/test/functional/e2e/reports/screenshots'
                    ]
                }
            },
            smokeReports: {
                options: {
                    create: ['target/test/functional/smoke/reports/junit',
                        'target/test/functional/smoke/reports/screenshots'
                    ]
                }
            }
        }
    };

    var configOptions = {
        config: {
            src: 'grunt-config/*'
        }
    };
    var modularizedConfigs = require('load-grunt-configs')(grunt, configOptions);
    grunt.initConfig(_.merge(monolithicConfigs, modularizedConfigs));

    grunt.registerTask('ci:unit', "Unit tests on CI", [
        'ddescribe-iit',
        'clean:all',
        'test:unit',
        'copy:unitResults',
        'copy:coverageResults'
    ]);

    grunt.registerTask('package', "Create the IBR artifact", [
        'exec:package_build_number',
        'copy:srcToTarget',
        'redact:releaseToggles',
        'sass',
        'minify',
        'copy:targetToDist',
        'copy:targetToDistLazyLoadedFiles',
        'exec:create_distributable_package'
    ]);

    grunt.registerTask('test:unit', "Run all unit tests for all features", [
        'clean:unit',
        'copy:srcToTarget',
        'ddescribe-iit',
        'jshint',
        'redact:everythingOn',
        'karma:unit'
    ]);

    grunt.registerTask('test:debug', "Run unit tests without coverage for debug", [
        'clean:unit',
        'copy:srcToTarget',
        'redact:everythingOn',
        'karma:debug'
    ]);

    grunt.registerTask('test:docker', "Run unit tests without coverage for debug", [
        'clean:unit',
        'copy:srcToTarget',
        'ddescribe-iit',
        'jshint',
        'redact:everythingOn',
        'karma:docker'
    ]);

    grunt.registerTask('setup_functional_tests', "Set up environment to run functional tests", [
        'env:setVariables',
        'clean:functional',
        'copy:srcToTarget',
        'redact:releaseToggles',
        'sass',
        'configureProxies:server',
        'minify'
    ]);

    grunt.registerTask('setup_e2e_functional_tests', "Set up environment to run E2E tests", [
        'setup_functional_tests',
        'mkdir:e2eReports',
        'copy:targetToDist',
        'copy:targetToDistLazyLoadedFiles'
    ]);

    grunt.registerTask('check_stub', 'Checks if stub server is up and running', function() {
        var http = require('http');
        var done = this.async();
        var url = 'http://'+ currentEnv.baseUrl + ':' + currentEnv.mcaPort + '/sbg-ib/rest/VersionService/Version';

        grunt.verbose.write('Verifying if stub server is available on ' + url + '...');
        http.get(url, function(response) {
            response.on('data', function(data) {
                var version = data.toString();
                if (version.match(/STUB/)) {
                    grunt.verbose.ok();
                    done();
                } else {
                    grunt.fail.warn('Please ensure that the stub server is running, expected STUB version but got ' + version);
                    done('Stub server is not running on port ' + currentEnv.mcaPort + '!');
                }
            });
        });
    });

    grunt.registerTask('setup_acceptance', "Set up environment to run acceptance tests", [
        'check_stub',
        'setup_functional_tests',
        'mkdir:acceptanceReports',
        'connect:acceptance'
    ]);

    grunt.registerTask('acceptance', "Run acceptance test suite using Chrome", [
        'ddescribe-iit',
        'setup_acceptance',
        'protractor:acceptance'
    ]);

    grunt.registerTask('acceptance:docker_jasmine', "Run acceptance test suite using Chrome", [
        'setup_acceptance',
        'protractor:acceptance_docker_jasmine'
    ]);

    grunt.registerTask('acceptance:docker_cucumber', "Run acceptance test suite using Chrome", [
        'setup_acceptance',
        'protractor:acceptance_docker_cucumber'
    ]);


    grunt.registerTask('acceptance:debug', "Run acceptance test suite using Chrome", [
        'setup_acceptance',
        'protractor:acceptance_debug'
    ]);

    grunt.registerTask('acceptance:cucumber', "Run cucumber acceptance test suite using Chrome", [
        'setup_acceptance',
        'convert_toggles_to_tags',
        'protractor:acceptance_cucumber'
    ]);

    grunt.registerTask('acceptance:debugtest', "Debug acceptance test", [
        'env:setVariables',
        'copy:testsToTarget',
        'configureProxies:server',
        'connect:acceptance',
        'protractor:debug'
    ]);

    grunt.registerTask('smoke', "Run smoke test suite locally", [
        'ddescribe-iit',
        'setup_e2e_functional_tests',
        'mkdir:smokeReports',
        'connect:smoke',
        'protractor:smoke_against_local'
    ]);

    grunt.registerTask('e2e', "Run end-to-end test suite locally", [
        'ddescribe-iit',
        'setup_e2e_functional_tests',
        'connect:e2e',
        'protractor:e2e_against_local'
    ]);

    grunt.registerTask('smoke:deployed', "Runs smoke test suite against a deployed environment", [
        'clean:all',
        'env:setVariables',
        'copy:srcToTarget',
        'mkdir:smokeReports',
        'redact:releaseToggles',
        'protractor:smoke_against_deployed'
    ]);

    grunt.registerTask('e2e:deployed', "Run end-to-end test suite against a deployed environment", [
        'clean:all',
        'env:setVariables',
        'copy:srcToTarget',
        'mkdir:e2eReports',
        'redact:releaseToggles',
        'protractor:e2e_against_deployed'
    ]);

    grunt.registerTask('e2e:cucumber', "Run end-to-end test suite against a deployed environment", [
        'clean:all',
        'env:setVariables',
        'copy:srcToTarget',
        'mkdir:e2eReports',
        'redact:releaseToggles',
        'protractor:e2e_cucumber_against_deployed'
    ]);

    grunt.registerTask('e2e:ci', "Run CI end-to-end test suite and package reports", [
        'e2e',
        'copy:e2eResults',
        'exec:package_e2e_screenshots'
    ]);

    grunt.registerTask('compile', "Clean and copy all the current static files", [
        'includeSource',
        'wiredep:app',
        'clean:all',
        'copy:srcToTarget',
        'redact:releaseToggles',
        'sass'
    ]);

    grunt.registerTask('start:server', [
        'compile',
        'connect:server',
        'configureProxies:server'
    ]);

    grunt.registerTask('develop', "Run the development server", [
        'start:server',
        'open:dev',
        'watch'
    ]);

    grunt.registerTask('develop:docker', "Run the development server", [
        'start:server',
        'watch'
    ]);

    grunt.registerTask('start:distri', 'Run the development server against packaged code', ['clean:all',
        'copy:srcToTarget',
        'redact:releaseToggles',
        'sass',
        'minify',
        'copy:targetToDist',
        'copy:targetToDistLazyLoadedFiles',
        'configureProxies:server',
        'connect:distri'
    ]);

    grunt.registerTask('start:styleguide', 'Run the demo server for style guide', [
        'compile',
        'connect:styleguide'
    ]);

    grunt.registerTask('fdclean', 'alias for removing fdescribes and fits', [
        'exec:clean_test_debug_flags'
    ]);

    grunt.registerTask('debugclean', 'remove all debug tags', [
        'fdclean',
        'exec:clean_acceptance_debug_flags'
    ]);

    grunt.registerTask('minify', "Concat and minify JS and CSS files", [
        'bower_concat',
        'concat',
        'uglify',
        'cssmin',
        'usemin',
        'bless'
    ]);

    grunt.registerTask('metrics:ci', "Run plato code complexity tool and custom metrics, packaging results for CI", [
        'metrics:custom:ci',
        'metrics:plato:ci'
    ]);

    grunt.registerTask('default', "Run current unit tests and acceptance tests", [
        'debugclean',
        'clean:all',
        'test:unit',
        'acceptance',
        'convert_toggles_to_tags',
        'protractor:acceptance_cucumber'
    ]);

    grunt.registerTask('fast', "Run current unit tests and acceptance tests", [
        'debugclean',
        'clean:all',
        'test:unit',
        'acceptance_fast',
        'acceptance:cucumber'
    ]);

    grunt.registerTask('acceptance_fast', "Run acceptance test suite using Chrome", [
        'ddescribe-iit',
        'setup_acceptance_fast',
        'protractor:acceptance_fast'
    ]);

    grunt.registerTask('setup_acceptance_fast', "Set up environment to run acceptance tests", [
        'check_stub',
        'setup_functional_tests',
        'mkdir:acceptanceReports',
        'connect:acceptance_fast'
    ]);

    grunt.registerTask('styleguide', "Run style guide server", [
        'start:styleguide',
        'open:styleguide',
        'watch'
    ]);
};
