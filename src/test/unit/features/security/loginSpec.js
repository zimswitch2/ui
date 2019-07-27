describe('Login', function () {
    'use strict';
    var callLoginConfigBlock, _$routeProvider;

    beforeEach(function () {
        module('ngRoute', 'test.app.config');
        var fakeModule = angular.module('test.app.config', [], function () {
        });
        fakeModule.config(function ($routeProvider) {
            _$routeProvider = $routeProvider;
        });

        callLoginConfigBlock = angular.module('refresh.login')._configBlocks[0][2][0];
        inject();
    });

    describe('routes', function () {
        using([{
            name: 'ideaSpace',
            url: 'http://community.stage.standardbank.co.za/t5/Ideas/idb-p/Stories',
            partialPath: 'common/lithium/partials/ideaSpaceLogin.html'
        }, {
            name: 'ideaSpace',
            url: 'http://community.stage.standardbank.co.za/t5/Ideas/idb-p/Cars',
            partialPath: 'common/lithium/partials/ideaSpaceLogin.html'
        }, {
            name: 'ideaSpace',
            url: 'https://community.standardbank.co.za/t5/Ideas1/',
            partialPath: 'common/lithium/partials/ideaSpaceLogin.html'
        }, {
            name: 'ideaSpace',
            url: 'http://community.standardbank.co.za/t5/Ideas/',
            partialPath: 'common/lithium/partials/ideaSpaceLogin.html'
        }, {
            name: 'community',
            url: 'http://community.standardbank.co.za/t5/Mobile-Apps/ct-p/Mobile',
            partialPath: 'common/lithium/partials/communityLogin.html'
        },
            {
                name: 'community',
                url: 'http://community.stage.standardbank.co.za/t5/Mobile-Apps/ct-p/Mobile',
                partialPath: 'common/lithium/partials/communityLogin.html'
            }, {
                name: 'internetBanking',
                url: '',
                partialPath: 'features/security/partials/login.html'
            }], function (referrer) {
            describe(' and the referrer is from ' + referrer.name + ': ' + referrer.url, function () {
                var route;
                beforeEach(inject(function ($route) {
                    callLoginConfigBlock(_$routeProvider, referrer.url);
                    route = $route;
                }));

                describe('when login is to be viewed', function () {
                    it('should use the correct controller ', function () {
                        expect(route.routes['/login'].controller).toEqual('LoginController');
                    });

                    it('should use the correct template ', function () {
                        expect(route.routes['/login'].templateUrl).toEqual(referrer.partialPath);
                    });
                });
            });
        });

    });
});
