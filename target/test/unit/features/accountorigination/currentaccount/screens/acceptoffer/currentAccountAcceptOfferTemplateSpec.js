describe('accept offer template', function () {
    'use strict';

    var scope, element, templateTest, html;

    beforeEach(module('refresh.filters'));

    beforeEach(inject(function (TemplateTest, Fixture) {
        templateTest = TemplateTest;
        scope = templateTest.scope;
        templateTest.allowTemplate('common/flow/partials/flow.html');
        html = templateTest.addRootNodeToDocument(Fixture.load('base/main/features/accountorigination/currentaccount/screens/acceptoffer/partials/acceptOffer.html'));
        element = templateTest.compileTemplate(html);
    }));

    it('should disable confirm button when canSubmit is false', function () {
        scope.canSubmit = function () {
            return false;
        };
        scope.$digest();
        expect(element.find('.actions #confirm').attr('disabled')).toBeTruthy();
    });

    it('should enable confirm button when canSubmit is true', function () {
        scope.canSubmit = function () {
            return true;
        };
        scope.$digest();
        expect(element.find('.actions #confirm').attr('disabled')).toBeFalsy();
    });

    it('should disable confirm button on service error', function () {
        scope.agreed = true;
        scope.error = 'This service is currently unavailable. Please try again later, while we investigate';
        scope.$digest();
        expect(element.find('.actions #confirm').attr('disabled')).toBeTruthy();
    });

    describe('preferred branch', function () {
        it('should be visible for non-private banking product', function () {
            expect(element.find('.summary-ao-row:nth-child(3)').hasClass('ng-hide')).toBeFalsy();
            expect(element.find('.summary-ao-row:nth-child(3) .summary-ao-label').text()).toEqual('Preferred branch');
        });

        it('should not be visible for private banking product', function () {
            scope.isPrivateBankingProduct = true;
            scope.$digest();

            expect(element.find('.summary-ao-row:nth-child(3)').hasClass('ng-hide')).toBeTruthy();
        });
    });

    describe('overdraft state', function () {
        describe('enabled', function () {
            beforeEach(function () {
                scope.overdraftSelected = function () {
                    return true;
                };
                scope.offer = {
                    applicationNumber: "AA001"
                };
                scope.product = {
                    number: 2
                };
                scope.overdraft = {
                    amount: 5000,
                    interestRate: 22.5
                };
                scope.principal = {
                    systemPrincipalId: "1100",
                    systemPrincipalKey: "SBSA"
                };
                scope.costOfCreditLetterURL = "/testurl";
                scope.$digest();
            });

            it('should show overdraft section', function () {
                expect(element.find('#overdraft-summary').hasClass('ng-hide')).toBeFalsy();
                expect(element.find('#overdraft-limit').text()).toEqual('R 5 000.00');
                expect(element.find('#overdraft-rate').text()).toEqual('22.5%');
            });

            it('should show the terms and conditions with overdraft agreement part', function () {
                expect(element.find('form[name="costOfCreditDownloadForm"]')).not.toBeHidden();
                expect(element.find('form[name="costOfCreditDownloadForm"]')).toBeDefined();
            });

            it('should show "overdraft agreement" as a link when rcp is toggled on', function () {
                var overdraftLink = element.find('form[name="costOfCreditDownloadForm"] a');
                expect(overdraftLink.length).toEqual(1);
            });
        });

        describe('disabled', function () {
            it('should not show overdraft section', function () {
                scope.overdraftSelected = function () {
                    return false;
                };
                scope.$digest();
                expect(element.find('section.overdraft').length).toEqual(0);
            });

            it('should not have overdraft terms and conditions', function () {
                expect(element.find('form[name="costOfCreditDownloadForm"]').length).toEqual(0);
            });
        });
    });
});