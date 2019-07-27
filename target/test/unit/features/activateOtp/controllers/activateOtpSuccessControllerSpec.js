var personalFinanceManagementFeature = false;


var viewOverviewPageFeature;

describe('ActivateOtpSuccessController', function () {
    'use strict';

    beforeEach(module('refresh.otp.activate.success', 'refresh.test'));

    var scope, location, otpPreferences, test, route;
    beforeEach(inject(function ($rootScope, $location, $controller, $route, ViewModel, ServiceTest, Fixture, User) {
        scope = $rootScope.$new();
        location = $location;
        test = ServiceTest;
        route = $route;

        otpPreferences = {
            cellPhoneNumber: '0821231234',
            emailAddress: "",
            preferredMethod: "SMS"
        };
        ViewModel.current(otpPreferences);


        test.spyOnEndpoint('cards');
        var cardResponse = JSON.parse(Fixture.load('base/test/unit/fixtures/cardNumberResponse.json'));
        test.stubResponse('cards', 200, cardResponse, {'x-sbg-response-type': 'SUCCESS', 'x-sbg-response-code': '0000'});

        var authResponse = JSON.parse(Fixture.load('base/test/unit/fixtures/authenticateResponseMultipleCards.json'));
        User.build(authResponse.userProfile, 'token');

        $controller('ActivateOtpSuccessController', {
            $scope: scope,
            $location: location,
            $routeParams: {profileId: '59758'}
        });
    }));

    describe('when otp has been activated', function () {
        it('should use the correct controller ', function () {
            expect(route.routes['/otp/activate/success/:profileId'].controller).toEqual('ActivateOtpSuccessController');
        });

        it('should use the correct template ', function () {
            expect(route.routes['/otp/activate/success/:profileId'].templateUrl).toEqual('features/otp/partials/activateSuccess.html');
        });
    });

    it('should set the otp preferences in the scope', function () {
        expect(scope.otpPreferences).toEqual(otpPreferences);
    });

    describe('start banking', function () {
        viewOverviewPageFeature = false;

        beforeEach(function () {
            scope.startBanking();
            scope.$digest();
        });

        it('should redirect to account summary', function () {
            expect(location.path()).toEqual('/account-summary');
        });

        it('should re-trigger the activate otp flow on card error', function () {
            var cardsResponseWithCardWithError = personalFinanceManagementFeature ? {
                card: null,
                keyValueMetadata: [],
                stepUp: null,
                cards: [
                    {
                        cardNumber: '005222502360335109',
                        personalFinanceManagementId: 9,
                        systemPrincipalId: '956',
                        statusCode: '7506'
                    }
                ]
            } : {
                card: null,
                keyValueMetadata: [],
                stepUp: null,
                cards: [
                    {
                        cardNumber: '005222502360335109',
                        systemPrincipalId: '956',
                        statusCode: '7506'
                    }
                ]
            };
            test.stubResponse('cards', 200, cardsResponseWithCardWithError);
            scope.startBanking();

            scope.$digest();

            expect(location.path()).toEqual('/otp/activate/59758');
        });
    });

    describe('start banking with invalid card', function () {

    });
});
