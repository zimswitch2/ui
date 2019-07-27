describe('Unit Test - Password Reset', function () {
    'use strict';

    var scope, controller, flow, location, authenticationService, mock, viewModel, path, applicationParameters;

    beforeEach(module('refresh.passwordReset.controller'));

    describe('Route - reset-password', function () {
        it('should set up the correct route and template url', inject(function ($route) {
            expect($route.routes['/reset-password']).not.toBeUndefined();
            expect($route.routes['/reset-password'].templateUrl).toBe('features/security/partials/passwordReset.html');
            expect($route.routes['/reset-password'].controller).toBe('PasswordResetController');
        }));

        it('should indicate that the route can be accessed without authentication', inject(function ($route) {
            expect($route.routes['/reset-password'].unauthenticated).toBeTruthy();
        }));
    });

    function initController() {
        controller('PasswordResetController', {
            $scope: scope,
            Flow: flow,
            $location: location,
            AuthenticationService: authenticationService,
            ViewModel: viewModel,
            ApplicationParameters: applicationParameters
        });
        scope.$digest();
    }

    describe('controller', function () {

        beforeEach(inject(function ($rootScope, $controller, _mock_) {
            mock = _mock_;
            scope = $rootScope.$new();
            scope.securityChallenge = {
                digitailId: ' '
            };
            controller = $controller;
            flow = jasmine.createSpyObj('Flow', ['create', 'next', 'previous']);
            location = jasmine.createSpyObj('$location', ['path']);
            path = jasmine.createSpyObj('path', ['replace']);
            location.path.and.returnValue(path);
            authenticationService = jasmine.createSpyObj('AuthenticationService', ['passwordReset', 'linkCardStatus']);
            viewModel = jasmine.createSpyObj('ViewModel', ['current', 'initial']);
            applicationParameters = jasmine.createSpyObj('ApplicationParameters', ['pushVariable', 'getVariable']);
        }));

        describe('on init controller', function () {

            beforeEach(function () {
                initController();
            });

            it('should create flow', function () {
                expect(flow.create).toHaveBeenCalledWith(['Check email', 'Enter details', 'Verify'], 'Reset Password');
            });

            it('should create securityChallenge Object', function () {
                expect(scope.securityChallenge).toEqual({});
            });

            it('should initial view model', function () {
                expect(viewModel.initial).toHaveBeenCalled();
            });
        });

        describe('on reset with', function () {
            describe('registered email with linked card', function () {
                it('should skip the check email step in reset password flow', function () {
                    var digitalId = 'withcard@test.co.za';
                    authenticationService.linkCardStatus.and.returnValue(mock.resolve({hasLinkedCard: true}));
                    applicationParameters.getVariable.and.returnValue(mock.resolve({digitalId: digitalId}));
                    initController();
                    scope.securityChallenge = {
                        digitalId: digitalId
                    };
                    expect(location.path).toHaveBeenCalledWith('/reset-password/details');
                    expect(flow.next).toHaveBeenCalled();
                });
            });

            describe('registred email with no linked card', function () {
                it('should  start the reset password flow from check email', function () {
                    var digitalId = 'im@gmail.com@sb.co.za';
                    applicationParameters.getVariable.and.returnValue(mock.resolve({digitalId: digitalId}));
                    authenticationService.linkCardStatus.and.returnValue(mock.resolve({hasLinkedCard: false}));
                    initController();
                    scope.securityChallenge = {
                        digitalId: digitalId
                    };
                    expect(location.path).toHaveBeenCalledWith('/reset-password/details');
                    expect(flow.next).toHaveBeenCalled();
                });
            });

            describe('unregistered email', function () {
                it('should start the flow from check email', function () {
                    var digitalId = 'im@gmail.com';
                    applicationParameters.getVariable.and.returnValue(mock.resolve({digitalId: digitalId}));
                    authenticationService.linkCardStatus.and.returnValue(mock.reject());
                    initController();
                    scope.securityChallenge = {
                        digitalId: digitalId
                    };
                    expect(location.path).toHaveBeenCalledWith('/reset-password');
                    expect(flow.previous).toHaveBeenCalled();
                });
            });
        });

        describe('on next', function () {

            describe('link card status service success', function () {
                beforeEach(function () {
                    authenticationService.linkCardStatus.and.returnValue(mock.resolve({hasLinkedCard: true}));
                    initController();
                    scope.securityChallenge = {
                        digitalId: 'refresh@sb.co.za'
                    };
                    scope.next();
                });

                it('should call link card status service', function () {
                    scope.$digest();
                    expect(authenticationService.linkCardStatus).toHaveBeenCalledWith({digitalId: 'refresh@sb.co.za'});
                    expect(viewModel.current).toHaveBeenCalledWith({
                        securityChallenge: {
                            digitalId: 'refresh@sb.co.za',
                            hasLinkedCard: true
                        }
                    });
                    expect(location.path).toHaveBeenCalledWith('/reset-password/details');
                    expect(flow.next).toHaveBeenCalled();
                    expect(applicationParameters.pushVariable).toHaveBeenCalledWith('isReSettingPassword', true);
                });
            });

            describe('link card status service rejection', function () {
                beforeEach(function () {
                    authenticationService.linkCardStatus.and.returnValue(mock.reject('something went wrong'));
                    initController();
                    scope.securityChallenge = {
                        digitalId: 'refresh@sb.co.za'
                    };
                    scope.next();
                });

                it('should call link card status service and reject', function () {
                    scope.$digest();
                    expect(scope.errorMessage).toEqual('something went wrong');
                });

            });
        });

        describe('on cancel', function () {
            it('should call location', function () {
                initController();
                scope.cancel();
                expect(location.path).toHaveBeenCalledWith('/login');
                expect(path.replace).toHaveBeenCalled();
            });
        });
    });
});