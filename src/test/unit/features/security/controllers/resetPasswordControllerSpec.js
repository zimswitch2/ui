describe('Reset password route', function () {
    'use strict';

    beforeEach(module('refresh.resetPasswordCtrl', 'refresh.test', 'refresh.configuration', 'refresh.navigation', 'refresh.fixture'));

    describe('Reset Password Controller', function () {
        var scope, authenticationService, flow, location, mock, $controller, applicationParameters, serviceError;

        function initializeController() {
            $controller('resetPasswordController', {
                AuthenticationService: authenticationService,
                $scope: scope,
                Flow: flow,
                $location: location
            });

            scope.$digest();
        }

        beforeEach(inject(function (_$controller_, $rootScope, _mock_, ApplicationParameters, $location) {
            $controller = _$controller_;
            mock = _mock_;
            scope = $rootScope.$new();
            applicationParameters = ApplicationParameters;
            authenticationService = jasmine.createSpyObj('AuthenticationService', ['resetPassword']);
            flow = jasmine.createSpyObj('Flow', ['create', 'current', 'next', 'previous', 'cancel']);
            location = $location;

            initializeController();
        }));

        it('should create flow', function () {
            expect(flow.create).toHaveBeenCalledWith(['Enter details', 'Verify'], 'Reset your password');
        });

        it('should know the user is resetting password', function () {
            expect(applicationParameters.getVariable('isReSettingPassword')).toBeTruthy();
        });

        it('should call authentication service', function () {
            scope.authenticationDetails = {username: 'tes123@sb.co.za', newPassword: 'passwordJ123'};
            authenticationService.resetPassword.and.returnValue(mock.resolve({}));
            scope.resetPassword();

            expect(authenticationService.resetPassword).toHaveBeenCalledWith(scope.authenticationDetails);
        });

        describe('upon success', function () {
            beforeEach(function () {
                authenticationService.resetPassword.and.returnValue(mock.resolve({}));
                scope.authenticationDetails = {username: 'tes123@sb.co.za', newPassword: 'passwordJ123'};

                scope.resetPassword();
                scope.$digest();
            });

            it('should update the flow upon success', function () {
                expect(flow.next).toHaveBeenCalled();
            });

            it('should know that password has been reset', function () {
                expect(applicationParameters.getVariable('passwordHasBeenReset')).toBeTruthy();
            });

            it('should redirect to login page', function () {
                expect(location.path()).toEqual('/login');
            });
        });

        describe('upon failure', function () {
            beforeEach(function () {
                serviceError = {message: 'OMG'};
                authenticationService.resetPassword.and.returnValue(mock.reject(serviceError));

                scope.resetPassword();
                scope.$digest();
            });

            it('should update the flow upon failure', function () {
                expect(flow.previous).toHaveBeenCalled();
            });

            it('should set errorMessage in the scope', function () {
               expect(scope.errorMessage).toEqual('OMG');
            });

            it('should push error message to the application parameters', function () {
                expect(applicationParameters.getVariable('errorMessage')).toEqual('OMG');
            });
        });

        describe('cancel', function () {
            it('should remove error message from application parameters', function () {
                applicationParameters.pushVariable('errorMessage', 'some error has happened');
                scope.cancel();
                expect(applicationParameters.getVariable('errorMessage')).toBeUndefined();
            });

            it('should call Flow.cancel()' , function () {
                scope.cancel();
                expect(flow.cancel).toHaveBeenCalled();
            });
        });
    });
});

