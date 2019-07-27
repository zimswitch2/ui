describe('ActivateOtpController', function () {
    'use strict';

    beforeEach(module('refresh.otp.activate.details', 'refresh.test', 'refresh.mcaHttp'));

    beforeEach(inject(function ($rootScope, $controller, $location, $route, ViewModel, Flow, AuthenticationService) {
        this.scope = $rootScope.$new();
        this.location = $location;
        this.route = $route;
        this.ViewModel = ViewModel;
        this.Flow = Flow;
        this.AuthenticationService = AuthenticationService;
        var routeParams = {profileId: '59758'};

        spyOn(this.Flow, 'next');
        spyOn(this.AuthenticationService, 'logout');

        $controller('ActivateOtpController', {
            $scope: this.scope,
            $routeParams: routeParams
        });
    }));

    describe('when otp needs to be activated', function () {
        it('should use the correct controller ', function () {
            expect(this.route.routes['/otp/activate/:profileId'].controller).toEqual('ActivateOtpController');
        });

        it('should use the correct template ', function () {
            expect(this.route.routes['/otp/activate/:profileId'].templateUrl).toEqual('features/otp/partials/activate.html');
        });
    });

    describe('when default', function () {
        it('should set the initial view model', function () {
            expect(this.scope.otpPreferences).toEqual({preferredMethod: 'SMS'});
        });
    });

    describe('when next', function () {
        var contactDetails = {
            cellPhoneNumber: '0811231234',
            internationalDialingCode: '27',
            countryCode: 'ZAF'
        };
        beforeEach(function () {
            this.otpPreferences = {
                contactDetails: contactDetails,
                emailAddress: "",
                preferredMethod: "SMS"
            };
            this.scope.otpPreferences = this.otpPreferences;
            this.scope.next();
        });

        it('should redirect to confirm step', function () {
            expect(this.location.path()).toEqual('/otp/activate/confirm/59758');
        });

        it('should update the current ViewModel', function () {
            expect(this.ViewModel.current()).toEqual(this.otpPreferences);
        });

        it('should advance the Flow', function () {
            expect(this.Flow.next).toHaveBeenCalled();
        });
    });

    describe('when modify', function () {
        it('should keep the ViewModel state', inject(function ($rootScope, $controller, ViewModel) {
            var scope = $rootScope.$new();

            ViewModel.current({preferredMethod: 'Email'});
            ViewModel.modifying();

            $controller('ActivateOtpController', {
                $scope: scope
            });

            expect(scope.otpPreferences.preferredMethod).toEqual('Email');
        }));

        it('should display an existing error', inject(function ($rootScope, $controller, ViewModel) {
            var scope = $rootScope.$new();

            ViewModel.current({preferredMethod: 'Email'});
            ViewModel.error({message: 'error'});
            ViewModel.modifying();

            $controller('ActivateOtpController', {
                $scope: scope
            });

            expect(scope.errorMessage).toBeTruthy();
        }));
    });

    describe('cancel method', function () {
        it('should sign out', function () {
            this.scope.signOut();
            expect(this.AuthenticationService.logout).toHaveBeenCalled();
        });
    });

});
