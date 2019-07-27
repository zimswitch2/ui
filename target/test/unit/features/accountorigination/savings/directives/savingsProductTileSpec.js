using([{productTitle: 'PureSave', productDescription: 'Simple savings with instant access to your money',
    imageUrl: 'assets/images/PureSave.jpg', productType: 'pure-save', detailsPageUrl: '/apply/puresave' },
    {productTitle: 'MarketLink', productDescription: 'An investment account with the flexibility of a current account',
        imageUrl: 'assets/images/MarketLink.jpg', productType: 'market-link', detailsPageUrl: '/apply/marketlink' },
    {productTitle: 'Tax-Free Call Account', productDescription: 'Save up to R 30 000 a year -- tax free',
        imageUrl: 'assets/images/TaxFreeCallAccount.jpg', productType: 'tax-free-call-account', detailsPageUrl: '/apply/taxfreecallaccount' }], function (product) {
    describe('Savings Product Tile', function () {
        'use strict';

        beforeEach(module('refresh.accountOrigination.savings.directives.savingsProductTile'));

        var test, element, scope;
        beforeEach(inject(function (_TemplateTest_) {
            test = _TemplateTest_;
            test.allowTemplate('features/accountorigination/common/directives/partials/applyForAccount.html');
            test.allowTemplate('features/accountorigination/savings/directives/partials/savingsPrescreening.html');
            test.allowTemplate('features/accountorigination/savings/directives/partials/savingsProductTile.html');

            element = test.compileTemplate("<savings-product-tile product-title='" + product.productTitle +
                "' product-description='" + product.productDescription + "' product-image-url='" + product.imageUrl +
                "' product-type='" + product.productType + "' details-page-url='" + product.detailsPageUrl +
                "'></savings-product-tile>");
            scope = element.isolateScope();

            scope.$digest();

        }));

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

        it('should have a savings-prescreening button for the product type', function () {
            expect(element.find('savings-prescreening')[0].attributes['product-type'].value).toBe(product.productType);
        });

        it('should have a link to the product\'s details page which contains a track click for the product', function () {
            expect(element.find('a')[0].href).toContain("#" + product.detailsPageUrl);
            expect(element.find('a')[0].attributes['data-dtmtext'].value).toBe(product.productTitle + " details button click");
        });
    });
});