describe('international payment beneficiary navigation directive', function () {
    'use strict';

    var scope, location, internationalPaymentBeneficiary;

    beforeEach(module('refresh.internationalPaymentBeneficiaryNavigation'));

    describe('controller', function () {
        beforeEach(inject(function ($rootScope, $controller, $location, InternationalPaymentBeneficiary) {
            scope = $rootScope.$new();
            scope.currentPage = 'details';
            location = $location;

            spyOn(location, 'url').and.callThrough();

            internationalPaymentBeneficiary = InternationalPaymentBeneficiary;
            internationalPaymentBeneficiary.initialize();

            $controller('internationalPaymentBeneficiaryNavigationController', {
                $scope: scope,
                $location: location
            });
        }));

        describe('navigate', function () {
            it('should not navigate away if the the target page is the same as the current', function () {
                scope.navigate('details');
                expect(location.url).not.toHaveBeenCalled();
            });

            it('should not navigate away if a beneficiary section has not been marked active', function () {
                internationalPaymentBeneficiary.current().bankDetailsActive = false;
                scope.navigate('bank-details');
                expect(location.url).not.toHaveBeenCalled();
            });

            it('should navigate away if the page is in view mode and section has been marked active', function () {
                internationalPaymentBeneficiary.current().bankDetailsActive = true;
                scope.navigate('bank-details');
                expect(location.url).toHaveBeenCalledWith('/international-payment/beneficiary/bank-details');
            });
        });
    });

    describe('directive', function () {
        it('should compile the partial correctly', inject(function (_TemplateTest_) {
            _TemplateTest_.allowTemplate('features/internationalPayment/directive/partials/internationalPaymentBeneficiaryNavigation.html');
            _TemplateTest_.compileTemplate('<international-payment-beneficiary-navigation></international-payment-beneficiary-navigation>');
        }));
    });
});