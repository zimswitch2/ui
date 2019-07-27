using([{productTitle: 'Revolving credit plan', productDescription: 'Borrow again after paying back part of your loan',
     imageUrl: 'assets/images/rcp.jpg', productType: 'rcp', detailsPageUrl: '/apply/rcp',
     application: { }, accountNumberLabel: "Your RCP account number" },
    {productTitle: 'Current account', productDescription: 'asy day-to-day banking with an overdraft',
     imageUrl: 'assets/images/current-account.jpg', productType: 'current-account', detailsPageUrl: '/apply/current-account',
     application: { }, accountNumberLabel: "Your Current account number" }], function (product) {
    describe('Product tile', function () {
        'use strict';

        var test, element, scope;

        beforeEach(function () {
            module('refresh.accountOrigination.common.directives.productTile', 'refresh.accountOrigination.common.directives.pendingOffer');
            inject(function (_TemplateTest_) {
                test = _TemplateTest_;
                test.allowTemplate('features/accountorigination/common/directives/partials/applyForAccount.html');
                test.allowTemplate('features/accountorigination/common/directives/partials/pendingOffer.html');
                test.allowTemplate('features/accountorigination/common/directives/partials/acceptedOffer.html');
                test.allowTemplate('features/accountorigination/common/directives/partials/productTile.html');
                test.scope.application = product.application;
            });
        });

        var compileTemplate = function() {
            element = test.compileTemplate("<product-tile product-title='" + product.productTitle +
                "' product-description='" + product.productDescription + "' product-image-url='" + product.imageUrl +
                "' product-type='" + product.productType + "' details-page-url='" + product.detailsPageUrl +
                "' application='application' account-number-label='" + product.accountNumberLabel + "'></product-tile>");
            scope = element.isolateScope();
            scope.$digest();
        };

        describe('For new applications', function () {
            beforeEach(function () {
                test.scope.application.status = "NEW";
                compileTemplate();
            });

            it('should have product title', function () {
                expect(element.find('h3')[0].innerText).toBe(product.productTitle);
            });

            it('should have product description', function () {
                expect(element.find('p')[0].innerText).toBe(product.productDescription);
            });

            it('should have image source', function () {
                expect(element.find('img')[0].src).toContain(product.imageUrl);
            });

            it('should have image alternative text', function () {
                expect(element.find('img')[0].alt).toContain(product.productTitle);
            });

            it('should NOT have a text notification', function () {
                expect(element.find('.text-notification')).not.toBePresent();
            });

            it('should NOT have an account information section', function () {
                expect(element.find('.account-information')).not.toBePresent();
            });

            it('should have a apply-for-account button for the product type', function () {
                expect(element.find('apply-for-account')[0].attributes['product-type'].value).toBe(product.productType);
            });

            it('should have a link to the product\'s details page which contains a track click for the product', function () {
                expect(element.find('a')[0].href).toContain("#" + product.detailsPageUrl);
                expect(element.find('a')[0].attributes['data-dtmtext'].value).toBe(product.productTitle + " details button click");
            });

            it('should NOT have pending offer details', function () {
                expect(element.find('pending-offer')).not.toBePresent();
            });

            it('should NOT have accepted offer details', function () {
                expect(element.find('accepted-offer')).not.toBePresent();
            });
        });

        describe('For accepted applications', function () {
            beforeEach(function () {
                test.scope.application.status = "ACCEPTED";
                compileTemplate();
            });

            it('should NOT have product description', function () {
                expect(element.find('p')).not.toBePresent();
            });

            it('should have a text notification', function () {
                expect(element.find('.text-notification')[0].innerText).toBe("Application being processed");
            });

            it('should NOT have an account information section', function () {
                expect(element.find('.account-information')).not.toBePresent();
            });

            it('should NOT have a apply-for-account button for the product type', function () {
                expect(element.find('apply-for-account')).not.toBePresent();
            });

            it('should NOT have a link to the product\'s details page which contains a track click for the product', function () {
                expect(element.find('a.btn.secondary')).not.toBePresent();
            });

            it('should NOT have pending offer details', function () {
                expect(element.find('pending-offer')).not.toBePresent();
            });

            it('should have accepted offer details', function () {
                expect(element.find('accepted-offer')).toBePresent();
            });
        });

        describe('For pending applications', function () {
            beforeEach(function () {
                test.scope.application.status = "PENDING";
                compileTemplate();
            });

            it('should have product title', function () {
                expect(element.find('h3')[0].innerText).toBe(product.productTitle);
            });

            it('should have product description', function () {
                expect(element.find('p')[0].innerText).toBe(product.productDescription);
            });

            it('should have image source', function () {
                expect(element.find('img')[0].src).toContain(product.imageUrl);
            });

            it('should have image alternative text', function () {
                expect(element.find('img')[0].alt).toContain(product.productTitle);
            });

            it('should NOT have a text notification', function () {
                expect(element.find('.text-notification')).not.toBePresent();
            });

            it('should NOT have an account information section', function () {
                expect(element.find('.account-information')).not.toBePresent();
            });

            it('should NOT have an apply-for-account button', function () {
                expect(element.find('apply-for-account')).not.toBePresent();
            });

            it('should NOT have a link to the product\'s details page which contains a track click for the product', function () {
                expect(element.find('a.btn.secondary')).not.toBePresent();
            });

            it('should have pending offer details', function () {
                expect(element.find('pending-offer')).toBePresent();
            });

            it('should NOT have accepted offer details', function () {
                expect(element.find('accepted-offer')).not.toBePresent();
            });
        });

        describe('For accepted applications', function () {
            beforeEach(function () {
                test.scope.application.status = "ACCEPTED";
                compileTemplate();
            });

            it('should have product title', function () {
                expect(element.find('h3')[0].innerText).toBe(product.productTitle);
            });

            it('should NOT have product description', function () {
                expect(element.find('p')).not.toBePresent();
            });

            it('should have image source', function () {
                expect(element.find('img')[0].src).toContain(product.imageUrl);
            });

            it('should have image alternative text', function () {
                expect(element.find('img')[0].alt).toContain(product.productTitle);
            });

            it('should have a text notification', function () {
                expect(element.find('.text-notification')[0].innerText).toBe("Application being processed");
            });

            it('should NOT have an account information section', function () {
                expect(element.find('.account-information')).not.toBePresent();
            });

            it('should NOT have an apply-for-account button', function () {
                expect(element.find('apply-for-account')).not.toBePresent();
            });

            it('should NOT have a link to the product\'s details page which contains a track click for the product', function () {
                expect(element.find('a.btn.secondary')).not.toBePresent();
            });

            it('should NOT have pending offer details', function () {
                expect(element.find('pending-offer')).not.toBePresent();
            });

            it('should have accepted offer details', function () {
                expect(element.find('accepted-offer')).toBePresent();
            });
        });

        describe('For customer who already have an account', function () {
            beforeEach(function () {
                test.scope.application.status = "EXISTING";
                test.scope.application.reference = "1234567890";
                compileTemplate();
            });

            it('should have product title', function () {
                expect(element.find('h3')[0].innerText).toBe(product.productTitle);
            });

            it('should have product description', function () {
                expect(element.find('p')[0].innerText).toBe(product.productDescription);
            });

            it('should have image source', function () {
                expect(element.find('img')[0].src).toContain(product.imageUrl);
            });

            it('should have image alternative text', function () {
                expect(element.find('img')[0].alt).toContain(product.productTitle);
            });

            it('should NOT have a text notification', function () {
                expect(element.find('.text-notification')).not.toBePresent();
            });

            it('should have an account information section', function () {
                expect(element.find('.account-information')).toBePresent();
                expect(element.find('.account-information label')[0].innerText).toBe(product.accountNumberLabel);
                expect(element.find('.account-information div.row a.account-number')[0].innerText).toBe(product.application.reference);
                expect(element.find('.account-information div.row a.account-number')[0].href).toContain("#/statements/" + product.application.reference);
            });

            it('should NOT have an apply-for-account button', function () {
                expect(element.find('apply-for-account')).not.toBePresent();
            });

            it('should have a link to the product\'s details page which contains a track click for the product', function () {
                expect(element.find('a.btn.secondary')).toBePresent();
            });

            it('should NOT have pending offer details', function () {
                expect(element.find('pending-offer')).not.toBePresent();
            });

            it('should NOT have accepted offer details', function () {
                expect(element.find('accepted-offer')).not.toBePresent();
            });
        });

        describe('Conditional product title', function () {
            var compileTemplateWithConditionalTitle = function () {
                element = test.compileTemplate("<product-tile product-title='{{application.status === \"NEW\" || application.status === \"PENDING\" ? \"" + product.productTitle +
                    "\" : (application.productName || \"" + product.productTitle + "\")}}' product-description='" + product.productDescription + "' product-image-url='" + product.imageUrl +
                    "' product-type='" + product.productType + "' details-page-url='" + product.detailsPageUrl +
                    "' application='application' account-number-label='" + product.accountNumberLabel + "'></product-tile>");
                scope = element.isolateScope();
                scope.$digest();
            };

            it('should use product\'s title when application is new and the application product name is set', function () {
                test.scope.application.status = "NEW";
                test.scope.application.productName = 'some product';
                compileTemplateWithConditionalTitle();
                expect(element.find('h3')[0].innerText).toBe(product.productTitle);
            });

            it('should use product\'s title when application is new and the application product name is NOT set', function () {
                test.scope.application.status = "NEW";
                test.scope.application.productName = undefined;
                compileTemplateWithConditionalTitle();
                expect(element.find('h3')[0].innerText).toBe(product.productTitle);
            });

            it('should use product\'s title when application is pending and the application product name is set', function () {
                test.scope.application.status = "PENDING";
                test.scope.application.productName = 'some product';
                compileTemplateWithConditionalTitle();
                expect(element.find('h3')[0].innerText).toBe(product.productTitle);
            });

            it('should use product\'s title when application is pending and the application product name is NOT set', function () {
                test.scope.application.status = "PENDING";
                test.scope.application.productName = undefined;
                compileTemplateWithConditionalTitle();
                expect(element.find('h3')[0].innerText).toBe(product.productTitle);
            });

            it('should use application\'s product name when application is EXISTING and the application product name is set', function () {
                test.scope.application.status = "EXISTING";
                test.scope.application.productName = 'some product';
                compileTemplateWithConditionalTitle();
                expect(element.find('h3')[0].innerText).toBe(test.scope.application.productName);
            });

            it('should use product\'s title when application is EXISTING and the application product name is NOT set', function () {
                test.scope.application.status = "EXISTING";
                test.scope.application.productName = undefined;
                compileTemplateWithConditionalTitle();
                expect(element.find('h3')[0].innerText).toBe(product.productTitle);
            });

            it('should use application\'s product name when application is ACCEPTED and the application product name is set', function () {
                test.scope.application.status = "ACCEPTED";
                test.scope.application.productName = 'some product';
                compileTemplateWithConditionalTitle();
                expect(element.find('h3')[0].innerText).toBe(test.scope.application.productName);
            });

            it('should use product\'s title when application is ACCEPTED and the application product name is NOT set', function () {
                test.scope.application.status = "ACCEPTED";
                test.scope.application.productName = undefined;
                compileTemplateWithConditionalTitle();
                expect(element.find('h3')[0].innerText).toBe(product.productTitle);
            });
        });

        describe('Continue application', function() {
            beforeEach(function () {
                test.scope.application.status = "PENDING";
                test.scope.continueThisApplication = function () { };
                element = test.compileTemplate("<product-tile product-title='" + product.productTitle +
                    "' product-description='" + product.productDescription + "' product-image-url='" + product.imageUrl +
                    "' product-type='" + product.productType + "' details-page-url='" + product.detailsPageUrl +
                    "' application='application' account-number-label='" + product.accountNumberLabel +
                    "' continue-application='continueThisApplication()'></product-tile>");
                scope = element.isolateScope();
                scope.$digest();
            });

            it('should call the continue application function bound to it', function() {
                expect(element.find("pending-offer")[0].attributes['view-offer'].value).toBe("continueApplication()");
            });
        });
    });
});