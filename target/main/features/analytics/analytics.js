(function (app) {
    'use strict';

    app.service('AnalyticsService', function (Card) {
        var currentPage;

        var prettyPathFromURL = function (fullUrl) {
            return fullUrl.toLowerCase().replace(/^.+#\//, '').replace(/\//g, ':').replace('-', ' ');
        };

        var getUserStatus = function () {
            return Card.anySelected() ? 'loggedin' : 'guest';
        };

        var cleanS = function () {
            ['prop1', 'prop2', 'prop3', 'prop4', 'prop38', 'prop39', 'eVar3', 'eVar15', 'eVar35', 'eVar49'].forEach(function (property) {
                delete s[property];
            });
        };

        var cleanPathId = function (prettyPath) {
            return prettyPath
                .replace(/^(.*pay multiple(:confirm|:results)?).*$/, '$1')
                .replace(/^(.*:view).*$/, '$1')
                .replace(/^(.*account preferences).*$/, '$1')
                .replace(/^(.*(statements:provisional|payment notification:history)).*$/, '$1');
        };

        var modifyFunctionsForNavigation = {
            'register,account sharing:invitation details': function (analyticsProperties) {
                analyticsProperties.pageName = 'obb:accept invite step2 register new user';
                analyticsProperties.category = 'obb';
            },
            'register,.*': function (analyticsProperties) {
                analyticsProperties.pageName = 'registration:step1';
                analyticsProperties.category = 'registration';
                analyticsProperties.stepStarted = 'registration step1';
                analyticsProperties.events.push('event6');
            },
            'otp:verify,register': function (analyticsProperties) {
                analyticsProperties.pageName = 'registration:step2 verify';
                analyticsProperties.category = 'registration';
                analyticsProperties.stepCompleted = 'registration step1';
                analyticsProperties.stepStarted = 'registration step2 verify';
                analyticsProperties.events.push('event6');
            },
            'linkcard,.*': function (analyticsProperties) {
                analyticsProperties.pageName = 'registration:step3 linkcard';
                analyticsProperties.category = 'registration';
                analyticsProperties.stepCompleted = 'registration step2 otp';
                analyticsProperties.stepStarted = 'registration step3 linkcard';
                analyticsProperties.events.push('event6');
            },
            'otp:verify,linkcard': function (analyticsProperties) {
                analyticsProperties.pageName = 'registration:step4 otp';
                analyticsProperties.category = 'registration';
                analyticsProperties.stepCompleted = 'registration step3 linkcard';
                analyticsProperties.stepStarted = 'registration step4 otp';
                analyticsProperties.events.push('event6');
            },
            'account summary,otp:verify': function (analyticsProperties) {
                analyticsProperties.events.push('event2');
                analyticsProperties.events.push('event5');
                analyticsProperties.stepCompleted = 'registration step4 otp';
            },
            'reset password,.*': function (analyticsProperties) {
                analyticsProperties.pageName = 'reset password:step1';
                analyticsProperties.category = 'reset password';
            },
            'otp:verify,reset password': function (analyticsProperties) {
                analyticsProperties.pageName = 'reset password:step2 otp';
                analyticsProperties.category = 'reset password';
            },
            'beneficiaries:add,.*': function (analyticsProperties) {
                analyticsProperties.pageName = 'beneficiaries:add step1';
                analyticsProperties.category = 'beneficiaries';
            },
            'otp:verify,beneficiaries:add': function (analyticsProperties) {
                analyticsProperties.pageName = 'beneficiaries:add step2 otp';
                analyticsProperties.category = 'beneficiaries';
            },
            'beneficiaries:edit,.*': function (analyticsProperties) {
                analyticsProperties.pageName = 'beneficiaries:edit step1';
                analyticsProperties.category = 'beneficiaries';
            },
            'otp:verify,beneficiaries:edit': function (analyticsProperties) {
                analyticsProperties.pageName = 'beneficiaries:edit step2 otp';
                analyticsProperties.category = 'beneficiaries';
            },
            'payment:onceoff:confirm,.*': function (analyticsProperties) {
                analyticsProperties.pageName = 'payment:onceoff step2 confirm';
                analyticsProperties.category = 'payment';
            },
            'otp:verify,payment:onceoff': function (analyticsProperties) {
                analyticsProperties.pageName = 'payment:onceoff step3 otp';
                analyticsProperties.category = 'payment';
            },
            'payment:onceoff:success,.*': function (analyticsProperties) {
                analyticsProperties.pageName = 'payment:onceoff step4 success';
                analyticsProperties.category = 'payment';
            },
            'payment:onceoff,.*': function (analyticsProperties) {
                analyticsProperties.pageName = 'payment:onceoff step1';
                analyticsProperties.category = 'payment';
            },
            'account summary,login': function (analyticsProperties) {
                analyticsProperties.events.push('event2');
            },

            //Account Sharing/Online Business Banking (OBB) Journeys
            //Edit User Details
           'account sharing:users:([0-9]+):details:confirm,account sharing:users:([0-9]+):details': function (analyticsProperties) {
                analyticsProperties.pageName = 'obb:edit user step2 confirm';
                analyticsProperties.category = 'obb';
            },
            'account sharing:users:([0-9]+):details,.*': function (analyticsProperties) {

                analyticsProperties.pageName = 'obb:edit user step1';
                analyticsProperties.category = 'obb';
            },
            //Edit User Permissions
            'account sharing:users:([0-9]+):permissions:confirm,account sharing:users:([0-9]+):permissions': function (analyticsProperties) {

                analyticsProperties.pageName = 'obb:edit permissions step2 confirm';
                analyticsProperties.category = 'obb';
            },
            'account sharing:users:([0-9]+):permissions,.*': function (analyticsProperties) {

                analyticsProperties.pageName = 'obb:edit permissions step1';
                analyticsProperties.category = 'obb';
            },
            //Add/Invite new user or edit invitation
            'account sharing:user:details,account sharing:invitation:*': function (analyticsProperties) {
                analyticsProperties.pageName = 'obb:edit invite step1 user details';
                analyticsProperties.category = 'obb';
            },
            'account sharing:user:details,.*': function (analyticsProperties) {
                analyticsProperties.pageName = 'obb:add user (edit invitation) step1';
                analyticsProperties.category = 'obb';
            },
            'account sharing:user:permissions,account sharing:user:details': function (analyticsProperties) {
                analyticsProperties.pageName = 'obb:add user (edit invitation) step2 permissions';
                analyticsProperties.category = 'obb';
            },
            'account sharing:user:confirm,account sharing:user:permissions': function (analyticsProperties) {
                analyticsProperties.pageName = 'obb:add user (edit invitation) step3 confirm';
                analyticsProperties.category = 'obb';
            },
            'otp:verify,account sharing:user:confirm': function (analyticsProperties) {
                analyticsProperties.pageName = 'obb:add user (edit invitation) step4 otp';
                analyticsProperties.category = 'obb';
            },
            'account sharing:user:finish,otp:verify': function (analyticsProperties) {
                analyticsProperties.pageName = 'obb:add user (edit invitation) step5 finish';
                analyticsProperties.category = 'obb';
            },
            //Accept Invitation
            'account sharing:invitation details,.*': function (analyticsProperties) {
                analyticsProperties.pageName = 'obb:accept invite step1';
                analyticsProperties.category = 'obb';
            },
            'login,account sharing:invitation details': function (analyticsProperties) {
                analyticsProperties.pageName = 'obb:accept invite step2 login existing user';
                analyticsProperties.category = 'obb';
            },
            'account sharing:accept decline invitation,login': function (analyticsProperties) {
                analyticsProperties.pageName = 'obb:accept invite step3 invite summary & accept terms';
                analyticsProperties.category = 'obb';
            },
            'otp:verify,account sharing:accept decline invitation': function (analyticsProperties) {
                analyticsProperties.pageName = 'obb:accept invite step4 otp';
                analyticsProperties.category = 'obb';
            },
            //Pending user invitations
            'account sharing:invitation:*,account sharing:operators': function (analyticsProperties) {
                analyticsProperties.pageName = 'obb:pending invite details';
                analyticsProperties.category = 'obb';
            },

            undefined: function () {
            }
        };

        var matchNavigationFor = function (currentPath, previousPath) {
            var navigationMatch = Object.keys(modifyFunctionsForNavigation).filter(function (element) {
                var navigationPaths = element.split(',');
                return new RegExp(navigationPaths[0]).test(currentPath) &&
                    new RegExp(navigationPaths[1]).test(previousPath);
            });

            return navigationMatch[0];
        };

        var modifyPropertiesForNavigation = function (currentPath, previousPath, properties) {
            var modifyFunction = modifyFunctionsForNavigation[matchNavigationFor(currentPath, previousPath)];
            modifyFunction(properties);
        };

        var setSubSections = function (pageName) {
            pageName.split(':').reduce(function (section, subSection, index) {
                section = (section + ":" + subSection).replace(/^:/, '');
                s[('prop' + (index + 1))] = section;

                return section;
            }, '');
        };

        var sendTrackingInfo = function (linkTrackVars, events, props, propValue, trackName, trackType) {
            cleanS();

            var s = s_gi(s_account);
            s.linkTrackVars = linkTrackVars;
            s.linkTrackEvents = events;
            s.events = events;
            props.forEach(function (prop) {
                s[prop] = propValue;
            });

            s.tl(true, trackType || 'o', trackName);
        };

        return {
            sendPageView: function (currentUrl, previousUrl) {
                cleanS();

                var currentPrettyPath = cleanPathId(prettyPathFromURL(currentUrl));
                var previousPrettyPath = prettyPathFromURL(previousUrl);
                currentPage = currentPrettyPath;
                var analyticsProperties = {
                    pageName: currentPrettyPath,
                    category: currentPrettyPath.split(':')[0],
                    events: []
                };

                modifyPropertiesForNavigation(currentPrettyPath, previousPrettyPath, analyticsProperties);

                s.pageName = analyticsProperties.pageName;
                s.channel = analyticsProperties.category;
                s.server = 'IB Refresh';
                s.eVar15 = getUserStatus();
                s.prop38 = s.eVar49 = analyticsProperties.stepStarted;
                s.events = analyticsProperties.events.join(',');
                setSubSections(analyticsProperties.pageName);

                s.t();

                if (analyticsProperties.stepCompleted) {
                    sendTrackingInfo('eVar49,prop38,events,channel,server', 'event7', ['prop38', 'eVar49'], analyticsProperties.stepCompleted, analyticsProperties.stepCompleted);
                }
            },

            sendError: function (errorMessage) {
                errorMessage = errorMessage ? ' - ' + errorMessage : '';
                sendTrackingInfo('prop39,eVar3,events,channel,server', 'event29', ['prop39', 'eVar3'], currentPage + errorMessage, currentPage + ' - Error');
            },

            sendButtonClick: function (buttonName) {
                sendTrackingInfo('eVar35,events,channel,server', 'event27', ['eVar35'], buttonName, currentPage + ' - Button clicked', 'o');
            }
        };
    });

    app.directive('analytics', function (AnalyticsService, AnalyticsContainer, $location) {
        return {
            restrict: 'E',
            templateUrl: 'features/analytics/partials/analytics.html',

            link: function ($scope) {
                AnalyticsContainer.containerUrlForHost().then(function (containerUrl) {
                    $.ajax({
                        url: containerUrl,
                        dataType: 'script',
                        cache: true
                    }).done(function () {
                        AnalyticsService.sendPageView($location.absUrl(), $location.absUrl());

                        $scope.$on('$locationChangeSuccess', function (event, current, previous) {
                            AnalyticsService.sendPageView(current, previous);
                        });

                        $scope.$on('unsuccessfulMcaResponse', function (event, errorMessage) {
                            AnalyticsService.sendError(errorMessage);
                        });

                        $scope.$on('trackButtonClick', function (event, buttonName) {
                            AnalyticsService.sendButtonClick(buttonName);
                        });
                    });
                });
            }
        };
    });

})(angular.module('refresh.analytics', ['refresh.card', 'refresh.analytics.container']));
