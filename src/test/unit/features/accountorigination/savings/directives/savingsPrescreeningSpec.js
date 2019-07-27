using(['pure-save', 'market-link', 'tax-free-call-account'], function (product) {
    describe('SavingsPreScreening Button', function () {
        'use strict';

        beforeEach(module('refresh.accountOrigination.savings.directives.savingsPrescreening',
            'refresh.accountOrigination.common.directives.applyForAccount', 'refresh.accountOrigination.savings.domain.savingsAccountApplication'));

        var CustomerService, Card, SavingsAccountApplication, test, element, scope, mock;
        beforeEach(inject(function (_TemplateTest_, _mock_, _CustomerService_, _Card_, _SavingsAccountApplication_) {
            test = _TemplateTest_;
            mock = _mock_;

            CustomerService = _CustomerService_;
            Card = _Card_;
            SavingsAccountApplication = _SavingsAccountApplication_;

            test.allowTemplate('features/accountorigination/common/directives/partials/applyForAccount.html');
            test.allowTemplate('features/accountorigination/savings/directives/partials/savingsPrescreening.html');

            element = test.compileTemplate("<savings-prescreening product-type='" + product + "'></savings-prescreening>");
            scope = element.isolateScope();

            scope.$digest();

        }));

        it('should hide fraud check modal by default', function () {
            expect(element.find('.fraud-check')).toBeHidden();

        });

        it('should hide not KYC compliant modal by default', function () {
            expect(element.find('.not-kyc-compliant')).toBeHidden();

        });

        describe('when apply button is clicked', function () {

            describe('and the customer is compliant', function () {

                beforeEach(function () {
                    spyOn(CustomerService, 'isCustomerCompliant').and.returnValue(mock.resolve(true));
                    Card.setCurrent('12344321');
                    element.find('.apply').click();
                });

                it('should check id the customer is compliant', function () {
                    expect(CustomerService.isCustomerCompliant).toHaveBeenCalledWith(Card.current(), 'Apply for ' + SavingsAccountApplication.availableProducts()[product].ProductName + ' Account');
                });

                it('should show fraud check modal', function () {
                    expect(element.find('.fraud-check')).not.toBeHidden();
                });
            });

            describe('and the customer is NOT compliant', function () {

                beforeEach(function () {
                    spyOn(CustomerService, 'isCustomerCompliant').and.returnValue(mock.resolve(false));
                    Card.setCurrent('12344321');
                    element.find('.apply').click();
                });

                it('should NOT check id the customer is compliant', function () {
                    expect(CustomerService.isCustomerCompliant).toHaveBeenCalled();
                });

                it('should NOT show fraud check modal when apply button is clicked', function () {
                    expect(element.find('.fraud-check')).toBeHidden();
                });

                it('should prompt the customer to present their KYC documents at a branch', function () {
                    expect(element.find('.not-kyc-compliant')).not.toBeHidden();
                });

                describe('clicking on the close button in the non-compliant dialog', function () {
                    it('should hide the non-compliant dialog', function() {
                        element.find('.not-kyc-compliant').find('.primary').click();
                        expect(element.find('.not-kyc-compliant')).toBeHidden();
                    });
                });
            });
        });

        it('should track analytics based on product name', function () {
            expect(element.find('.apply')[0].attributes['data-dtmtext'].value).toBe(product + ' apply button click');
        });

        it('should have creditAndFraudCheckConsent set to false by default', function () {
            expect(scope.creditAndFraudCheckConsent).toBeDefined();
            expect(scope.creditAndFraudCheckConsent).toBeFalsy();
        });

        it('should contain \'Next\' as the apply button\'s text', function () {
            expect(element.find('apply-for-account button')[0].innerText).toBe('Next');
        });

        describe('clicking on fraud check checkbox', function () {
            beforeEach(function () {
                spyOn(CustomerService, 'isCustomerCompliant').and.returnValue(mock.resolve(true));
                element.find('.apply').click();
            });

            it('should set the creditAndFraudCheckConsent', function () {
                expect(scope.creditAndFraudCheckConsent).toBeFalsy();
                element.find('#creditAndFraudCheckConsent').click();
                expect(scope.creditAndFraudCheckConsent).toBeTruthy();
            });

            it('should enable the next button', function () {
                expect(scope.creditAndFraudCheckConsent).toBeFalsy();
                expect(element.find('apply-for-account').find('button')[0].disabled).toBeTruthy();
                element.find('#creditAndFraudCheckConsent').click();
                expect(element.find('apply-for-account').find('button')[0].disabled).toBeFalsy();
            });
        });

        describe('clicking on cancel button', function () {
            beforeEach(function () {
                spyOn(CustomerService, 'isCustomerCompliant').and.returnValue(mock.resolve(true));
            });

            it('should close the fraud check modal', function () {
                element.find('.apply').click();
                expect(element.find('.fraud-check')).not.toBeHidden();
                element.find('.secondary').click();
                expect(element.find('.fraud-check')).toBeHidden();
            });
        });

    });
});