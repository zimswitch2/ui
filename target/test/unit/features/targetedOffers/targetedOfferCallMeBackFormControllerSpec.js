describe('Targeted Offers Call Me Back Form Controller Unit Test', function () {
    'use strict';

    beforeEach(module('refresh.targetedOffers', 'refresh.test'));

    describe('routes', function () {
        var route;

        beforeEach(inject(function ($route) {
            route = $route;
        }));

        describe("when at targeted offers call me back page", function () {
            it("should use the correct template", function () {
                expect(route.routes['/targetedoffers/:productName/callmeback'].templateUrl).toEqual('features/targetedOffers/partials/targetedOffersCallMeBackForm.html');
            });

            it('should use the correct controller', function () {
                expect(route.routes['/targetedoffers/:productName/callmeback'].controller).toEqual('TargetedOfferCallMeBackFormController');
            });
        });
    });

    describe('targetedOffersCallMeBackFormController', function () {
        var mock, mapFilter, rootScope, $controller, $location, CustomerService, TargetedOffersService, ModalMessage;
        var lastActionedOffer = {
            id: 1,
            userName: "testing@sb.co.za",
            cardNumber: "CARD NUMBER",
            productCode: "CODE",
            productName: "Product name",
            productFamily: "Product family",
            lift: 0,
            confidence: 0,
            order: 0,
            interestRate: 0,
            qualifyingAmount: 40000,
            productType: 'PRODUCT_TYPE',
            acceptButtonText: 'Call me back',
            dcsProductName: 'PRODUCT NAME',
            acceptUrl: '/targetedoffers/callmeback/CODE'
        };
        beforeEach(inject(function ($rootScope, _$controller_, _mock_, _$location_, _CustomerService_, _TargetedOffersService_, _ModalMessage_) {
            rootScope = $rootScope;
            $controller = _$controller_;
            mock = _mock_;
            mapFilter = jasmine.createSpy('mapFilter');
            mapFilter.and.returnValue('Mr');

            $location = _$location_;
            TargetedOffersService = _TargetedOffersService_;
            spyOn(TargetedOffersService, 'getLastActionedOffer').and.returnValue(lastActionedOffer);
            CustomerService = _CustomerService_;
            ModalMessage = _ModalMessage_;
            spyOn(ModalMessage, 'showModal').and.callThrough();
        }));

        describe('Where customer has no contact numbers', function () {
            var scope;
            var customerInformation = {
                "customerTitleCode": "041",
                "customerInitials": "J K",
                "customerFirstName": "John",
                "customerSurname": "Smith",
                "communicationInformation": [],
                "identityDocuments": [
                    {
                        "identityTypeCode": "01",
                        "identityNumber": "*********6082",
                        "countryCode": "ZA"
                    }
                ]
            };

            beforeEach(function () {
                scope = rootScope.$new();
                spyOn(CustomerService, 'getCustomer').and.returnValue(mock.resolve(customerInformation));
                $controller('TargetedOfferCallMeBackFormController',
                    {
                        $scope: scope,
                        $location: $location,
                        mapFilter: mapFilter,
                        CustomerService: CustomerService,
                        TargetedOffersService: TargetedOffersService
                    });
                scope.$digest();
            });

            it('should get the customer details from the server with null values in the contact fields', function () {
                expect(scope.customerModel).toEqual(jasmine.objectContaining({
                    fullName: 'Mr John Smith',
                    idNumber: '*********6082',
                    contact1: null
                }));
            });

            it('should set the call me back product name on the scope to the friendly product name which is mapped to the product code passed', function () {
                expect(TargetedOffersService.getLastActionedOffer).toHaveBeenCalled();
                expect(scope.offer).toBe(lastActionedOffer);
            });

            it('should set the customer record to the return vallue of CustomerService.getCustomer', function () {
                expect(scope.customerRecord).toBe(customerInformation);
            });
        });

        describe('Where customer has contact numbers', function () {
            var scope;
            var customerInformation = {
                "customerTitleCode": "041",
                "customerInitials": "J K",
                "customerFirstName": "John",
                "customerSurname": "Smith",
                "communicationInformation": [
                    {
                        "communicationTypeCode": "02",
                        "communicationDetails": "******5887",
                        "deleteIndicator": false
                    },
                    {
                        "communicationTypeCode": "01",
                        "communicationDetails": "******2144",
                        "deleteIndicator": false
                    }
                ],
                "identityDocuments": [
                    {
                        "identityTypeCode": "01",
                        "identityNumber": "*********6082",
                        "countryCode": "ZA"
                    }
                ]
            };

            beforeEach(function () {
                scope = rootScope.$new();
                spyOn(CustomerService, 'getCustomer').and.returnValue(mock.resolve(customerInformation));
                $controller('TargetedOfferCallMeBackFormController',
                    {
                        $scope: scope,
                        $location: $location,
                        mapFilter: mapFilter,
                        CustomerService: CustomerService,
                        TargetedOffersService: TargetedOffersService,
                        ModalMessage: ModalMessage
                    });
                scope.$digest();
            });

            it('should get the customer details from the server', function () {
                expect(CustomerService.getCustomer).toHaveBeenCalled();
            });

            it('should set the scope property customer details to the customer returned from the server', function () {
                scope.$digest();
                expect(scope.customerModel).toEqual(jasmine.objectContaining({
                    fullName: 'Mr John Smith',
                    idNumber: '*********6082',
                    contact1: '******5887'
                }));
            });

            describe('submit', function () {
                beforeEach(function() {
                    spyOn(TargetedOffersService, 'submitDetailsToDCS').and.returnValue(mock.resolve());
                    spyOn($location, 'path');

                    scope.submit();
                });

                it('should call TargetedOffersService.submitDetailsToDCS with the DCS product name and the customer model being edited', function() {
                    expect(TargetedOffersService.submitDetailsToDCS).toHaveBeenCalledWith('PRODUCT NAME', {
                        fullName: 'Mr John Smith',
                        idNumber: '*********6082',
                        contact1: '******5887'
                    });
                });

                it('should display the modal indicating that the customer\'s details have been sent', function() {
                    scope.$digest();
                    expect(ModalMessage.showModal).toHaveBeenCalledWith(jasmine.objectContaining({
                        title: "Call me back",
                        message: "Thank you -- your details have been sent. A consultant will call you back within one working day."
                    }));
                });

                it('navigate to the account summary page when the modal is closed', function() {
                    scope.$digest();
                    ModalMessage.modalInstance().whenClosed();
                    scope.$digest();
                    expect($location.path).toHaveBeenCalledWith('/account-summary');
                });
            });
        });
    });
});
