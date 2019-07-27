describe('Offer', function () {
    'use strict';

    beforeEach(module('refresh.accountOrigination.currentAccount.domain.currentAccountOfferDecorator'));

    describe('prepareForDisplay', function () {
        describe('supported product family', function () {
            beforeEach(inject(function (CurrentAccountOfferDecorator) {
                var offerResponse = {
                    applicationNumber: 'SATMSYST 20140820141510001',
                    offerDetails: [
                        {
                            productFamily: 'ELITE',
                            approved: true,
                            overdraft: {
                                limit: 6000,
                                interestRate: 22.5
                            },
                            productDetails: [
                                {
                                    name: 'ELITE CURRENT ACCOUNT',
                                    number: 132
                                },
                                {
                                    name: 'ELITE PLUS CURRENT ACCOUNT',
                                    number: 645
                                },
                                {
                                    name: 'UNSUPPORTED',
                                    number: 2222
                                }
                            ]
                        }
                    ]
                };

                this.offerForDisplay = CurrentAccountOfferDecorator.prepareForDisplay(offerResponse);
            }));

            it('should include applicationNumber', function () {
                expect(this.offerForDisplay.applicationNumber).toEqual('SATMSYST 20140820141510001');
            });

            it('should include timestamp', function () {
                expect(this.offerForDisplay.timestamp.isSame(moment('2014-08-20'))).toBeTruthy();
            });

            it('should include productFamily with content', inject(function (CurrentAccountProductFamilyContent) {
                expect(this.offerForDisplay.productFamily).toEqual(CurrentAccountProductFamilyContent.for('ELITE'));
            }));

            it('should include overdraft with default amount', function () {
                expect(this.offerForDisplay.overdraft).toEqual({
                    limit: 6000,
                    amount: 0,
                    interestRate: 22.5
                });
            });

            it('should exclude unsupported products', function () {
                expect(this.offerForDisplay.products.length).toEqual(2);
            });

            it('should include supported products with content', function () {
                expect(this.offerForDisplay.products[0]).toEqual({
                    name: 'ELITE',
                    number: 132,
                    fee: 'R 55 minimum monthly fee',
                    partial: 'features/accountorigination/currentaccount/screens/highlights/elite.html',
                    feeStructure: {
                        name: 'Pay as you transact',
                        description: 'Pay for each transaction, and a minimum monthly service fee'
                    }
                });
                expect(this.offerForDisplay.products[1]).toEqual({
                    name: 'ELITE PLUS',
                    number: 645,
                    fee: 'R 95 monthly fee',
                    partial: 'features/accountorigination/currentaccount/screens/highlights/elitePlus.html',
                    feeStructure: {
                        name: 'Fixed monthly fee',
                        description: 'Pay a single monthly management fee for a fixed number of transactions and services'
                    }
                });
            });

            describe('private banking product family', function () {
                it('should exclude non-private banking products', inject(function (CurrentAccountOfferDecorator) {
                    var offerResponse = {
                        applicationNumber: 'SATMSYST 20140820141510001',
                        offerDetails: [
                            {
                                productFamily: 'PRIVATE BANKING - 140',
                                approved: true,
                                overdraft: {
                                    limit: 6000,
                                    interestRate: 22.5
                                },
                                productDetails: [
                                    {
                                        name: "PRIVATE banking PLUS CURRENT ACCOUNT",
                                        number: 644
                                    },
                                    {
                                        name: "PRESTIGE PLUS CURRENT ACCOUNT",
                                        number: 9144
                                    },
                                    {
                                        name: "PRESTIGE CURRENT ACCOUNT",
                                        number: 9181
                                    }
                                ]
                            }
                        ]
                    };

                    this.offerForDisplay = CurrentAccountOfferDecorator.prepareForDisplay(offerResponse);

                    expect(this.offerForDisplay.products.length).toEqual(1);
                    expect(this.offerForDisplay.products[0]).toEqual({
                        name: 'PRIVATE BANKING',
                        number: 644,
                        partial: 'features/accountorigination/currentaccount/screens/highlights/privatePlus.html',
                        fee: 'R 325 monthly fee',
                        feeStructure: {
                            name: 'Fixed monthly fee',
                            description: 'Pay a single monthly management fee for a fixed number of transactions and services'
                        },
                        productFamily: 'PRIVATE BANKING - 140'
                    });
                }));
            });
        });

        describe('unsupported product family', function () {
            beforeEach(inject(function (CurrentAccountOfferDecorator) {
                var offerResponse = {
                    applicationNumber: 'SATMSYST 20140820141510001',
                    offerDetails: [
                        {
                            productFamily: 'UNKNOWN',
                            approved: true,
                            overdraft: {
                                limit: 6000,
                                interestRate: 22.5
                            },
                            productDetails: [
                                {
                                    name: 'ELITE CURRENT ACCOUNT',
                                    number: 132
                                },
                                {
                                    name: 'ELITE PLUS CURRENT ACCOUNT',
                                    number: 645
                                },
                                {
                                    name: 'UNSUPPORTED',
                                    number: 2222
                                }
                            ]
                        }
                    ]
                };

                this.offerForDisplay = CurrentAccountOfferDecorator.prepareForDisplay(offerResponse);
            }));

            it('should set productFamily as falsy', function () {
                expect(this.offerForDisplay.productFamily).toBeFalsy();
            });
        });
    });
});
