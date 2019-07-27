describe('Unit Test - International Payment Controller', function () {
    'use strict';

    beforeEach(module('refresh.internationalPaymentController'));

    describe('routes', function () {
        var route, location;
        beforeEach(inject(function ($route, $location) {
            route = $route;
            location = $location;
        }));

        it('should load the international payment controller', function () {
            expect(route.routes['/international-payment'].controller).toBe('InternationalPaymentController');
        });

        it('should load the international payment template', function () {
            expect(route.routes['/international-payment'].templateUrl).toBe('features/internationalPayment/partials/internationalPayment.html');
        });
    });

    describe('controller', function () {
        var scope, location, controller, Flow, accountsService, card, ipCookie, internationalPaymentService, mock, internationalPaymentCustomer, internationalPaymentBeneficiary, reasonForPaymentSearch;

        function initController(){
            controller('InternationalPaymentController', {
                $scope: scope,
                $location: location,
                Card: card,
                AccountsService: accountsService,
                InternationalPaymentService: internationalPaymentService
            });

            scope.$digest();
        }

        beforeEach(inject(function ($controller, $rootScope, $location, _Flow_, _ipCookie_, _mock_, $q, InternationalPaymentCustomer, InternationalPaymentBeneficiary, ReasonForPaymentSearch) {
            controller = $controller;
            scope = $rootScope.$new();
            location = $location;
            Flow = _Flow_;
            ipCookie = _ipCookie_;
            mock = _mock_;
            reasonForPaymentSearch = ReasonForPaymentSearch;

            card = jasmine.createSpyObj('card', ['current']);
            card.current.and.returnValue({number: 'number'});

            accountsService = jasmine.createSpyObj('accountsService', ['currentAndSavingsAccounts']);
            accountsService.currentAndSavingsAccounts.and.returnValue($q.defer().promise);

            internationalPaymentCustomer = InternationalPaymentCustomer;
            internationalPaymentBeneficiary = InternationalPaymentBeneficiary;

            internationalPaymentService = jasmine.createSpyObj('internationalPaymentService', ['getCustomerDetails']);
            internationalPaymentService.getCustomerDetails.and.returnValue($q.defer().promise);

            Flow.create(['Personal details', 'Beneficiary details', 'Reason for payment', 'Pay', 'OTP', 'Confirm details']);
        }));

        describe('when initializing', function() {
            it('should get customer details', function () {
                initController();
                expect(internationalPaymentService.getCustomerDetails).toHaveBeenCalled();
            });

            it("should set customerDetails on the InternationalPaymentCustomer", function () {
                var customerDetails = {
                    firstName: 'Brandy',
                    lastName: 'Hammer'
                };

                internationalPaymentService.getCustomerDetails.and.returnValue(mock.resolve(customerDetails));
                initController();
                expect(scope.customerDetails).toEqual(customerDetails);
            });

            it('should initialize the beneficiary', function() {
                initController();
                expect(internationalPaymentBeneficiary.current().type).toEqual('INDIVIDUAL');
            });

            describe('hasValidAccount', function (){
                it('should set it to true if customer has an account returned by currentAndSavingsAccounts call for account service', function() {
                    accountsService.currentAndSavingsAccounts.and.returnValue(mock.resolve({account: 'account'}));
                    initController();

                    expect(scope.hasValidAccount).toBeTruthy();
                });

                it('should set it to false if customer has no account returned by currentAndSavingsAccounts call for account service', function() {
                    accountsService.currentAndSavingsAccounts.and.returnValue(mock.resolve({}));
                    initController();

                    expect(scope.hasValidAccount).toBeFalsy();
                });
            });

            it('should clear the reason for payment search text', function() {
                reasonForPaymentSearch.get().searchText = 'search text';
                initController();
                expect(reasonForPaymentSearch.get().searchText).toEqual('');
            });
        });

        describe('international payment cookie', function(){
            it('sets the internationalPaymentTermsAndConditions and hideTermsAndConditions on the scope if international payment cookie defined', function(){
                ipCookie('HAS_ACCEPTED_XBP_TERMS_AND_CONDITIONS', true, { path: '/', expires: 60 });
                initController();
                expect(scope.internationalPaymentTermsAndConditions).toBeTruthy();
                expect(scope.hideTermsAndConditions).toBeTruthy();
            });

            it('does not set the internationalPaymentTermsAndConditions and hideTermsAndConditions on the scope if international payment cookie is undefined', function(){
                ipCookie.remove('HAS_ACCEPTED_XBP_TERMS_AND_CONDITIONS');
                initController();
                expect(scope.internationalPaymentTermsAndConditions).toBeUndefined();
                expect(scope.hideTermsAndConditions).toBeUndefined();
            });
        });

        describe('when get started is clicked', function () {
            beforeEach(function () {
                initController();
                scope.submit();
                scope.$digest();
            });

            it('should navigate to international payment details', function () {
                expect(location.url()).toBe('/international-payment/personal-details');
            });

            it('should create the Flow', function () {
                expect(Flow.steps().map(function (step) {
                    return step.name;
                })).toEqual(['Personal details', 'Beneficiary details', 'Reason for payment', 'Pay', 'OTP',
                    'Confirm details']);
            });

            it('should continue to the next step of flow', function () {
                expect(Flow.currentStep().name).toEqual('Personal details');
            });

            describe('international payment cookie', function(){
                it('sets the cookie on the scope if not defined', function(){
                    scope.internationalPaymentTermsAndConditions = true;
                    scope.submit();
                    scope.$digest();
                    expect(ipCookie()).toEqual(jasmine.objectContaining({
                        HAS_ACCEPTED_XBP_TERMS_AND_CONDITIONS: true
                    }));
                });
            });
        });
    });
});
