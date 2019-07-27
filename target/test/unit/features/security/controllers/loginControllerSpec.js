var personalFinanceManagementFeature = false;


describe('LoginController', function () {

    'use strict';

    var scope, location, authenticationResponse, authenticationResponseWithOneHotCard, cardResponse, test,
        applicationParameters, authenticationService, $controller, digitalId, $document,
        card, user, mock, cardSpy, $rootScope, ipCookie, dtmAnalyticsService;

    beforeEach(module('refresh.login', 'refresh.test', 'flow.flowConstructor', 'refresh.dtmanalytics'));

    function initializeController() {
        scope = $rootScope.$new();
        $controller('LoginController', {
            $scope: scope,
            ApplicationParameters: applicationParameters,
            $document: $document,
            ipCookie: ipCookie,
            DtmAnalyticsService: dtmAnalyticsService
        });
        scope.$digest();
    }

    describe('Single card tests', function () {
        beforeEach(inject(function (_$rootScope_, _$controller_, $location, Fixture, _ApplicationParameters_, ServiceTest, DigitalId, Card, User, _mock_) {
            test = ServiceTest;
            test.spyOnEndpoint('authenticate');
            test.spyOnEndpoint('cards');

            $rootScope = _$rootScope_;
            applicationParameters = _ApplicationParameters_;
            authenticationResponse = JSON.parse(Fixture.load('base/test/unit/fixtures/authenticateResponse.json'));
            authenticationResponseWithOneHotCard = JSON.parse(Fixture.load('base/test/unit/fixtures/authenticateResponseWithOneHotCard.json'));
            cardResponse = JSON.parse(Fixture.load('base/test/unit/fixtures/cardNumberResponse.json'));

            digitalId = DigitalId;
            location = $location;
            card = Card;
            $controller = _$controller_;
            user = User;
            mock = _mock_;
            $document = [{referrer: ''}];

            dtmAnalyticsService = jasmine.createSpyObj('DtmAnalyticsService', ['recordLogin']);

            initializeController();
        }));

        describe('with lithiumSso login', function () {
            var testFlow, SingleSignOnFlow;

            beforeEach(inject(function (_SingleSignOnFlow_, FlowConstructor) {
                SingleSignOnFlow = _SingleSignOnFlow_;
                var loginSpy = spyOn(SingleSignOnFlow, 'login');

                testFlow = FlowConstructor({name: 'testFlow'});
                testFlow.addPromiseResolutionScenarios(['failure', 'success']);
                loginSpy.and.callFake(function () {
                    return testFlow;
                });

                scope.isSuccessful = true;
            }));

            it('should clear the search parameters', function () {
                location.$$search = {'test': 'parameter'};
                scope.login("ibrefresh@standardbank.co.za", "passworD45");
                expect(location.$$search).toEqual({});
            });

            describe('when login succeeds', function () {
                beforeEach(function () {
                    scope.login("ibrefresh@standardbank.co.za", "passworD45");
                    testFlow.resolve('success');
                });

                it('should record the login for analytics', function () {
                    expect(dtmAnalyticsService.recordLogin).toHaveBeenCalled();
                });
            });

            describe('when login fails', function () {
                beforeEach(function () {
                    scope.login("ibrefresh@standardbank.co.za", "passworD45");
                    testFlow.resolve('failure', {message: 'Please check the sign-in details entered and try again'});
                });

                it('should set isSuccessful to false', function () {
                    expect(scope.isSuccessful).toBeFalsy();
                });

                it('should remove previously typed password', function () {
                    expect(scope.password).toEqual('');
                });

                it('should display the error message that was gotten back from the service', function () {
                    expect(scope.errorMessage).toEqual("Please check the sign-in details entered and try again");
                });

                it('should know that a user is not authenticated', function () {
                    expect(digitalId.isAuthenticated()).toBeFalsy();
                });
            });

            describe('when username or password are not specified', function () {
                it('not call login if username and password are not specified', function () {
                    scope.login();
                    expect(SingleSignOnFlow.login).not.toHaveBeenCalled();
                });

                it('not call login if username is not specified', function () {
                    scope.login(null, "Test12345");
                    expect(SingleSignOnFlow.login).not.toHaveBeenCalled();
                });

                it('not call login if password is not specified', function () {
                    scope.login("username@email.com");
                    expect(SingleSignOnFlow.login).not.toHaveBeenCalled();
                });
            });

            describe('on validate email', function () {
                it('should add the digital to application parameters', function () {
                    scope.validateEmail('email@user.com');
                    expect(applicationParameters.getVariable('digitalId')).toEqual('email@user.com');
                });
            });

            describe('when show terms and conditions', function () {
                it('should toggle the show terms and condition modal', function () {

                    scope.toggleModal();
                    expect(scope.showModal).toEqual(true);
                    scope.toggleModal();
                    expect(scope.showModal).toEqual(false);
                });

                it('should show terms and conditions', function () {
                    scope.showFullTerms();
                    expect(scope.showTerms).toEqual(true);
                    scope.hideFullTerms();
                    expect(scope.showTerms).toEqual(false);
                });
            });

            describe('login error message', function () {
                it('should set the error message from the application parameters', function () {
                    applicationParameters.pushVariable('loginError', 'error');
                    initializeController();

                    expect(scope.errorMessage).toEqual('error');
                    expect(applicationParameters.getVariable('loginError')).toBeUndefined();
                });

                it('should remove loginError on location change', function () {
                    applicationParameters.pushVariable('loginError', 'error');
                    initializeController();

                    scope.$broadcast('$locationChangeSuccess');
                    scope.$digest();
                    expect(applicationParameters.getVariable('loginError')).toBeUndefined();
                });

            });
        });

    });


    describe('Multiple cards', function () {

        beforeEach(inject(function ($rootScope, _$controller_, $location, Fixture, _ApplicationParameters_, ServiceTest, DigitalId, Card, User, _mock_) {
            test = ServiceTest;
            test.spyOnEndpoint('authenticate');
            cardSpy = test.spyOnEndpoint('cards');

            scope = $rootScope.$new();
            applicationParameters = _ApplicationParameters_;
            authenticationResponse = JSON.parse(Fixture.load('base/test/unit/fixtures/authenticateResponse.json'));
            cardResponse = JSON.parse(Fixture.load('base/test/unit/fixtures/cardNumberResponse.json'));

            digitalId = DigitalId;
            location = $location;
            card = Card;
            $controller = _$controller_;
            user = User;
            mock = _mock_;
        }));

        function setup(errorCode, errorOn) {
            test.stubResponse('authenticate', 200, authenticationResponse, {
                'x-sbg-response-type': 'SUCCESS',
                'x-sbg-response-code': '0000'
            });
            errorOn = errorOn || 3;

            cardSpy.and.callFake(function () {
                if (cardSpy.calls.count() === errorOn) {
                    return mock.response({}, 204, {'x-sbg-response-type': 'ERROR', 'x-sbg-response-code': errorCode});
                } else {
                    return mock.response(cardResponse, 200, {
                        'x-sbg-response-type': 'SUCCESS',
                        'x-sbg-response-code': '0000'
                    });
                }
            });

            $controller('LoginController', {
                $scope: scope,
                ApplicationParameters: applicationParameters
            });
            scope.login("ibrefresh@standardbank.co.za", "passworD45");
            scope.$digest();
        }

        describe('for all failures', function () {
            beforeEach(function () {
                setup('9999');
            });

            it('should change the location to switch dashboard', function () {
                expect(location.path()).toEqual('/switchDashboard');
            });
        });

        describe('for hotcarded account', function () {
            beforeEach(function () {
                setup('2004');
            });

            it('should change the location to switch dashboard', function () {
                expect(location.path()).toEqual('/switchDashboard');
            });

            it('should set isSuccessful to false', function () {
                scope.isSuccessful = true;
                scope.login("ibrefresh@standardbank.co.za", "passworD45");
                scope.$digest();
                expect(scope.isSuccessful).toBeTruthy();
            });
        });

        describe('When default dashboard is active and otp errors exist', function () {
            it('should redirect to /switchDashboard first step on 7501 error', function () {
                setup('7501');

                expect(location.path()).toEqual('/switchDashboard');
            });

            it('should redirect to /switchDashboard step on 7506 error', function () {
                setup('7506');

                expect(location.path()).toEqual('/switchDashboard');
            });

            it('should redirect to /switchDashboard first step on 7516 error', function () {
                setup('7516');

                expect(location.path()).toEqual('/switchDashboard');
            });
        });

        describe('when default dashboard has activate OTP status', function () {
            it('should redirect to /switchDashboard first step on 7501 error', function () {
                setup('7501', 1);

                expect(location.path()).toEqual('/switchDashboard');
            });

            it('should redirect to /switchDashboard first step on 7506 error', function () {
                setup('7506', 1);

                expect(location.path()).toEqual('/switchDashboard');
            });

            it('should redirect to /switchDashboard first step on 7516 error', function () {
                setup('7516', 1);

                expect(location.path()).toEqual('/switchDashboard');
            });
        });

    });

    describe('Small Enterprises', function () {

        describe('When invite customer', function () {


            describe("toggling widgets", function () {
                beforeEach(function () {

                });

                it("should hide the widget  and remove the application parameter from the scope", function () {
                    var getVariable = spyOn(applicationParameters, 'getVariable');

                    getVariable.and.returnValue('true');
                    scope.$digest();

                    expect(scope.showWidgets()).toBeFalsy();
                });
                it("should show the widgets by default", function () {
                    var getVariable = spyOn(applicationParameters, 'getVariable');
                    scope.$digest();

                    expect(scope.showWidgets()).toBeTruthy();
                });
                it("should  redirect to login page", function () {
                    var popVariable = spyOn(applicationParameters, 'popVariable');
                    popVariable.and.returnValue(' ');
                    scope.redirectToSignIn();
                    scope.$digest();

                    expect(location.path()).toBe('/login');

                });

            });

        });

    });
});




