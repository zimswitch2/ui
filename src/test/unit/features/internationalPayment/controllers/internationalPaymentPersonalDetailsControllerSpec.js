describe('Unit Test - International Payment Personal Details Controller', function () {
    'use strict';

    beforeEach(module('refresh.internationalPaymentPersonalDetailsController', 'refresh.test'));

    describe('routes', function () {
        var route, location;
        beforeEach(inject(function ($route, $location) {
            route = $route;
            location = $location;
        }));

        it('should load the international payment personal details controller', function () {
            expect(route.routes['/international-payment/personal-details'].controller).toBe('InternationalPaymentPersonalDetailsController');
        });

        it('should load the international payment personal details template', function () {
            expect(route.routes['/international-payment/personal-details'].templateUrl).toBe('features/internationalPayment/partials/internationalPaymentPersonalDetails.html');
        });
    });

    describe('controller', function () {
        var controller, scope, mock, location, Flow, internationalPaymentCustomer, internationalPaymentService;

        function invokeController() {
            controller('InternationalPaymentPersonalDetailsController', {
                $scope: scope,
                $location: location,
                Flow: Flow,
                InternationalPaymentCustomer: internationalPaymentCustomer,
                InternationalPaymentService: internationalPaymentService
            });

            scope.$digest();
        }

        beforeEach(inject(function ($controller, $rootScope, $location, _mock_, _Flow_, InternationalPaymentCustomer, $q) {
            controller = $controller;
            scope = $rootScope.$new();
            mock = _mock_;
            location = $location;
            Flow = _Flow_;

            internationalPaymentService = jasmine.createSpyObj('internationalPaymentService', ['getCountries']);
            internationalPaymentService.getCountries.and.returnValue($q.defer().promise);

            internationalPaymentCustomer = InternationalPaymentCustomer;
        }));

        it("should set customerDetails in the scope", function () {
            var customerDetails = {
                firstName: 'Brandy',
                lastName: 'Hammer',
                isResident: true
            };

            internationalPaymentCustomer.initialize(customerDetails);

            invokeController();
            expect(scope.customerDetails).toEqual(customerDetails);
        });

        describe('country of issue', function() {
            beforeEach(function() {
                var countries = [
                    {
                        "code": "AD",
                        "defaultCurrency": {
                            "code": "EUR",
                            "currencyPair": null,
                            "name": "Euro"
                        },
                        "ibanCapable": true,
                        "name": "Andorra",
                        "routingName": "",
                        "usableForPayment": true
                    },
                    {
                        "code": "AE",
                        "defaultCurrency": {
                            "code": "AED",
                            "currencyPair": null,
                            "name": "United Arab Emirates Dirham"
                        },
                        "ibanCapable": true,
                        "name": "United Arab Emirates",
                        "routingName": "",
                        "usableForPayment": true
                    }
                ];

                internationalPaymentService.getCountries.and.returnValue(mock.resolve(countries));
            });

            it('should set the country details for country and work permit', function() {
                var customerDetails = {
                    firstName: 'Brandy',
                    lastName: 'Hammer',
                    countryOfIssue: "AE",
                    isResident: true
                };

                internationalPaymentCustomer.initialize(customerDetails);

                invokeController();

                expect(scope.countryOfIssueName).toEqual("United Arab Emirates");
            });

            it('should set the country name to the country code if not in the country list', function() {
                var customerDetails = {
                    firstName: 'Brandy',
                    lastName: 'Hammer',
                    countryOfIssue: "BN",
                    isResident: true
                };

                internationalPaymentCustomer.initialize(customerDetails);

                invokeController();

                expect(scope.countryOfIssueName).toEqual("BN");
            });
        });



        describe('when next is clicked', function () {
            beforeEach(function () {
                var customerDetails = {
                    firstName: 'Brandy',
                    lastName: 'Hammer',
                    isResident: true
                };

                internationalPaymentCustomer.initialize(customerDetails);

                spyOn(Flow, 'next');
                invokeController();
                scope.submit();
                scope.$digest();
            });

            it('should navigate to international payment beneficiary details', function () {
                expect(location.url()).toBe('/international-payment/beneficiary/details');
            });

            it('should continue to the next step of Flow', function () {
                expect(Flow.next).toHaveBeenCalled();
            });
        });

        describe("when back is clicked", function () {
            beforeEach(function () {
                var customerDetails = {
                    firstName: 'Brandy',
                    lastName: 'Hammer',
                    isResident: true
                };

                internationalPaymentCustomer.initialize(customerDetails);

                invokeController();
                scope.back();
            });

            it('should navigate to international payment', function () {
                expect(location.url()).toBe('/international-payment');
            });
        });
    });
});
