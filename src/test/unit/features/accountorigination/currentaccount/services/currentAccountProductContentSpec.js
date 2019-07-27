describe('AO Content', function () {
    'use strict';

    beforeEach(module('refresh.accountOrigination.currentAccount.domain.currentAccountProductContent'));

    describe('CurrentAccountProductContent', function () {
        beforeEach(inject(function (CurrentAccountProductContent) {
            this.ProductContent = CurrentAccountProductContent;
        }));

        it('should know the content for consolidator', function () {
            expect(this.ProductContent[9143].fee).toEqual('No minimum monthly service fees');
            expect(this.ProductContent[9143].partial).toEqual('features/accountorigination/currentaccount/screens/highlights/consolidator.html');
            expect(this.ProductContent[9143].feeStructure).toEqual({
                name: 'Pay as you transact',
                description: 'Pay for each transaction, and a minimum monthly service fee'
            });
        });

        it('should know the content for consolidator plus', function () {
            expect(this.ProductContent[642].fee).toEqual('R 45 monthly fee');
            expect(this.ProductContent[642].partial).toEqual('features/accountorigination/currentaccount/screens/highlights/consolidatorPlus.html');
            expect(this.ProductContent[642].feeStructure).toEqual({
                name: 'Fixed monthly fee',
                description: 'Pay a single monthly management fee for a fixed number of transactions and services'
            });
        });

        using([2, 132, 9141], function (productNumber) {
            it('should know the content for elite ' + productNumber, function () {
                expect(this.ProductContent[productNumber].fee).toEqual('R 55 minimum monthly fee');
                expect(this.ProductContent[productNumber].partial).toEqual('features/accountorigination/currentaccount/screens/highlights/elite.html');
                expect(this.ProductContent[productNumber].feeStructure).toEqual({
                    name: 'Pay as you transact',
                    description: 'Pay for each transaction, and a minimum monthly service fee'
                });
            });
        });

        using([641, 643, 645], function (productNumber) {
            it('should know the content for elite plus ' + productNumber, function () {
                expect(this.ProductContent[productNumber].fee).toEqual('R 95 monthly fee');
                expect(this.ProductContent[productNumber].partial).toEqual('features/accountorigination/currentaccount/screens/highlights/elitePlus.html');
                expect(this.ProductContent[productNumber].feeStructure).toEqual({
                    name: 'Fixed monthly fee',
                    description: 'Pay a single monthly management fee for a fixed number of transactions and services'
                });
            });
        });

        it('should know the content for prestige', function () {
            expect(this.ProductContent[9181].fee).toEqual('R 94 minimum monthly fee');
            expect(this.ProductContent[9181].partial).toEqual('features/accountorigination/currentaccount/screens/highlights/prestige.html');
            expect(this.ProductContent[9181].feeStructure).toEqual({
                name: 'Pay as you transact',
                description: 'Pay for each transaction, and a minimum monthly service fee'
            });
        });

        it('should know the content for prestige plus', function () {
            expect(this.ProductContent[9144].fee).toEqual('R 179 monthly fee');
            expect(this.ProductContent[9144].partial).toEqual('features/accountorigination/currentaccount/screens/highlights/prestigePlus.html');
            expect(this.ProductContent[9144].feeStructure).toEqual({
                name: 'Fixed monthly fee',
                description: 'Pay a single monthly management fee for a fixed number of transactions and services'
            });
        });


        it('should know the content for private', function () {
            expect(this.ProductContent[644].fee).toEqual('R 325 monthly fee');
            expect(this.ProductContent[644].partial).toEqual('features/accountorigination/currentaccount/screens/highlights/privatePlus.html');
            expect(this.ProductContent[644].feeStructure).toEqual({
                name: 'Fixed monthly fee',
                description: 'Pay a single monthly management fee for a fixed number of transactions and services'
            });
        });

        it('should know the content for staff consolidator', function () {
            expect(this.ProductContent[153].fee).toBeUndefined();
            expect(this.ProductContent[153].partial).toEqual('features/accountorigination/currentaccount/screens/highlights/consolidator.html');
            expect(this.ProductContent[153].feeStructure).toEqual({
                name: 'Pay as you transact',
                description: 'Pay for each transaction, and a minimum monthly service fee'
            });
        });

        it('should know the content for staff consolidator plus', function () {
            expect(this.ProductContent[652].fee).toBeUndefined();
            expect(this.ProductContent[652].partial).toEqual('features/accountorigination/currentaccount/screens/highlights/consolidatorPlus.html');
            expect(this.ProductContent[652].feeStructure).toEqual({
                name: 'Fixed monthly fee',
                description: 'Pay a single monthly management fee for a fixed number of transactions and services'
            });
        });

        using([151, 157, 229], function (productNumber) {
            it('should know the content for staff elite ' + productNumber, function () {
                expect(this.ProductContent[productNumber].fee).toBeUndefined();
                expect(this.ProductContent[productNumber].partial).toEqual('features/accountorigination/currentaccount/screens/highlights/elite.html');
                expect(this.ProductContent[productNumber].feeStructure).toEqual({
                    name: 'Pay as you transact',
                    description: 'Pay for each transaction, and a minimum monthly service fee'
                });
            });
        });

        using([647, 650, 651], function (productNumber) {
            it('should know the content for staff elite plus ' + productNumber, function () {
                expect(this.ProductContent[productNumber].fee).toBeUndefined();
                expect(this.ProductContent[productNumber].partial).toEqual('features/accountorigination/currentaccount/screens/highlights/elitePlus.html');
                expect(this.ProductContent[productNumber].feeStructure).toEqual({
                    name: 'Fixed monthly fee',
                    description: 'Pay a single monthly management fee for a fixed number of transactions and services'
                });
            });
        });

        it('should know the content for staff prestige plus', function () {
            expect(this.ProductContent[155].fee).toBeUndefined();
            expect(this.ProductContent[155].partial).toEqual('features/accountorigination/currentaccount/screens/highlights/prestigePlus.html');
            expect(this.ProductContent[155].feeStructure).toEqual({
                name: 'Fixed monthly fee',
                description: 'Pay a single monthly management fee for a fixed number of transactions and services'
            });
        });

        it('should know the content for staff private', function () {
            expect(this.ProductContent[648].fee).toBeUndefined();
            expect(this.ProductContent[648].partial).toEqual('features/accountorigination/currentaccount/screens/highlights/privatePlus.html');
            expect(this.ProductContent[648].feeStructure).toEqual({
                name: 'Fixed monthly fee',
                description: 'Pay a single monthly management fee for a fixed number of transactions and services'
            });
        });
    });

    describe('ProductFamilyContent', function () {
        beforeEach(inject(function (_CurrentAccountProductFamilyContent_) {
            this.ProductFamilyContent = _CurrentAccountProductFamilyContent_;
            this.verifyAllAttributes = function (productFamily, id) {
                expect(productFamily.id).toMatch(id);
                expect(productFamily.name).toMatch(id);
                expect(productFamily.description).toBeUndefined();
                expect(productFamily.imageUrl).toBeDefined();
                expect(productFamily.tagLine).toBeDefined();
                expect(productFamily.partial).toBeDefined();
            };
        }));

        it('should return content for Prestige Banking product family', function () {
            var productFamily = this.ProductFamilyContent.for('PRESTIGE');
            this.verifyAllAttributes(productFamily, /prestige/i);
        });

        it('should return content for Elite Banking product family', function () {
            var productFamily = this.ProductFamilyContent.for('ELITE');
            this.verifyAllAttributes(productFamily, /elite/i);
        });

        it('should return content for Consolidator Banking product family', function () {
            var productFamily = this.ProductFamilyContent.for('CONSOLIDATOR');
            this.verifyAllAttributes(productFamily, /consolidator/i);
        });

        it('should return Elite content for Achiever Banking product family', function () {
            var productFamily = this.ProductFamilyContent.for('ACHIEVER');
            this.verifyAllAttributes(productFamily, /elite/i);
        });

        it('should return Elite content for Classic Banking product family', function () {
            var productFamily = this.ProductFamilyContent.for('CLASSIC');
            this.verifyAllAttributes(productFamily, /elite/i);
        });

        it('should return Private content for Private Banking product family', function () {
            var productFamily = this.ProductFamilyContent.for('PRIVATE BANKING - 140');
            this.verifyAllAttributes(productFamily, /private/i);
        });

        it('should return Elite content for Staff Achiever Banking product family', function () {
            var productFamily = this.ProductFamilyContent.for('STAFF ACHIEVER');
            this.verifyAllAttributes(productFamily, /elite/i);
        });

        it('should return Elite content for Staff Classic Banking product family', function () {
            var productFamily = this.ProductFamilyContent.for('STAFF CLASSIC');
            this.verifyAllAttributes(productFamily, /elite/i);
        });

        it('should return Consolidator content for Staff Consolidator Banking product family', function () {
            var productFamily = this.ProductFamilyContent.for('STAFF CONSOLIDATOR');
            this.verifyAllAttributes(productFamily, /consolidator/i);
        });

        it('should return Elite content for Staff Elite Banking product family', function () {
            var productFamily = this.ProductFamilyContent.for('STAFF ELITE');
            this.verifyAllAttributes(productFamily, /elite/i);
        });

        it('should return Prestige content for Staff Prestige Banking product family', function () {
            var productFamily = this.ProductFamilyContent.for('STAFF PRESTIGE');
            this.verifyAllAttributes(productFamily, /prestige/i);
        });

        it('should return Private content for Staff Private Banking product family', function () {
            var productFamily = this.ProductFamilyContent.for('STAFF PRIVATE BANKING - 140');
            this.verifyAllAttributes(productFamily, /private/i);
        });

        it('should return list of products', function () {
            var productIds = _.map(this.ProductFamilyContent.all(), function (element) {
                return element.id;
            });
            expect(productIds).toEqual(['consolidator', 'elite', 'prestige', 'private']);
        });
    });
});
