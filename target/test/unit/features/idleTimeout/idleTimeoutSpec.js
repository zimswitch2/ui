'use strict';

describe('idleTimeout', function () {
    var $rootScope, idle, authenticationService;
    beforeEach(function () {
        idle = jasmine.createSpyObj('$idle', ['watch', 'unwatch']);
        authenticationService = jasmine.createSpyObj('AuthenticationService', ['renewSession', 'logout']);
        angular.module('app', []).config(function ($provide) {
            $provide.constant('$idle', idle);
            $provide.value('AuthenticationService', authenticationService);
        });

        module('app', 'refresh.idleTimeout');

        inject(function (_$rootScope_) {
            $rootScope = _$rootScope_;
        });
    });

    describe('event handlers', function () {
        it('should set the beenIdle flag to true when user is idle', function () {
            $rootScope.beenIdle = undefined;
            $rootScope.$broadcast('$idleStart');
            expect($rootScope.beenIdle).toEqual(true);
        });

        it('should unset the beenIdle flag when user becomes active again', function () {
            $rootScope.beenIdle = true;
            $rootScope.$broadcast('$idleEnd');
            expect($rootScope.beenIdle).toEqual(false);
        });

        it('should set the countdown after the idle period has elapsed', function () {
            $rootScope.idleCountdown = undefined;
            $rootScope.$broadcast('$idleStart');
            expect($rootScope.idleCountdown).toBeUndefined();

            $rootScope.$broadcast('$idleWarn', 3);
            expect($rootScope.idleCountdown).toEqual(3);
        });

        it("should only start monitoring user activity after login", function () {
            $rootScope.$broadcast('loggedIn');
            expect(idle.watch).toHaveBeenCalled();
        });

        it("should stop monitoring user activity after logout", function () {
            $rootScope.$broadcast('loggedOut');
            expect(idle.unwatch).toHaveBeenCalled();
        });

        it('should refresh the app when idle warning has elapsed', function () {
            $rootScope.$broadcast('$idleTimeout');
            expect(authenticationService.logout).toHaveBeenCalled();
        });

        it('should renew session whenever keepalive timer elapses', function () {
            $rootScope.$broadcast('$keepalive');
            expect(authenticationService.renewSession).toHaveBeenCalled();
        });
    });

    describe('idle modal', function () {
        var output;

        beforeEach(inject(function (_TemplateTest_) {
            _TemplateTest_.allowTemplate('features/idleTimeout/partials/idleTimeout.html');
            output = _TemplateTest_.compileTemplate('<div idle-notification></div>');
        }));

        it('should render modal overlay', function () {
            expect(output.find('.modal-overlay')).not.toBeUndefined();
        });

        it('should replace the element invoking the directive', function () {
            expect(output.find('idle-notification').length).toEqual(0);
        });

        it('should restart the idle watcher when the user chooses to continue banking', function () {
            output.find('.continue').click();
            expect(idle.watch).toHaveBeenCalled();
        });
    });

    describe('idle modal logout', function () {
        var output;

        beforeEach(inject(function (_TemplateTest_) {
            _TemplateTest_.allowTemplate('features/idleTimeout/partials/idleTimeout.html');
            output = _TemplateTest_.compileTemplate('<div idle-notification></div>');
        }));

        describe('and when logout is called', function () {
            it('refreshes the page', function () {
                output.find('.logout').click();
                expect(authenticationService.logout).toHaveBeenCalled();
            });
        });
    });
});
