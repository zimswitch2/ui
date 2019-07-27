describe('ActivateOtpConfirmController', function () {
    'use strict';

    beforeEach(module('refresh.otp.activate.confirm', 'refresh.test'));

    beforeEach(inject(function ($rootScope, $controller, $location, $route, mock, ViewModel, Flow, _ServiceTest_, Fixture, User,
                                AuthenticationService) {
        this.scope = $rootScope.$new();
        this.location = $location;
        this.route = $route;
        var test = _ServiceTest_;

        test.spyOnEndpoint('authenticate');
        var authenticationResponse = JSON.parse(Fixture.load('base/test/unit/fixtures/authenticateResponse.json'));
        test.stubResponse('authenticate', 200, authenticationResponse, {'x-sbg-response-type': 'SUCCESS', 'x-sbg-response-code': '0000'});

        test.spyOnEndpoint('cards');
        var cardResponse = JSON.parse(Fixture.load('base/test/unit/fixtures/cardNumberResponse.json'));
        test.stubResponse('cards', 200, cardResponse, {'x-sbg-response-type': 'SUCCESS', 'x-sbg-response-code': '0000'});

        this.mockActivateOtpService = jasmine.createSpyObj('mockActivateOtpService', ['activate']);
        this.mockActivateOtpService.activate.and.returnValue(mock.resolve());

        this.FlowNextSpy = spyOn(Flow, 'next');
        this.FlowPreviousSpy = spyOn(Flow, 'previous');

        this.otpPreferences = {
            cellPhoneNumber: '',
            emailAddress: "email@email.com",
            preferredMethod: "Email"
        };

        var routeParams = {profileId: '59758'};

        this.ViewModel = ViewModel;
        ViewModel.current(this.otpPreferences);

        AuthenticationService.login('username', 'password');
        test.resolvePromise();

        $controller('ActivateOtpConfirmController', {
            $scope: this.scope,
            ActivateOtpService: this.mockActivateOtpService,
            $routeParams: routeParams
        });
    }));

    describe('when otp has to be confirmed', function () {
        it('should use the correct controller ', function () {
            expect(this.route.routes['/otp/activate/confirm/:profileId'].controller).toEqual('ActivateOtpConfirmController');
        });

        it('should use the correct template ', function () {
            expect(this.route.routes['/otp/activate/confirm/:profileId'].templateUrl).toEqual('features/otp/partials/activateConfirm.html');
        });
    });

    it('should set the otp preferences in the scope', function () {
        expect(this.scope.otpPreferences).toEqual(this.otpPreferences);
    });

    describe('when activate', function () {
        it('should redirect to otp activate page on success', function () {
            this.scope.activate();
            this.scope.$digest();

            expect(this.location.path()).toEqual('/otp/activate/success/59758');
        });

        it('should make the service call with the correct object', function () {
            this.scope.activate();

            expect(this.mockActivateOtpService.activate).toHaveBeenCalledWith(this.otpPreferences, '59758');
        });

        it('should advance the Flow', function () {
            this.scope.activate();
            this.scope.$digest();

            expect(this.FlowNextSpy).toHaveBeenCalled();
        });
    });

    describe('when modify', function () {
        it('should redirect to activate initial step', function () {
            this.scope.modify();

            expect(this.location.path()).toEqual('/otp/activate/59758');
        });

        it('should regress the flow', function () {
            this.scope.modify();

            expect(this.FlowPreviousSpy).toHaveBeenCalled();
        });

        it('should set view model to modifying and return the state', function () {
            this.scope.modify();

            expect(this.ViewModel.initial()).toEqual(this.otpPreferences);
        });
    });

    describe('on service error', function () {
        beforeEach(inject(function ($rootScope, $controller, $location, mock, ViewModel) {
            this.scope = $rootScope.$new();
            this.location = $location;

            this.otpPreferences = {
                cellPhoneNumber: '',
                emailAddress: "email@email.com",
                preferredMethod: "Email"
            };

            this.mockActivateOtpService = jasmine.createSpyObj('mockActivateOtpService', ['activate']);
            this.mockActivateOtpService.activate.and.returnValue(mock.reject({
                message: 'error',
                model: _.cloneDeep(this.otpPreferences)
            }));

            this.ViewModel = ViewModel;
            ViewModel.current(this.otpPreferences);

            var routeParams = {profileId: '59758'};

            $controller('ActivateOtpConfirmController', {
                $scope: this.scope,
                ActivateOtpService: this.mockActivateOtpService,
                $routeParams: routeParams
            });

            caterForInternationalOnActivateOtpFeature = true;
        }));

        it('should redirect to otp activate first step', function () {
            this.scope.activate();
            this.scope.$digest();

            expect(this.location.path()).toEqual('/otp/activate/59758');
        });

        it('should regress the Flow', function () {
            this.scope.activate();
            this.scope.$digest();

            expect(this.FlowPreviousSpy).toHaveBeenCalled();
        });

        it('should set the error on the view model', function () {
            this.scope.activate();
            this.scope.$digest();

            expect(this.ViewModel.initial()).toEqual({
                cellPhoneNumber: '',
                emailAddress: "email@email.com",
                preferredMethod: "Email",
                error: "error"
            });
        });

        it('should reset the view model without setup and keyvaluemetadata', function () {
            this.otpPreferences.stepUp = {};
            this.otpPreferences.keyValueMetadata = {};

            this.scope.activate();
            this.scope.$digest();

            expect(this.ViewModel.initial()).toEqual({
                cellPhoneNumber: '',
                emailAddress: "email@email.com",
                preferredMethod: "Email",
                error: "error"
            });
        });
    });

    describe('when caterForInternationalOnActivateOtp is toggled on', function () {
        var controller, scope, routeParams, activateOtpService, viewModel, mock;
        var init = function () {
            controller('ActivateOtpConfirmController', {
                $scope: scope,
                ActivateOtpService: activateOtpService,
                $routeParams: routeParams,
                ViewModel: viewModel
            });
        };

        beforeEach(inject(function ($rootScope, $controller, _mock_) {
            scope = $rootScope.$new();
            controller = $controller;
            mock = _mock_;
            routeParams = {profileId: '59758'};

            viewModel = jasmine.createSpyObj('ViewModel', ['current', 'error']);
            activateOtpService = jasmine.createSpyObj('ActivateOtpService', ['activate']);

            activateOtpService.activate.and.returnValue(mock.reject({
                model: {
                    internationalDialingCode: '27',
                    preferredMethod: 'SMS',
                    cellPhoneNumber: '01111',
                    countryCode: 'SA'
                },
                error: 'error'
            }));

            caterForInternationalOnActivateOtpFeature = true;
        }));

        it('should populate contact details object for international number', function () {
            init();
            scope.activate();
            scope.$digest();
            expect(viewModel.current).toHaveBeenCalledWith({
                contactDetails: {
                    internationalDialingCode: '27',
                    cellPhoneNumber: '01111',
                    countryCode: 'SA'
                },
                preferredMethod: 'SMS'
            });
        });
    });

    describe('when caterForInternationalOnActivateOtp is toggled off', function () {
        var controller, scope, routeParams, activateOtpService, viewModel, mock;
        var init = function () {
            controller('ActivateOtpConfirmController', {
                $scope: scope,
                ActivateOtpService: activateOtpService,
                $routeParams: routeParams,
                ViewModel: viewModel
            });
        };

        beforeEach(inject(function ($rootScope, $controller, _mock_) {
            scope = $rootScope.$new();
            controller = $controller;
            mock = _mock_;
            routeParams = {profileId: '59758'};

            viewModel = jasmine.createSpyObj('ViewModel', ['current', 'error']);
            activateOtpService = jasmine.createSpyObj('ActivateOtpService', ['activate']);

            activateOtpService.activate.and.returnValue(mock.reject({
                model: {
                    internationalDialingCode: '27',
                    preferredMethod: 'SMS',
                    cellPhoneNumber: '01111',
                    countryCode: 'SA'
                },
                error: 'error'
            }));

            caterForInternationalOnActivateOtpFeature = false;
        }));

        it('should populate contact details object for international number', function () {
            init();
            scope.activate();
            scope.$digest();
            expect(viewModel.current).toHaveBeenCalledWith({
                "internationalDialingCode": "27",
                "preferredMethod": "SMS",
                "cellPhoneNumber": "01111",
                "countryCode": "SA"
            });
        });
    });
});
