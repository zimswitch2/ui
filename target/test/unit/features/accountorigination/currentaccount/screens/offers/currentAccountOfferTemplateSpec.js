describe('offers template', function () {
    'use strict';
    var scope, element, templateTest;

    function expectElementToBeHidden(elementId) {
        expect(element.find(elementId).hasClass('ng-hide')).toBeTruthy();
    }

    function expectElementToBeShown(elementId) {
        expect(element.find(elementId).hasClass('ng-hide')).toBeFalsy();
    }

    beforeEach(module('refresh.filters'));
    beforeEach(module('refresh.amount'));
    beforeEach(module('refresh.directives.converttoint'));
    beforeEach(module('refresh.validators.limits'));

    beforeEach(inject(function (TemplateTest) {
        templateTest = TemplateTest;
        scope = TemplateTest.scope;
        templateTest.allowTemplate('common/amount/partials/amount.html');
        templateTest.allowTemplate('common/print/partials/printFooter.html');
        templateTest.allowTemplate('features/accountorigination/common/screens/printheader/partials/printHeader.html');
        templateTest.allowTemplate('common/flow/partials/flow.html');
        templateTest.allowTemplate('common/sbform/partials/sbTextInput.html');
        scope.enforcer = function () {
            return [];
        };
        element =
            templateTest.compileTemplateInFile('features/accountorigination/currentaccount/screens/offers/partials/currentAccountOffer.html');
    }));

    describe('product selection', function () {
        it('should display if more than one product', function () {
            scope.moreThanOne = true;
            scope.offer = {
                products: [
                    {
                        name: 'ELITgstE CURRENT ACCOUNT',
                        number: 132
                    },
                    {
                        name: 'ELITE PLUS CURRENT ACCOUNT',
                        number: 645
                    }
                ]
            };
            scope.$digest();

            expect(element.find('#productOptionTitle').length).toEqual(1);
            expect(element.find('.choose-offer').length).toEqual(2);
            expect(element.find('.option-box-single').length).toEqual(0);
            expect(element.find('#customerCareLine').text()).toMatch('Customer Care: 0860 123 000');
        });

        it('should not display only one product', function () {
            scope.moreThanOne = false;
            scope.offer = {
                products: [
                    {
                        name: 'ELITE CURRENT ACCOUNT',
                        number: 132
                    }
                ]
            };
            scope.$digest();

            expect(element.find('#productOptionTitle').length).toEqual(0);
            expect(element.find('.choose-offer').length).toEqual(0);
            expect(element.find('.option-box-single').length).toEqual(1);
        });

        it('should not display customer care line for private banking product', function () {
            scope.isPrivateBankingProduct = true;
            scope.$digest();

            expect(element.find('#customerCareLine').text()).toMatch('Private Banking Line: 0860 123 101');
        });
    });

    describe('overdraft toggle', function () {
        it('should display overdraft section', function () {
            scope.allowOverdraftApplication = function () {
                return true;
            };
            scope.offer = {
                overdraft: {
                    limit: 6000,
                    interestRate: 22.5
                }
            };
            scope.$digest();

            expect(element.find('section.overdraft').hasClass('ng-hide')).toBeFalsy();
            expect(element.find('section.overdraft .limit').text()).toContain('R 6 000.00');
            expect(element.find('section.overdraft .rate').text()).toContain('22.5%');
        });

        it('should not display overdraft options', function () {
            scope.allowOverdraftApplication = function () {
                return false;
            };
            scope.$digest();

            expect(element.find('section.overdraft').hasClass('ng-hide')).toBeTruthy();
        });
    });

    describe('overdraft chosen', function () {
        beforeEach(function () {
            scope.offeredOverdraft = function () {
                return true;
            };
            scope.selectedProductIndex = 0;
            scope.offer = {
                overdraft: {
                    limit: 6000,
                    interestRate: 22.5,
                    statementsConsent: {}
                }
            };
            scope.selection = {
                product: {name: 'product 1'},
                branch: 'Alice'
            };
            templateTest.clickCheckbox(element.find('section.overdraft .choose-overdraft'), true);
            templateTest.changeInputValueTo(element.find('section.overdraft .amount input'), '5000');
            scope.$digest();
        });

        it('should apply for overdraft', function () {
            expect(scope.offer.overdraft.selected).toBeTruthy();
        });

        it('should apply with custom amount', function () {
            expect(scope.offer.overdraft.amount).toEqual(5000);
        });

        it('should not have validation errors', function () {
            expect(element.find('section.overdraft span.form-error').length).toEqual(0);
        });

        it('should enable apply button', function () {
            expect(element.find('#accept').attr('disabled')).toBeUndefined();
        });

        it('should validate amount using the enforcer', function () {
            scope.enforcer = function () {
                return {error: true, type: 'foo', message: 'Please enter an amount greater than zero'};
            };
            element =
                templateTest.compileTemplateInFile('features/accountorigination/currentaccount/screens/offers/partials/currentAccountOffer.html');
            templateTest.changeInputValueTo(element.find('section.overdraft .amount input'), '');
            scope.$digest();
            expect(element.find('section.overdraft span.form-error').text()).toContain('Please enter an amount greater than zero');
            expect(element.find('#accept').attr('disabled')).toBe('disabled');
        });

        it('should not disable amount input', function () {
            scope.$apply();
            expect(element.find('input[name="amount"]').attr('disabled')).toBeUndefined();
        });

        it('should display overdraft disclaimer', function () {
            scope.$apply();
            expect(element.find('section.overdraft .notification')).not.toBeHidden();
        });

        describe('account statement consent', function () {
            it('consent should be checked by default', function (){
                expect(element.find('#currentAccountGiveConsent').is(':checked')).toBeTruthy();
            });

            describe('consent', function () {
                it('should show consent branch account fields', function(){
                    scope.offer.overdraft.statementsConsent.selected = true;
                    scope.$digest();

                    expectElementToBeShown('#currentAccountGiveConsentFields');
                    expectElementToBeHidden('#currentAccountGiveConsentNotification');
                });
            });

            describe('do not consent', function () {
                it('should not show consent branch account fields', function(){
                    scope.offer.overdraft.statementsConsent.selected = false;
                    scope.$digest();

                    expectElementToBeHidden('#currentAccountGiveConsentFields');
                    expectElementToBeShown('#currentAccountGiveConsentNotification');
                });
            });
        });
    });

    describe('overdraft not chosen', function () {
        beforeEach(function () {
            scope.offeredOverdraft = function () {
                return true;
            };
            scope.selectedProductIndex = 0;
            scope.offer = {
                overdraft: {
                    limit: 6000,
                    interestRate: 22.5
                }
            };
            scope.selection = {
                product: {name: 'product 1'},
                branch: 'Alice'
            };
            templateTest.clickCheckbox(element.find('section.overdraft .choose-overdraft'), false);
        });

        it('should apply without overdraft', function () {
            templateTest.changeInputValueTo(element.find('section.overdraft .amount input'), '5000');
            scope.$apply();
            expect(scope.offer.overdraft.selected).toBeFalsy();
            expect(scope.selectOfferForm.$valid).toBeTruthy();
        });

        it('should not disable apply despite invalid amount', function () {
            templateTest.changeInputValueTo(element.find('section.overdraft .amount input'), '99');
            scope.$apply();
            expect(element.find('#accept').attr('disabled')).toBeUndefined();
        });

        it('should disable amount input', function () {
            scope.$apply();
            expect(element.find('input[name="amount"]').attr('disabled')).toEqual('disabled');
        });

        it('should re-set amount to zero', function () {
            templateTest.clickCheckbox(element.find('section.overdraft .choose-overdraft'), true);
            templateTest.changeInputValueTo(element.find('section.overdraft .amount input'), '1000');
            scope.$apply();
            expect(element.find('input[name="amount"]').attr('disabled')).toBeUndefined();
            expect(scope.offer.overdraft.amount).toEqual(1000);
            templateTest.clickCheckbox(element.find('section.overdraft .choose-overdraft'), false);
            templateTest.changeInputValueTo(element.find('section.overdraft .amount input'), '0');
            scope.$apply();
            expect(scope.offer.overdraft.amount).toEqual(0);
        });

        it('should not display overdraft disclaimer', function () {
            scope.$apply();
            expect(element.find('section.overdraft .notification')).toBeHidden();
        });
    });
})
;
