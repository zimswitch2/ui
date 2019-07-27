describe('add dashboard', function () {
    'use strict';

    beforeEach(module('refresh.addDashboard.controller', 'refresh.test', 'refresh.flow', 'refresh.registration.service'));

    describe('routes', function () {
        var route;

        beforeEach(inject(function ($route) {
            route = $route;
        }));

        describe('when about to add dashboard', function () {
            it('should use the AddDashboardController and addDashboard.html', function () {
                expect(route.routes['/addDashboard'].controller).toEqual('AddDashboardController');
                expect(route.routes['/addDashboard'].templateUrl).toEqual('features/security/partials/addDashboard.html');
            });
        });
    });

    describe('controller', function () {

        var scope, mock, flow, controller, registrationService, location, viewModel, user;

        var expectedResponse = {
            "channelProfile": {
                "image": "",
                "imageDate": null,
                "profileId": "44532",
                "profileName": "My Personal Dashboard",
                "profileStyle": "PERSONAL",
                "systemPrincipalIdentifiers": [
                    {
                        "systemPrincipalId": "246",
                        "systemPrincipalKey": "SBSA_BANKING"
                    }
                ],
                "tileViews": []
            },
            "keyValueMetadata": [],
            "stepUp": null
        };

        beforeEach(inject(function ($controller, $rootScope, _mock_, Flow, $location, User) {
            scope = $rootScope.$new();
            mock = _mock_;
            flow = Flow;
            controller = $controller;
            registrationService = jasmine.createSpyObj('RegistrationService', ['linkAdditionalCard']);
            location = $location;
            viewModel = jasmine.createSpyObj('ViewModel', ['initial', 'current']);
            user = User;

            user.userProfile.dashboards = [{isHotCarded: function() { return false;}}];
        }));

        var initializeController = function () {
            controller('AddDashboardController', {
                $scope: scope,
                Flow: flow,
                RegistrationService: registrationService,
                ViewModel: viewModel
            });
        };

        describe('flow', function () {
            it('should have a flow with choose dashboard url when all cards are hot carded', function () {
                spyOn(flow, 'create');
                user.userProfile.dashboards = [{isHotCarded: function() { return true;}}, {isHotCarded: function() { return true;}}];
                spyOn(user, 'checkAllHotCardedCards').and.callThrough();
                initializeController();
                expect(flow.create).toHaveBeenCalledWith(['Enter details', 'Enter OTP', 'Dashboard name'],
                    'Add Dashboard', '/choose-dashboard', true);
            });

            it('should have a flow with dashboards url when all cards are not hot carded', function () {
                spyOn(flow, 'create');
                user.userProfile.dashboards = [{isHotCarded: function() { return false;}}, {isHotCarded: function() { return true;}}];
                spyOn(user, 'checkAllHotCardedCards').and.callThrough();
                initializeController();
                expect(flow.create).toHaveBeenCalledWith(['Enter details', 'Enter OTP', 'Dashboard name'],
                    'Add Dashboard', '/dashboards', true);
            });
        });

        it('should initialise ViewModel', function () {
            viewModel.initial.and.returnValue({});
            initializeController();
            expect(scope.channelProfile).toBeDefined();
        });

        describe('on cancel', function () {
            it('should navigate to choose-dashboard when all cards are hot carded', function () {
                user.userProfile.dashboards = [{isHotCarded: function() { return true;}}, {isHotCarded: function() { return true;}}];
                spyOn(user, 'checkAllHotCardedCards').and.callThrough();
                initializeController();
                scope.cancel();
                expect(user.checkAllHotCardedCards).toHaveBeenCalled();
                expect(location.path()).toContain('choose-dashboard');
            });

            it('should navigate to dashboards when a card is not hot carded', function () {
                spyOn(user, 'checkAllHotCardedCards').and.callThrough();
                initializeController();
                scope.cancel();
                expect(user.checkAllHotCardedCards).toHaveBeenCalled();
                expect(location.path()).toContain('dashboards');
            });
        });

        describe('on success', function () {

            beforeEach(function () {
                initializeController();
            });

            it('should ensure that flow.next is called even before linkAdditionalCard is resolved', function () {
                spyOn(flow, 'next');

                registrationService.linkAdditionalCard.and.returnValue(mock.reject({}));

                scope.linkAdditionalCard();
                scope.$digest();

                expect(flow.next).toHaveBeenCalled();
            });

            it('should link additional card', function () {
                spyOn(flow, 'next');

                var cardNumber = '11123233';
                var atmPIN = '44444';
                var contactDetails = {
                    countryCode: '01-26598791',
                    internationalDialingCode: 'Zap',
                    cellPhoneNumber: '26598791'
                };

                scope.cardData.cardNumber = cardNumber;
                scope.cardData.atmPIN = atmPIN;
                scope.cardData.contactDetails = contactDetails;

                registrationService.linkAdditionalCard.and.returnValue(mock.resolve({
                    success: true,
                    data: expectedResponse
                }));

                scope.linkAdditionalCard();
                scope.$digest();

                expect(flow.next).toHaveBeenCalled();
                expect(registrationService.linkAdditionalCard).toHaveBeenCalledWith(cardNumber, contactDetails, atmPIN);
            });

            it('should set the Channel Profile and card number to current view model on link additional card', function () {
                spyOn(flow, 'next');
                scope.cardData.cardNumber = '4444444';

                registrationService.linkAdditionalCard.and.returnValue(mock.resolve({
                    success: true,
                    data: expectedResponse
                }));
                scope.linkAdditionalCard();
                scope.$digest();

                scope.channelProfile = expectedResponse;
                expect(viewModel.current).toHaveBeenCalledWith({channelProfile: scope.channelProfile, cardNumber: '4444444'});
                expect(flow.next).toHaveBeenCalled();
                expect(location.path()).toContain('/addDashboard/saveName');
            });
        });

        describe('on failure', function () {

            beforeEach(function () {
                spyOn(flow, 'previous');
                initializeController();
            });

            it('should not link additional card but set error message', function () {
                var cardNumber = '11123233';
                var atmPIN = '44444';
                var contactDetails = {
                    countryCode: '01-26598791',
                    internationalDialingCode: 'Zap',
                    cellPhoneNumber: '26598791'
                };

                scope.cardData.cardNumber = cardNumber;
                scope.cardData.atmPIN = atmPIN;
                scope.cardData.contactDetails = contactDetails;

                registrationService.linkAdditionalCard.and.returnValue(mock.resolve({
                    success: false,
                    message: 'Card could not be linked.'
                }));

                scope.linkAdditionalCard();
                scope.$digest();

                expect(registrationService.linkAdditionalCard).toHaveBeenCalledWith(cardNumber, contactDetails, atmPIN);
                expect(scope.errorMessage).toEqual('Card could not be linked.');
                expect(flow.previous).toHaveBeenCalled();

            });

        });

    });

});