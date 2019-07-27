describe('Unit Test - Password Reset Details Controller', function () {
    'use strict';

    var route, scope, controller, viewModel, location, path, authenticationService, flow, mock, applicationParameters;

    beforeEach(module('refresh.passwordReset.detailsController'));

    describe('Routes - for reset-password/details', function () {
        beforeEach(inject(function ($route) {
            route = $route;
        }));

        it('should associate url with template', function () {
            expect(route.routes['/reset-password/details'].templateUrl).toMatch('features/security/partials/passwordResetDetails.html');
            expect(route.routes['/reset-password/details'].controller).toMatch('PasswordResetDetailsController');
        });

        it('should indicate that the route can be accessed without authentication', inject(function ($route) {
            expect($route.routes['/reset-password/details'].unauthenticated).toBeTruthy();
        }));
    });

    describe('controller - PasswordResetDetailsController', function () {

        function initController(){
            controller('PasswordResetDetailsController', {
                $scope: scope,
                ViewModel: viewModel,
                $location: location,
                AuthenticationService: authenticationService,
                Flow: flow,
                ApplicationParameters: applicationParameters
            });
            scope.$digest();
        }

        beforeEach(inject(function ($rootScope, $controller, _mock_) {
            scope = $rootScope.$new();
            controller = $controller;
            viewModel = jasmine.createSpyObj('ViewModel', ['current']);
            authenticationService = jasmine.createSpyObj('AuthenticationService', ['passwordReset']);
            location = jasmine.createSpyObj('$location', ['path']);
            path = jasmine.createSpyObj('path', ['replace']);
            location.path.and.returnValue(path);
            flow = jasmine.createSpyObj('Flow', ['next', 'previous', 'modify', 'current']);
            mock = _mock_;
            applicationParameters = jasmine.createSpyObj('ApplicationParameters', ['pushVariable']);
        }));

        describe('on init controller', function () {
            var securityChallenge = {
                securityChallenge: {
                    digitalId: 'refresh@sb.co.za',
                    hasLinkedCard: true
                }
            };

            describe('when ViewModel is defined', function () {
                beforeEach(function () {
                    viewModel.current.and.returnValue(securityChallenge);
                    initController();
                });

                it('should get securityChallenge Object from ViewModel', function () {
                    expect(viewModel.current).toHaveBeenCalled();
                    expect(scope.securityChallenge).toEqual(securityChallenge.securityChallenge);
                });
            });

            describe('when ViewModel is undefined', function () {
                beforeEach(function () {
                    viewModel.current.and.returnValue({});
                    initController();
                });

                it('should get securityChallenge Object from ViewModel', function () {
                    expect(viewModel.current).toHaveBeenCalled();
                    expect(scope.securityChallenge).toEqual({});
                });

                it('should call location', function () {
                    expect(location.path).toHaveBeenCalledWith('/login');
                    expect(path.replace).toHaveBeenCalled();
                });
            });

            describe('flow', function () {
                it('should modify when there is a card', function () {
                    viewModel.current.and.returnValue({securityChallenge: {hasLinkedCard: true}});
                    flow.current.and.returnValue(['Verify email', 'Enter details', 'Verify'], 'Reset Password');
                    initController();
                    expect(flow.modify).toHaveBeenCalledWith('Verify', 'OTP');
                });
                it('should modify when there is no card', function () {
                    viewModel.current.and.returnValue({securityChallenge: {hasLinkedCard: false}});
                    flow.current.and.returnValue(['Verify email', 'Enter details', 'Verify'], 'Reset Password');
                    initController();
                    expect(flow.modify).toHaveBeenCalledWith('Verify', 'Verification code');
                });
            });
        });

        describe('on cancel', function () {
            it('should call location', function () {
                viewModel.current.and.returnValue({});
                initController();
                scope.cancel();
                expect(location.path).toHaveBeenCalled();
                expect(path.replace).toHaveBeenCalled();
            });
        });

        describe('on next', function () {
            var securityChallenge = {
                securityChallenge: {
                    digitalId: 'refresh@sb.co.za',
                    password: 'Pro12345',
                    cardNumber: '12345',
                    atmPin: '1234'
                }
            };

            describe('on authenticationService success', function () {
                beforeEach(function () {
                    viewModel.current.and.returnValue({});
                    authenticationService.passwordReset.and.returnValue(mock.resolve({}));
                    initController();
                    scope.securityChallenge = {
                        digitalId: 'refresh@sb.co.za',
                        password: 'Pro12345',
                        cardNumber: '12345',
                        atmPin: '1234'
                    };
                    scope.next();
                });
                it('should call reset password service', function () {
                    scope.$digest();
                    expect(authenticationService.passwordReset).toHaveBeenCalledWith(securityChallenge);
                    expect(flow.next).toHaveBeenCalled();
                    expect(location.path).toHaveBeenCalledWith('/login');
                    expect(path.replace).toHaveBeenCalled();
                    expect(applicationParameters.pushVariable).toHaveBeenCalledWith('passwordHasBeenReset', true);
                });
            });

            describe('on authenticationService rejection', function () {
                beforeEach(function () {
                    viewModel.current.and.returnValue(securityChallenge);
                    authenticationService.passwordReset.and.returnValue(mock.reject('Opps William broke the code!!!!'));
                    initController();
                    scope.securityChallenge = {
                        digitalId: 'refresh@sb.co.za',
                        password: 'Pro12345',
                        cardNumber: '12345',
                        atmPin: '1234'
                    };
                    scope.next();
                });

                it('should call reset password service', function () {
                    scope.$digest();
                    expect(authenticationService.passwordReset).toHaveBeenCalledWith(securityChallenge);
                    expect(flow.next).toHaveBeenCalled();
                    expect(location.path).not.toHaveBeenCalledWith('/login');
                    expect(path.replace).not.toHaveBeenCalled();
                    expect(applicationParameters.pushVariable).not.toHaveBeenCalledWith('passwordHasBeenReset', true);
                    expect(scope.errorMessage).toEqual('Opps William broke the code!!!!');
                    expect(flow.previous).toHaveBeenCalled();
                });
            });

        });

    });
});