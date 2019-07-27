var newRegisteredPageFeature = false;
if (feature.newRegisteredPage) {
    newRegisteredPageFeature = true;
}

describe('link card to profile', function () {
    'use strict';

    var scope, registrationService, location, applicationParameters, test, flow, controller, digitalId, user, __mock__,
        authenticationService;
    var profileId = "IBUser";

    beforeEach(module('refresh.linkCardController',
        'refresh.fixture', 'refresh.security.user',
        'refresh.test'));

    function initializeController() {
        controller('LinkCardController', {
            $scope: scope,
            RegistrationService: registrationService,
            AuthenticationService: authenticationService
        });
    }

    beforeEach(inject(function ($rootScope, $controller, $location, ApplicationParameters, Flow, ServiceTest,
                                User, DigitalId, mock, AuthenticationService) {
        this.rootScope = $rootScope;
        scope = $rootScope.$new();
        registrationService = jasmine.createSpyObj('RegistrationService', ['linkCard', 'processLinkedCard']);
        location = $location;
        applicationParameters = ApplicationParameters;
        test = ServiceTest;
        flow = Flow;
        controller = $controller;
        digitalId = DigitalId;
        user = User;
        __mock__ = mock;

        test.spyOnEndpoint('cards');
        test.stubResponse('cards', 200,
            {
                "card": null,
                "keyValueMetadata": [],
                "stepUp": null,
                "cards": [
                    {
                        "cardNumber": "4451221116405778",
                        "personalFinanceManagementId": 9,
                        "systemPrincipalId": "246",
                        "statusCode": "0000"
                    }
                ]
            }
        );

        user.build({defaultProfileId: profileId, digitalId: {username: 'name'}});
        authenticationService = AuthenticationService;
        newRegisteredPageFeature = true;
        initializeController();
    }));

    it('should link card to profile for newly created digital id', inject(function (Fixture) {
        var cardNumber = '4451221116405778';
        spyOn(flow, 'next');
        var contactDetails = {
            countryCode: 'ZWE',
            internationalDialingCode: '263',
            cellPhoneNumber: '0126598791'
        };
        var atmPin = '12345';

        scope.cardData = {
            cardNumber: cardNumber,
            contactDetails: contactDetails,
            atmPIN: atmPin
        };
        scope.profileId = profileId;

        var response = JSON.parse(Fixture.load('base/test/unit/fixtures/linkCardResponse.json'));
        registrationService.linkCard.and.returnValue(__mock__.resolve({success: true, data: response}));
        registrationService.processLinkedCard.and.returnValue(__mock__.resolve({}));

        scope.linkCardToProfile();
        scope.$digest();

        expect(location.path()).toEqual('/switchDashboard');
        expect(flow.next).toHaveBeenCalled();
        expect(registrationService.linkCard).toHaveBeenCalledWith(cardNumber, profileId, contactDetails, atmPin);
        expect(registrationService.processLinkedCard).toHaveBeenCalledWith(cardNumber, response,
            digitalId.current().profileId);
    }));

    describe('when error', function () {
        beforeEach(function () {
            scope.cardData = {
                cardNumber: "12345678",
                contactDetails: {
                    countryCode: 'ZWE',
                    internationalDialingCode: '263',
                    cellPhoneNumber: '0126598791'
                },
                atmPIN: "12345"
            };

            scope.profileId = "IBUser";

            registrationService.linkCard.and.returnValue(__mock__.resolve({
                success: false,
                message: 'Card could not be linked.'
            }));

            spyOn(flow, 'previous');
            spyOn(location, 'path');
            spyOn(applicationParameters, 'pushVariable');
        });

        it('should not link card to profile for newly created digital id', function () {
            scope.linkCardToProfile();
            scope.$digest();
            expect(scope.errorMessage).toEqual('Card could not be linked.');
            expect(flow.previous).toHaveBeenCalled();
        });

        it('should not redirect or push error message when url is not changed', function () {
            location.path.and.returnValue('/linkcard');
            scope.linkCardToProfile();
            scope.$digest();
            expect(location.path).not.toHaveBeenCalledWith('/linkcard');
            expect(applicationParameters.pushVariable).not.toHaveBeenCalled();
        });

        it('should redirect and push error message when url is changed', function () {
            location.path.and.returnValue('/notlinkcard');
            scope.linkCardToProfile();
            scope.$digest();
            expect(location.path).toHaveBeenCalledWith('/linkcard');
            expect(applicationParameters.pushVariable).toHaveBeenCalledWith('errorMessage','Card could not be linked.');
        });


    });

    it('should sign out', inject(function (AuthenticationService) {
        spyOn(AuthenticationService, 'logout');
        scope.signOut();
        expect(AuthenticationService.logout).toHaveBeenCalled();
    }));

    describe('with newRegisteredPage off', function () {
        beforeEach(function () {
            newRegisteredPageFeature = false;
            initializeController();
        });

        it('should set isSuccessful to true when initialize scope', function () {
            expect(scope.isSuccessful).toBeTruthy();
        });

        it('should set isSuccessful to application parameter when initialize scope', function () {
            applicationParameters.pushVariable('isSuccessful', false);
            initializeController();
            scope.$digest();
            expect(scope.isSuccessful).toBeFalsy();
        });

        it('should have flows of verify otp if linking card', function () {
            expect(flow.get().steps).toEqual([
                {name: 'Enter details', current: true, complete: false},
                {name: 'Enter OTP', current: false, complete: false}
            ]);
            expect(flow.get().headerName).toEqual('Set Up Profile');
        });

        it('should add the title to the scope if linking card', function () {
            expect(scope.title).toEqual('Set Up Profile');
        });
    });

    it('should go back', inject(function ($window) {
        var windowSpy = spyOn($window.history, 'go');
        scope.back();
        expect(windowSpy).toHaveBeenCalledWith(-1);
    }));

    it('should have flows of verify otp if linking card', function () {
        expect(flow.get().steps).toEqual([
            {name: 'Enter details', current: true, complete: false},
            {name: 'Enter OTP', current: false, complete: false}
        ]);
        expect(flow.get().headerName).toEqual('Link Card');
    });

    it('should add the title to the scope if linking card', function () {
        expect(scope.title).toEqual('Link Card');
    });

    it('should not cancel otp if linking card', function () {
        expect(flow.cancelable()).toBeFalsy();
    });

    describe('adding dashboard', function () {
        beforeEach(function () {
            user.build({
                defaultProfileId: profileId, digitalId: {username: 'name'}, channelProfiles: [
                    {
                        systemPrincipalIdentifiers: [
                            {systemPrincipalKey: 'SBSA_BANKING'}
                        ]
                    }
                ]
            });
            initializeController();
        });

        it('should have flows of verify otp if adding dashboard', function () {
            expect(flow.get().steps).toEqual([
                {name: 'Enter details', current: true, complete: false},
                {name: 'Enter OTP', current: false, complete: false}
            ]);
            expect(flow.get().headerName).toEqual('Add Dashboard');
        });

        it('should not cancel otp if adding dashboard', function () {
            expect(flow.cancelable()).toBeTruthy();
        });

        it('should add the title to the scope if adding dashboard', function () {
            expect(scope.title).toEqual('Add Dashboard');
        });
    });

    it('should unset error message', function () {
        scope.errorMessage = 'asd';
        scope.$digest();
        initializeController();
        scope.$digest();
        expect(scope.errorMessage).toBeFalsy();
    });

    it('should have error message displayed if there is an error from otp verify and the message exists', function () {
        applicationParameters.pushVariable('errorMessage', 'Technical Exception');

        initializeController();
        scope.$digest();

        expect(scope.errorMessage).toEqual('Technical Exception');
    });

    it('should set the linkCard message when an application parameter exists', function () {
        applicationParameters.pushVariable('errorMessage', 'message');
        initializeController();
        scope.$digest();
        expect(scope.errorMessage).toEqual('message');
    });

    describe('with newRegisteredPage off', function () {
        beforeEach(function () {
            newRegisteredPageFeature = false;
        });
        it('should set the success message when coming in from login', function () {
            applicationParameters.pushVariable('hasAdded', false);
            digitalId.authenticate(null, 'Test User');
            initializeController();
            scope.$digest();

            expect(scope.successMessage).toEqual("Hello Test User, now let's link your card.");
        });

        it('should set the success message when coming in from register', function () {
            applicationParameters.pushVariable('hasAdded', true);
            digitalId.authenticate(null, 'Test User');
            initializeController();
            scope.$digest();

            expect(scope.successMessage).toEqual("Hello Test User. Your Standard Bank ID has been successfully created. Last step: link your card below ");
        });
    });

    describe('has linked cards', function () {
        it('should set has no linked card to true when user has no dashboard', function () {
            expect(scope.noCardLinked).toBeTruthy();
        });

        it('should set has linked card to false when user has dashboard', function () {
            user.build({
                defaultProfileId: profileId, digitalId: {username: 'name'}, channelProfiles: [
                    {
                        systemPrincipalIdentifiers: [
                            {systemPrincipalKey: 'SBSA_BANKING'}
                        ]
                    }
                ]
            });
            initializeController();
            scope.$digest();

            expect(scope.noCardLinked).toBeFalsy();
        });
    });

    describe('redirects to the first page in the flow when an error occurred', function () {

        var cardNumber = "12345678";
        var profileId = "IBUser";
        var contactDetails = {
            countryCode: 'ZWE',
            internationalDialingCode: '263',
            cellPhoneNumber: '0126598791'
        };
        var atmPin = "12345";

        beforeEach(function () {
            scope.cardData = {
                cardNumber: cardNumber,
                contactDetails: contactDetails,
                atmPIN: atmPin
            };
            scope.profileId = profileId;
        });

        it('should know a card may not be linked because a network timeout occurred', function () {
            registrationService.linkCard.and.returnValue(__mock__.resolve({
                success: false,
                message: 'Card could not be linked. Check your network connection.'
            }));

            scope.linkCardToProfile();
            scope.$digest();

            expect(location.path()).toEqual('/linkcard');
            expect(scope.errorMessage).toEqual('Card could not be linked. Check your network connection.');
            expect(applicationParameters.getVariable('errorMessage')).toEqual('Card could not be linked. Check your network connection.');
        });

        it('should know a card may not be linked because a network timeout occurred with newRegisteredPage feature off', function () {
            newRegisteredPageFeature = false;
            initializeController();
            applicationParameters.pushVariable('hasAdded', true);
            applicationParameters.pushVariable('isSuccessful', true);

            registrationService.linkCard.and.returnValue(__mock__.resolve({
                success: false,
                message: 'Card could not be linked. Check your network connection.'
            }));

            scope.linkCardToProfile();
            scope.$digest();

            expect(location.path()).toEqual('/linkcard');
            expect(scope.errorMessage).toEqual('Card could not be linked. Check your network connection.');
            expect(applicationParameters.getVariable('errorMessage')).toEqual('Card could not be linked. Check your network connection.');
            expect(scope.isSuccessful).toBeFalsy();
            expect(applicationParameters.getVariable('hasAdded')).toBeFalsy();
        });

    });

    describe('watch is successful when newRegisteredPage is off', function () {
        it('should push is successful to application parameter', function () {
            newRegisteredPageFeature = false;
            initializeController();
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
