describe('Unit Test - International Payment Beneficiary Details Controller', function () {
    'use strict';

    beforeEach(module('refresh.internationalPaymentBeneficiaryDetailsController', 'refresh.metadata'));

    describe('routes', function () {
        var route, location;
        beforeEach(inject(function ($route, $location) {
            route = $route;
            location = $location;
        }));

        it('should load the international payment beneficiary details controller', function () {
            expect(route.routes['/international-payment/beneficiary/details'].controller).toBe('InternationalPaymentBeneficiaryDetailsController');
        });

        it('should load the international payment beneficiary details template', function () {
            expect(route.routes['/international-payment/beneficiary/details'].templateUrl).toBe('features/internationalPayment/partials/internationalPaymentBeneficiaryDetails.html');
        });
    });

    describe('controller', function () {
        var controller, scope, mock, location, Flow, internationalPaymentBeneficiary, internationalPaymentService, internationalPaymentCustomer;

        function StaticLookUp(staticValues) {
            return {
                values: function () {
                    return staticValues;
                }
            };
        }

        var LookUps = {
            beneficiaryType: new StaticLookUp([{code: 1, description: 'personal'}])
        };

        function invokeController() {
            controller('InternationalPaymentBeneficiaryDetailsController', {
                $scope: scope,
                $location: location,
                LookUps: LookUps,
                Flow: Flow,
                InternationalPaymentService: internationalPaymentService,
                InternationalPaymentCustomer: internationalPaymentCustomer
            });

            scope.$digest();
        }

        beforeEach(inject(function ($controller, $rootScope, $location, _mock_, $q, _Flow_, InternationalPaymentBeneficiary, InternationalPaymentCustomer) {
            controller = $controller;
            scope = $rootScope.$new();
            location = $location;
            mock = _mock_;
            Flow = _Flow_;
            internationalPaymentBeneficiary = InternationalPaymentBeneficiary;

            internationalPaymentService = jasmine.createSpyObj('internationalPaymentService', ['getCountries', 'getCurrencies', 'validateDetails']);
            internationalPaymentService.getCountries.and.returnValue($q.defer().promise);

            internationalPaymentCustomer = InternationalPaymentCustomer;
            internationalPaymentCustomer.initialize({isResident: false});
        }));

        it("should set beneficiary details on the scope", function () {
            internationalPaymentBeneficiary.initialize();
            internationalPaymentBeneficiary.current().whatever = 'whatever';

            invokeController();
            expect(scope.beneficiary.whatever).toEqual('whatever');
        });

        it("should set customer details on the scope", function () {
            invokeController();
            expect(scope.customerDetails.isResident()).toBeFalsy();
        });

        describe("list options", function () {
            beforeEach(function () {
                invokeController();
            });

            it("beneficiaryTypes", function () {
                invokeController();
                expect(scope.beneficiaryTypes).toEqual([{code: 1, description: 'personal'}]);
            });

            it('should set the countries on the scope', function () {

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
                invokeController();
                expect(scope.countries).toEqual(countries);
                expect(scope.countries[0].label()).toEqual('Andorra');
            });
        });

        describe("beneficiaryTypeChanged", function () {
            beforeEach(function () {
                internationalPaymentBeneficiary.initialize();
                internationalPaymentBeneficiary.current().firstName = 'firstName';
                internationalPaymentBeneficiary.current().lastName = 'lastName';
                internationalPaymentBeneficiary.current().gender = 'FEMALE';
                internationalPaymentBeneficiary.current().entityName = 'entityName';

                invokeController();
            });

            it('should clear individual beneficiary type fields if entity is selected', function () {
                scope.beneficiary.type = 'ENTITY';
                scope.beneficiaryTypeChanged();

                expect(internationalPaymentBeneficiary.current().firstName).toBeUndefined();
                expect(internationalPaymentBeneficiary.current().lastName).toBeUndefined();
                expect(internationalPaymentBeneficiary.current().gender).toBeUndefined();
                expect(internationalPaymentBeneficiary.current().entityName).toEqual('entityName');
            });

            it('should clear entity beneficiary type fields if individual is selected', function () {
                scope.beneficiary.type = 'INDIVIDUAL';
                scope.beneficiaryTypeChanged();

                expect(internationalPaymentBeneficiary.current().firstName).toEqual('firstName');
                expect(internationalPaymentBeneficiary.current().lastName).toEqual('lastName');
                expect(internationalPaymentBeneficiary.current().gender).toEqual('FEMALE');
                expect(internationalPaymentBeneficiary.current().entityName).toBeUndefined();
            });
        });

        describe("next", function () {
            beforeEach(function () {
                internationalPaymentBeneficiary.initialize();
                invokeController();
                scope.next();
            });

            it('should navigate to international payment beneficiary bank details', function () {
                expect(location.url()).toBe('/international-payment/beneficiary/bank-details');
            });

            it('should set bank details active on beneficiary', function () {
                expect(internationalPaymentBeneficiary.current().bankDetailsActive).toBeTruthy();
            });
        });

        describe("back", function () {
            beforeEach(function () {
                spyOn(Flow, 'previous');
                invokeController();
                scope.back();
            });

            it('should navigate to international payment personal details', function () {
                expect(location.url()).toBe('/international-payment/personal-details');
            });

            it('should go back to the previous step of flow', function () {
                expect(Flow.previous).toHaveBeenCalled();
            });
        });
    });
});
