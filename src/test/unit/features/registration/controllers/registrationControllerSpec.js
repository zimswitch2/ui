var newRegisteredPageFeature = false;
if (feature.newRegisteredPage) {
    newRegisteredPageFeature = true;
}

    describe('Unit Test - Registration', function () {
    'use strict';

    var message = 'Glory to God';

    beforeEach(module('refresh.registration', 'refresh.fixture', 'refresh.security.user', 'refresh.test', 'refresh.dtmanalytics'));

    describe('routes', function () {
        var route;
        beforeEach(inject(function ($route) {
            route = $route;
        }));

        it('should load the correct controller', function () {
            expect(route.routes['/register'].controller).toEqual('RegistrationController');
        });

        it('should load the correct template', function () {
            expect(route.routes['/register'].templateUrl).toEqual('features/registration/partials/register.html');
        });

        it('should indicate that the route can be accessed without authentication', function () {
            expect(route.routes['/register'].unauthenticated).toBeTruthy();
        });
    });

    describe('controller', function () {
        var scope, RegistrationService, singleSignOnFlow, location, mock, applicationParameterService, flow, response, test, digitalId, user,
            controller, flowConstructor;

        function initializeController() {
            controller('RegistrationController', {
                $scope: scope,
                RegistrationService: RegistrationService,
                User: user,
                ApplicationParameters: applicationParameterService
            });
        }

        beforeEach(inject(function ($rootScope, $controller, $location, Flow, ApplicationParameters, Fixture, _mock_, ServiceTest, DigitalId, User,
                                    FlowConstructor, SingleSignOnFlow) {
            this.rootScope = $rootScope;
            scope = $rootScope.$new();

            RegistrationService = jasmine.createSpyObj('RegistrationService', ['createDigitalID']);

            location = $location;
            applicationParameterService = ApplicationParameters;
            user = User;
            digitalId = DigitalId;
            flow = Flow;
            mock = _mock_;
            test = ServiceTest;
            test.spyOnEndpoint('register');
            controller = $controller;

            response = JSON.parse(Fixture.load('base/test/unit/fixtures/registrationResponse.json'));
            digitalId.authenticate(null, null, 'Test User');

            flowConstructor = FlowConstructor;
            singleSignOnFlow = SingleSignOnFlow;
            newRegisteredPageFeature = true;

            initializeController();
        }));

        describe('given lithium register', function () {
            var testFlow;

            function mockSingleSignOnFlow() {
                var createDigitalIdSpy = spyOn(singleSignOnFlow, 'createDigitalId');
                testFlow = flowConstructor({name: 'testFlow'});
                testFlow.addPromiseResolutionScenarios(['failure', 'success']);
                createDigitalIdSpy.and.callFake(function () {
                    return testFlow;
                });
            }

            beforeEach(function () {
                mockSingleSignOnFlow();
                location.$$search = {'test': 'parameter'};
                scope.createDigitalId();
            });

            it('should clear the search parameters', function () {
                expect(location.$$search).toEqual({});
            });

            it('should call flow.next when creating a digital id', function () {
                testFlow.resolve('success', {
                    message: message,
                    code: '0000'
                });
                var flowNextSpy = spyOn(flow, 'next');
                scope.createDigitalId();
                scope.$digest();

                expect(flowNextSpy).toHaveBeenCalled();
            });

            it('should indicates that the customer is registering', inject(function (ApplicationParameters) {
                testFlow.resolve('success', {
                    message: message,
                    code: '0000'
                });
                scope.createDigitalId();
                scope.$digest();

                expect(ApplicationParameters.getVariable('isRegistering')).toBeTruthy();

            }));

            describe('when creating a digital id fails', function () {
                it('should set $scope.isSuccessful to false', function () {
                    newRegisteredPageFeature = false;
                    initializeController();
                    scope.createDigitalId();
                    testFlow.resolve('failure', {
                        message: message,
                        code: 9999,
                        type: 'ERROR'
                    });
                    scope.$digest();
                    expect(scope.isSuccessful).toEqual(false);
                });

                it('should set the error message to ' + message, function () {
                    testFlow.resolve('failure', {
                        message: message,
                        code: 9999,
                        type: 'ERROR'
                    });

                    scope.createDigitalId();
                    scope.$digest();

                    expect(scope.errorMessage).toEqual(message);
                });

                it('should call flow.previous also', function () {
                    var flowNextSpy = spyOn(flow, 'next');
                    var flowPreviousSpy = spyOn(flow, 'previous');
                    testFlow.resolve('failure', {
                        message: message,
                        code: 9999,
                        type: 'ERROR'
                    });

                    scope.createDigitalId();
                    scope.$digest();

                    expect(flowNextSpy).toHaveBeenCalled();
                    expect(flowPreviousSpy).toHaveBeenCalled();
                });
            });

        });

        describe('when cancel is called', function () {
            it('it should call Flow.cancel()', function () {
                var flowCancelSpy = spyOn(flow, 'cancel');
                scope.cancel();
                expect(flowCancelSpy).toHaveBeenCalled();
            });
        });


        it('should default to editing true on load', function () {
            scope.$digest();
            expect(scope.editing).toBeTruthy();
        });

        it('should have the correct flow when registering', function () {
            initializeController();

            expect(flow.steps()).toEqual([
                {name: 'Enter details', current: true, complete: false},
                {name: 'Verify email', current: false, complete: false}
            ]);
            expect(flow.get().headerName).toEqual('Register User');
        });

        it('should have no error message displayed if there is no error from otp verify and the message does not exists', function () {
            scope.$digest();
            expect(scope.errorMessage).toEqual("");
        });

        describe("change the flow accepting  an invite as a new user", function () {
            it("should have a different flow", function () {
                applicationParameterService.pushVariable('acceptInvitationRedirect', '/account-sharing/accept-decline-invitation');
                applicationParameterService.getVariable('acceptInvitationRedirect');
                initializeController();
                scope.$digest();
                expect(flow.steps()).toEqual([{
                    name: 'Enter details',
                    complete: false,
                    current: true
                }, {name: 'Verify email', complete: false, current: false}, {
                    name: 'Accept/decline',
                    complete: false,
                    current: false
                }, {name: 'Enter OTP', complete: false, current: false}]);

            });

            it('should change the headerName when accepting an invitation', function () {
                initializeController();

                applicationParameterService.pushVariable('acceptInvitationRedirect', '/account-sharing/accept-decline-invitation');
                applicationParameterService.getVariable('acceptInvitationRedirect');
                scope.$digest();

                expect(scope.showHeader()).toBeTruthy();

            });

            it('should not change the headerName when in the normal registration flow', function () {
                initializeController();

                applicationParameterService.getVariable(' ');
                scope.$digest();

                expect(scope.showHeader()).toBeUndefined();

            });
        });

    });
});