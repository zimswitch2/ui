describe('Spinner', function () {
    'use strict';

    var scope, httpEvent, rootScope, timeout, applicationParameterService, Spinner;

    beforeEach(module('refresh.spinner'));

    beforeEach(inject(function (_Spinner_) {
        Spinner = _Spinner_;
    }));

    describe('Spinner', function () {
        it('should assume global spinner is used by default', function () {
            expect(Spinner.spinnerStyle()).toEqual('global');
        });

        it('should return spinner style used for current request', function () {
            Spinner.spinnerStyle('etc etc');
            expect(Spinner.spinnerStyle()).toEqual('etc etc');
        });
    });

    describe('spinnerController', function () {
        beforeEach(inject(function ($rootScope, $controller, ApplicationParameters, $timeout) {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            applicationParameterService = ApplicationParameters;
            applicationParameterService.pushVariable('pendingRequests', 0);
            $controller('spinnerController', {$scope: scope});
            httpEvent = jasmine.createSpyObj('$rootScope', ['$on']);
            timeout = $timeout;
        }));

        it('should be hidden by default', function () {
            expect(scope.spinnerActive).toBeFalsy();
            expect(scope.spinnerClass).toEqual('pace pace-inactive');
        });

        it('should update spinner style when any given request starts', function () {
            Spinner.spinnerStyle('bla');
            applicationParameterService.pushVariable('pendingRequests', 1);
            rootScope.$broadcast('httpRequestStarted');
            expect(scope.spinnerStyle).toEqual('bla');
        });

        it('should be shown when spinner request is pending', function () {
            applicationParameterService.pushVariable('pendingRequests', 1);
            rootScope.$broadcast('httpRequestStarted');
            expect(scope.spinnerActive).toBeTruthy();
            expect(scope.spinnerClass).toEqual('pace pace-active');
        });

        it('should be hidden when no pending requests', function () {
            rootScope.$broadcast('httpRequestStarted');
            expect(scope.spinnerActive).toBeFalsy();
            expect(scope.spinnerClass).toEqual('pace pace-inactive');
        });

        it('should be hidden when request pending finishes', function () {
            applicationParameterService.pushVariable('pendingRequests', 1);
            rootScope.$broadcast('httpRequestStarted');

            applicationParameterService.pushVariable('pendingRequests', 0);
            rootScope.$broadcast('httpRequestStopped');
            expect(scope.spinnerActive).toBeFalsy();
            expect(scope.spinnerClass).toEqual('pace pace-inactive');
        });

        it('should not hide the spinner when there are non-zero pending requests', function () {
            applicationParameterService.pushVariable('canDelay', true);
            applicationParameterService.pushVariable('pendingRequests', 1);
            rootScope.$broadcast('httpRequestStarted');
            applicationParameterService.pushVariable('pendingRequests', 0);
            rootScope.$broadcast('httpRequestStopped');

            applicationParameterService.pushVariable('pendingRequests', 1);
            rootScope.$broadcast('httpRequestStarted');
            timeout.flush();
            expect(scope.spinnerActive).toBeTruthy();
            expect(scope.spinnerClass).toEqual('pace pace-active');
        });

        it('should not clear existing spinner when a spinnerless call is made', function () {
            Spinner.spinnerStyle('inline');
            applicationParameterService.pushVariable('pendingRequests', 1);
            rootScope.$broadcast('httpRequestStarted');
            expect(scope.spinnerActive).toBeTruthy();
            expect(scope.spinnerClass).toEqual('pace pace-active');

            Spinner.spinnerStyle('none');
            applicationParameterService.pushVariable('pendingRequests', 2);
            rootScope.$broadcast('httpRequestStarted');
            expect(scope.spinnerActive).toBeTruthy();
            expect(scope.spinnerClass).toEqual('pace pace-active');
        });

        it('should not display spinner if the only call in progress is spinnerless', function () {
            Spinner.spinnerStyle('none');
            applicationParameterService.pushVariable('pendingRequests', 1);
            rootScope.$broadcast('httpRequestStarted');
            expect(scope.spinnerActive).toBeFalsy();
            expect(scope.spinnerClass).toEqual('pace pace-inactive');
        });

        it('should be shown when request pending does not finish', function () {
            applicationParameterService.pushVariable('pendingRequests', 1);
            rootScope.$broadcast('httpRequestStarted');
            rootScope.$broadcast('httpRequestStopped');
            expect(scope.spinnerActive).toBeTruthy();
            expect(scope.spinnerClass).toEqual('pace pace-active');
        });

        it('should delay the spinner deactivation when processing the login request', function () {
            applicationParameterService.pushVariable('canDelay', true);
            applicationParameterService.pushVariable('pendingRequests', 0);
            rootScope.$broadcast('httpRequestStopped');
            timeout.flush();
            expect(scope.spinnerActive).toBeFalsy();
            expect(scope.spinnerClass).toEqual('pace pace-inactive');
        });

        it('should block out page and stop any spinners when an connectivityUnavailable event is broadcast', function () {
            rootScope.$broadcast('connectivityUnavailable');

            expect(scope.blockOutPage).toBeTruthy();
            expect(scope.spinnerActive).toBeFalsy();
            expect(scope.spinnerClass).toEqual('pace pace-inactive');
        });
    });
});
