var migrateWithAtmPinFeature = false;
if (feature.migrateWithAtmPin) {
    migrateWithAtmPinFeature = true;
}
var newRegisteredPageFeature = false;
if (feature.newRegisteredPage) {
    newRegisteredPageFeature = true;
}

describe('MigrationController', function () {
    'use strict';
    beforeEach(module('refresh.migration.controller', 'refresh.dtmanalytics'));

    describe('Routes', function () {
        it('should set up the correct route and template url', inject(function ($route) {
            expect($route.routes['/migrate'].templateUrl).toBe('features/security/partials/migrate.html');
        }));

        it('should use the correct controller ', inject(function ($route) {
            expect($route.routes['/migrate'].controller).toEqual('MigrationController');
        }));
    });

    var scope, location, test, service, digitalId, flow, applicationParameters, cardService, migrationResponse, user, controller,
        window, authenticationService;

    var cardResponse = {
        card: null,
        keyValueMetadata: [],
        stepUp: null,
        cards: [
            {
                cardNumber: '4451221116405778',
                systemPrincipalId: '956',
                statusCode: '0000'
            }
        ]
    };

    function initController() {
        controller('MigrationController', {
            $scope: scope,
            MigrationService: service,
            DigitalId: digitalId,
            Flow: flow,
            ApplicationParameters: applicationParameters,
            CardService: cardService,
            User: user,
            $window: window,
            AuthenticationService: authenticationService
        });
    }

    beforeEach(inject(function ($rootScope, $controller, $location, ServiceTest, MigrationService, DigitalId,
                                Flow, ApplicationParameters, CardService, Fixture, User, $window, AuthenticationService) {
        scope = $rootScope.$new();
        location = $location;


        digitalId = DigitalId;
        flow = Flow;
        spyOn(flow, 'next');
        spyOn(flow, 'create');

        spyOn(flow, 'previous');
        cardService = CardService;
        ServiceTest.spyOnEndpoint('cards');
        ServiceTest.stubResponse('cards', 200, cardResponse,
            {'x-sbg-response-type': 'SUCCESS', 'x-sbg-response-code': '0000'});
        applicationParameters = ApplicationParameters;
        applicationParameters.pushVariable('errorMessage', 'something went wrong');
        test = ServiceTest;
        test.spyOnEndpoint('migrateExistingUser');
        migrationResponse =
            JSON.parse(Fixture.load('base/test/unit/fixtures/migrateExistingUserResponse.json'));
        test.stubResponse('migrateExistingUser', 200, migrationResponse,
            {'x-sbg-token': 'abcde', 'x-sbg-response-code': '0000'});

        service = MigrationService;

        user = User;
        user.build({defaultProfileId: 'anId', digitalId: {username: 'name'}});

        digitalId.authenticate('user@user.user', 'am just cool');

        controller = $controller;

        window = $window;
        authenticationService = AuthenticationService;

        newRegisteredPageFeature = true;
        initController();
    }));

    describe('with link card', function () {
        it('should redirect new customers to link card page', function () {
            user.userProfile.bpIdSystemPrincipalIdentifier = {
                systemPrincipalId: '12345',
                systemPrincipalKey: 'SBSA_SAP'
            };
            initController();
            expect(location.path()).toEqual('/linkcard');
        });

        it('should not redirect any other customer to link card page', function () {
            delete user.userProfile.bpIdSystemPrincipalIdentifier;
            initController();
            expect(location.path()).not.toEqual('/linkcard');
        });
    });

    it('should create flow', function () {
        expect(flow.create).toHaveBeenCalledWith(['Enter details', 'Enter OTP'], 'Copy Your Profile', null, false);
    });

    it('should have error message when an error has occurred', function () {
        expect(scope.errorMessage).toEqual('something went wrong');
    });

    it('should pop error message form application parameters', function () {
        expect(applicationParameters.getVariable('errorMessage')).toBeUndefined();
    });


    it('should sign out', inject(function (AuthenticationService) {
        spyOn(AuthenticationService, 'logout');
        scope.signOut();
        expect(AuthenticationService.logout).toHaveBeenCalled();
    }));

    it('should go back', inject(function ($window) {
        var windowSpy = spyOn($window.history, 'go');
        scope.back();
        expect(windowSpy).toHaveBeenCalledWith(-1);
    }));

    describe('on migration success', function () {
        var cardNumber = '87865123';
        var csp = '12345';
        var password = 'password';
        var atmPin = '67890';

        var expectedOldIbDetails = {cardNumber: cardNumber, password: password, csp: csp};
        if (migrateWithAtmPinFeature) {
            expectedOldIbDetails = {cardNumber: cardNumber, atmPin: atmPin, password: password, csp: csp};
        }
        var expectedProfile = {
            "defaultProfileId": 'anId',
            "digitalId": {
                "username": "user@user.user"
            }
        };

        it('should call the service with the correct arguments', inject(function (mock) {
            test.stubResponse('migrateExistingUser', 200, {},
                {'x-sbg-response-type': 'SUCCESS', 'x-sbg-response-code': '0000'});

            spyOn(service, 'migrateExistingUser');
            service.migrateExistingUser.and.returnValue(mock.resolve({}));

            scope.cardNumber = cardNumber;
            scope.atmPin = atmPin;
            scope.csp = csp;
            scope.password = password;

            scope.migrateExistingUser();

            expect(service.migrateExistingUser).toHaveBeenCalledWith(expectedOldIbDetails, expectedProfile);


        }));

        it('should call the next flow', inject(function () {
            test.stubResponse('migrateExistingUser', 200, migrationResponse,
                {'x-sbg-response-type': 'SUCCESS', 'x-sbg-response-code': '0000'});
            scope.migrateExistingUser();
            scope.$digest();
            expect(flow.next).toHaveBeenCalled();
        }));

        it('should call the service and redirect to switch dashboard', function () {
            test.stubResponse('migrateExistingUser', 200, migrationResponse,
                {'x-sbg-response-type': 'SUCCESS', 'x-sbg-response-code': '0000'});
            scope.migrateExistingUser();
            scope.$digest();
            expect(location.path()).toMatch('/switchDashboard');
        });

    });

    describe('on migration failures', function () {
        beforeEach(inject(function ($controller) {
            test.stubResponse('migrateExistingUser', 204, {},
                {'x-sbg-response-type': 'ERROR', 'x-sbg-response-code': '6001'});
            digitalId.authenticate('token', 'user@user.user', 'am just cool');

            initController();
            scope.migrateExistingUser();
            scope.$digest();
        }));

        it('should call the previous flow', function () {
            expect(flow.previous).toHaveBeenCalled();
        });

        it('should show error message when service fails', inject(function (mock) {
            expect(scope.errorMessage).toEqual('This service is not available at the moment. Please try again in a few minutes');
        }));

        it('should redirect to migrate page', function () {
            expect(location.path()).toMatch('migrate');
        });

        it('should set has error to true', function () {
            expect(scope.errorMessage).toBeTruthy();
        });

        it('should push error message to the application parameters', function () {
            expect(applicationParameters.getVariable('errorMessage')).toEqual('This service is not available at the moment. Please try again in a few minutes');
        });

        it('should show generic OTP locked message', function () {
            test.stubRejection('migrateExistingUser', 200,
                {message: "Your OTP service has been locked. Please call Customer Care on 0860 123 000"},
                {'x-sbg-response-type': 'ERROR', 'x-sbg-response-code': '1020'});
            digitalId.authenticate('token', 'user@user.user', 'am just cool');
            scope.migrateExistingUser();
            scope.$digest();
            expect(scope.errorMessage).toEqual('Your OTP service has been locked. Please call Customer Care on 0860 123 000');
        });
    });

    describe('on migration from register with newRegisteredPage off', function () {
        beforeEach(inject(function ($controller) {
            test.stubResponse('migrateExistingUser', 204, {},
                {'x-sbg-response-type': 'ERROR', 'x-sbg-response-code': '6001'});
            digitalId.authenticate('user@user.user', 'am just cool');

            applicationParameters.pushVariable('isSuccessful', true);
            applicationParameters.pushVariable('hasAdded', true);

            newRegisteredPageFeature = false;
            initController();
            scope.migrateExistingUser();
            scope.$digest();
        }));


        it('should set the success message when coming in from login', function () {
            expect(scope.successMessage).toEqual("Hello am just cool. Your Standard Bank ID has been successfully created. Last step: link your card below ");

        });

        it('should set where it succeeded or not ', function () {
            expect(scope.isSuccessful).toEqual(true);
        });

        it('should create flow with title "Link Card"', function () {
            expect(flow.create).toHaveBeenCalledWith(['Enter details', 'Enter OTP'], 'Link Card', null, false);
        });
    });

    describe('migrate card to profile', function () {
        var cardNumber = cardResponse.cards[0].cardNumber;
        var password = "Pro123";
        var csp = "12345";

        beforeEach(function () {
            scope.cardNumber = cardNumber;
            scope.password = password;
            scope.csp = csp;
        });

        it('should migrate card to profile for newly created digital id', function () {
            scope.migrateExistingUser();
            scope.$digest();

            expect(location.path()).toEqual('/switchDashboard');
            expect(applicationParameters.getVariable('newlyLinkedCardNumber')).toEqual(cardNumber);
            expect(applicationParameters.getVariable('hasInfo')).toBeTruthy();
            expect(applicationParameters.getVariable('errorMessage')).toEqual(undefined);
        });

        it('should migrate card to profile for newly created digital id when newRegisteredPage is off', function () {
            newRegisteredPageFeature = false;
            initController();
            applicationParameters.pushVariable('isSuccessful', true);

            scope.migrateExistingUser();
            scope.$digest();

            expect(location.path()).toEqual('/switchDashboard');
            expect(applicationParameters.getVariable('newlyLinkedCardNumber')).toEqual(cardNumber);
            expect(applicationParameters.getVariable('hasInfo')).toBeTruthy();
            expect(applicationParameters.getVariable('errorMessage')).toEqual(undefined);
            expect(scope.successMessage).toContain(digitalId.current().preferredName);

            scope.isSuccessful = false;
            scope.$digest();
            expect(applicationParameters.getVariable('isSuccessful')).toEqual(false);

            scope.isSuccessful = true;
            applicationParameters.pushVariable('isSuccessful', true);
            scope.$digest();
            expect(applicationParameters.getVariable('isSuccessful')).toEqual(true);
        });

    });

});
