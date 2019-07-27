describe('change password controller', function () {
    'use strict';

    beforeEach(module('refresh.changePasswordController'));

    var scope, authenticationService, mock, location, applicationParameters, timeout, user;

    beforeEach(inject(function ($controller, $rootScope, _mock_, ApplicationParameters, $timeout) {
        authenticationService = jasmine.createSpyObj('authenticationService', ['changePassword', 'logout']);
        scope = $rootScope.$new();
        mock = _mock_;
        location = jasmine.createSpyObj('$location', ['path']);
        applicationParameters = ApplicationParameters;
        timeout = $timeout;
        user = {userProfile: {currentDashboard: "something",'systemPrincipalKey':'SBSA_Banking'}};
        $controller('changePasswordController', {
            AuthenticationService: authenticationService,
            $location: location,
            $scope: scope,
            ApplicationParameters: applicationParameters,
            $timeout: timeout,
            User: user
        });
    }));

    describe('when change password is called', function () {
        it('should go to home page upon success and have selected dashboard', function () {
            authenticationService.changePassword.and.returnValue(mock.resolve({}));

            scope.changePassword();
            scope.$digest();

            expect(authenticationService.changePassword).toHaveBeenCalled();
            expect(applicationParameters.getVariable('passwordHasChanged')).toBeTruthy();
            expect(location.path).toHaveBeenCalledWith('/home');
        });

        it('should go to choose-dashboard page upon success and have no dashboard selected yet', function () {
            authenticationService.changePassword.and.returnValue(mock.resolve({}));
            user.userProfile.currentDashboard = undefined;

            scope.changePassword();
            scope.$digest();

            expect(authenticationService.changePassword).toHaveBeenCalled();
            expect(applicationParameters.getVariable('passwordHasChanged')).toBeTruthy();
            expect(location.path).toHaveBeenCalledWith('/choose-dashboard');
        });

        it('should go back to change password page, clear old password and set error', function () {
            var serviceError = {message: 'OMG'};
            authenticationService.changePassword.and.returnValue(mock.reject(serviceError));

            scope.changePassword();
            scope.$digest();

            expect(scope.changePasswordModel.oldPassword).toEqual('');
            expect(scope.errorMessage).toBe(serviceError.message);
            expect(location.path).not.toHaveBeenCalled();
        });

        it('should redirect to login when account is locked', function () {
            var serviceError = {message: 'OMG', code: 'accountHasBeenLocked'};
            authenticationService.changePassword.and.returnValue(mock.reject(serviceError));

            scope.changePassword();
            scope.$digest();
            timeout.flush();

            expect(authenticationService.logout).toHaveBeenCalled();
        });
    });
});
