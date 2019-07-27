describe('leavingFeedbackDirective', function () {
    'use strict';

    var element, scope, card, templateTest;

    beforeEach(module('refresh.feedback', 'refresh.test'));

    beforeEach(inject(function (TemplateTest, $rootScope, Card) {
        scope = $rootScope;
        templateTest = TemplateTest;
        templateTest.scope = scope;
        card = Card;
        spyOn(card, 'anySelected');
        templateTest.allowTemplate('features/feedback/leavingFeedback.html');
    }));

    it('should list reasons for leaving for a logged-in user if a card is selected', function () {
        card.anySelected.and.returnValue(true);
        element = templateTest.compileTemplate('<leaving-feedback></leaving-feedback>');
        expect(scope.reasons()).toEqual([
            "This website is too difficult to use",
            "I'm not comfortable with the changes yet",
            "It's missing some features I need",
            "Something didn't work",
            "Something else"
        ]);
    });

    it('should list reasons for leaving for a logged-out user if no card is selected', function () {
        card.anySelected.and.returnValue(false);
        element = templateTest.compileTemplate('<leaving-feedback></leaving-feedback>');
        expect(scope.reasons()).toEqual([
            "This website is too difficult to use",
            "I'm not comfortable with the changes yet",
            "I'm having trouble registering",
            "Something didn't work",
            "Something else"
        ]);
    });

    describe('when leaving', function () {

        var serviceTest, authenticationService, window, location, digitalId, endpointSpy;

        beforeEach(inject(function (ServiceTest, AuthenticationService, $window, $location, DigitalId) {
            element = templateTest.compileTemplate('<leaving-feedback></leaving-feedback>');
            serviceTest = ServiceTest;
            window = $window;
            location = $location;
            authenticationService = AuthenticationService;
            digitalId = DigitalId;
            endpointSpy = serviceTest.spyOnEndpoint('leavingFeedback');
            serviceTest.stubResponse('leavingFeedback', 200, {});
            spyOn(digitalId, 'current').and.returnValue({});
            spyOn(authenticationService, 'logout');
            spyOn(window, 'open');
        }));

        it('should make a service request with the provided reason', function () {

            scope.sendFeedback('this is my feedback');
            expect(endpointSpy).toHaveBeenCalledWith(
                jasmine.objectContaining(
                    {
                        reason: 'this is my feedback'
                    }
                ),
                {
                    omitServiceErrorNotification: true
                }
            );
        });

        it('should make a service request with the current location', function () {
            spyOn(location, 'absUrl').and.returnValue('someurl');
            scope.sendFeedback('this is my feedback');
            expect(endpointSpy).toHaveBeenCalledWith(
                jasmine.objectContaining(
                    {
                        location: 'someurl'
                    }
                ),
                {
                    omitServiceErrorNotification: true
                }
            );
        });

        it("should make a service request with the current user's user name if available", function () {
            digitalId.current.and.returnValue({username: 'bob'});
            scope.sendFeedback('this is my feedback');
            expect(endpointSpy).toHaveBeenCalledWith(
                jasmine.objectContaining(
                    {
                        digitalId: 'bob'
                    }
                ),
                {
                    omitServiceErrorNotification: true
                }
            );
        });

        it("should make a service request without the username if the digital ID is not available", function () {
            digitalId.current.and.returnValue(undefined);
            scope.sendFeedback('this is my feedback');
            expect(endpointSpy).toHaveBeenCalledWith(
                jasmine.objectContaining(
                    {
                        digitalId: undefined
                    }
                ),
                {
                    omitServiceErrorNotification: true
                }
            );
        });

        it('should redirect you to the old site', function () {
            scope.sendFeedback('this is my feedback');
            expect(window.open).toHaveBeenCalledWith('https://www.encrypt.standardbank.co.za/');
        });

        it('should log you out', function () {
            scope.sendFeedback('this is my feedback');
            serviceTest.resolvePromise();
            expect(authenticationService.logout).toHaveBeenCalled();
        });
    });
});
