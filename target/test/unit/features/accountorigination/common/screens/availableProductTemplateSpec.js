describe('available products template', function () {
    'use strict';

    var findProductTile = function (productType) {
        return element.find('product-tile[product-type="' + productType + '"]');
    };

    var findProductTileAccountNumberLink = function (productType) {
        return findProductTile(productType).find('a.account-number');
    };

    var findProductTileApplyForAccountButton = function (productType) {
        return findProductTile(productType).find('apply-for-account');
    };

    var scope, element, templateTest;

    beforeEach(module('refresh.accountOrigination.common.directives.acceptedOffer', 'refresh.accountOrigination.common.directives.productTile'));

    beforeEach(inject(function (TemplateTest) {
        templateTest = TemplateTest;
        scope = TemplateTest.scope;

        templateTest.allowTemplate('features/accountorigination/common/directives/partials/productTile.html');
        templateTest.stubTemplate('features/accountorigination/common/directives/partials/pendingOffer.html');
        templateTest.allowTemplate('features/accountorigination/common/directives/partials/acceptedOffer.html');
        templateTest.allowTemplate('features/accountorigination/common/directives/partials/applyForAccount.html');
        element = templateTest.compileTemplateInFile('features/accountorigination/common/screens/availableproducts/partials/availableProducts.html');
    }));

    describe('Current Account Section', function () {
        describe('EXISTING Current Account', function () {
            beforeEach(function () {
                scope.applications = {
                    current: {
                        status: 'EXISTING',
                        reference: '2245-34-567',
                        productName: 'ELITE CURRENT ACCOUNT'
                    }
                };

                scope.currentAccountTitle = 'Elite';

                scope.$digest();
            });

            it('Apply now should be hidden and account number should be visible', function () {
                expect(findProductTileApplyForAccountButton("current-account")).not.toBePresent();

                expect(findProductTileAccountNumberLink('current-account').text()).toContain('2245-34-567');
            });

            it('should show product accepted', function () {
                expect(findProductTile('current-account')[0].attributes['product-title'].value).toMatch(/Elite/);
            });

            it('should not show application in progress icon', function () {
                expect(element.find('.text-notification')).not.toBePresent();
            });

            it('should show current account description', function () {
                expect(findProductTile('current-account')[0].attributes['product-description'].value).toContain('Easy day-to-day');
            });
        });

        describe('NEW Current Account', function () {
            beforeEach(function () {
                scope.applications = {
                    current: {
                        status: 'NEW'
                    }
                };

                scope.currentAccountTitle = 'Current account';
                scope.$digest();
            });

            it('Apply now should be visible and account number should be hidden', function () {
                expect(findProductTileApplyForAccountButton('current-account')).toBePresent();
                expect(findProductTileAccountNumberLink('current-account')).not.toBePresent();
            });

            it('should show product accepted', function () {
                expect(findProductTile('current-account')[0].attributes['product-title'].value).toMatch(/Current account/);
            });

            it('should show current account description', function () {
                expect(findProductTile('current-account')[0].attributes['product-description'].value).toContain('Easy day-to-day');
            });
        });


        describe('PENDING Current Account', function () {
            beforeEach(function () {
                scope.applications = {
                    current: {
                        status: 'PENDING'
                    }
                };

                scope.currentAccountTitle = 'Current account';
                scope.$digest();
            });

            it('Apply now should be hidden and account number should be hidden', function () {
                expect(element.find('#applyForCurrentAccountButton')).not.toBePresent();
                expect(element.find('#currentAccountNumber').text()).toEqual('');
            });

            it("Details should be hidden", function () {
                expect(element.find('#currentAccountDetails')).not.toBePresent();
            });

            it('Pending offer component should be present', function () {
                expect(element.find('pending-offer')).toBePresent();
            });

            it('should show product accepted', function () {
                expect(findProductTile('current-account')[0].attributes['product-title'].value).toMatch(/Current account/);
            });

            it('should not show application in progress icon', function () {
                expect(element.find('.text-notification')).not.toBePresent();
            });

            it('should show current account description', function () {
                expect(findProductTile('current-account')[0].attributes['product-description'].value).toContain('Easy day-to-day');
            });

        });

        describe('ACCEPTED Current Account', function () {
            beforeEach(function () {
                scope.applications = {
                    current: {
                        status: 'ACCEPTED',
                        productName: 'ELITE CURRENT ACCOUNT'
                    }
                };

                scope.currentAccountTitle = 'Elite';
                scope.$digest();
            });

            it('Apply now should be hidden and account number should be hidden', function () {
                expect(element.find('#applyForCurrentAccountButton')).not.toBePresent();
                expect(element.find('#currentAccountNumber').text()).toEqual('');
            });

            it("Details should be hidden", function () {
                expect(element.find('#currentAccountDetails')).not.toBePresent();
            });

            it('Accepted offer component should be present', function () {
                expect(element.find('accepted-offer')).toBePresent();
            });

            it('should show product accepted', function () {
                expect(findProductTile('current-account')[0].attributes['product-title'].value).toMatch(/Elite/);
            });

            it('should show application in progress icon', function () {
                expect(element.find('.text-notification')).toBePresent();
                expect(element.find('.text-notification').text()).toContain('Application being');
            });

            it('should  notshow current account description', function () {
                expect(element.find('#currentDescription')).not.toBePresent();
            });

        });

    });

    describe('RCP Account Section', function () {

        describe('with existing RCP account', function () {

            beforeEach(function () {
                scope.applications = {
                    rcp: {
                        status: 'EXISTING',
                        reference: '4245-34-567'
                    }
                };
                scope.$digest();
            });

            it('Apply now should be hidden and account number should be visible', function () {
                expect(findProductTileApplyForAccountButton('rcp')).not.toBePresent();
                expect(findProductTileAccountNumberLink('rcp')[0].innerText).toContain('4245-34-567');
            });

            it('Pending offer component should not be present', function () {
                expect(element.find('pending-offer')).not.toBePresent();
            });

            it('should show borrow again text', function () {
                expect(findProductTile('rcp')[0].attributes['product-description'].value).toContain('Borrow again');
            });
        });

        describe('new RCP application', function () {

            beforeEach(function () {
                scope.applications = {
                    rcp: {
                        status: 'NEW'
                    }
                };
                scope.$digest();
            });

            it('Apply now should be visible and account number should be hidden', function () {
                expect(element.find('apply-for-account ')).toBePresent();
                expect(element.find('#rcpAccountNumber').text()).toEqual('');
            });

            it('Pending offer component should not be present', function () {
                expect(element.find('pending-offer')).not.toBePresent();
            });

            it('should show borrow again text', function () {
                expect(findProductTile('rcp')[0].attributes['product-description'].value).toContain('Borrow again');
            });
        });

        describe('pending RCP application', function () {

            beforeEach(function () {
                scope.applications = {
                    rcp: {
                        status: 'PENDING'
                    }
                };
                scope.$digest();
            });

            it('Apply now should be hidden and account number should not be visible', function () {
                expect(element.find('#rCPAccountApplyButton')).not.toBePresent();
                expect(element.find('#rcpAccountNumber')).not.toBePresent();
            });

            it('Details button should not be present', function () {
                expect(element.find('#rcpDetails')).not.toBePresent();
            });

            it('Pending offer component should be present', function () {
                expect(element.find('pending-offer')).toBePresent();
            });

            it('should show borrow again text', function () {
                expect(findProductTile('rcp')[0].attributes['product-description'].value).toContain('Borrow again');
            });
        });

        describe('accepted RCP application', function () {

            beforeEach(function () {
                scope.applications = {
                    rcp: {
                        status: 'ACCEPTED',
                        reference: '126535465',
                        date: '2014-05-17',
                        productName: 'REVOLVING CREDIT PLAN'
                    }
                };
                scope.$digest();
            });

            it('Apply now should be hidden', function () {
                expect(element.find('#rCPAccountApplyButton')).not.toBePresent();
            });


            it('Existing offer should not be visible', function () {
                expect(element.find('#rcpAccountNumber')).not.toBePresent();

            });

            it('Pending offer should not be visible', function () {
                expect(element.find('pending-offer')).not.toBePresent();
            });

            it('Details button should not be present', function () {
                expect(element.find('#rcpDetails')).not.toBePresent();
            });

            it('Accepted offer component should be present with account number and accepted date', function () {
                expect(element.find('accepted-offer')).toBePresent();
                expect(element.find('#acceptedApplicationAccountNumber').text()).toBe('Account number: 126535465');
                expect(element.find('#acceptedDate').text()).toBe('Offer accepted: 17 May 2014');
            });

            it('should show application in progress icon', function () {
                expect(element.find('.text-notification')).toBePresent();
                expect(element.find('.text-notification').text()).toContain('Application being');
            });
        });
    });
});