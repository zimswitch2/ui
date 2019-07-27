describe('AcceptedOfferResponseParser', function () {
    'use strict';

    var AcceptedOfferResponseParser;

    beforeEach(module('refresh.accountOrigination.currentAccount.domain.acceptedOfferResponseParser'));

    beforeEach(inject(function (_AcceptedOfferResponseParser_) {
        AcceptedOfferResponseParser = _AcceptedOfferResponseParser_;
    }));

    describe('chequeCard crosssell', function () {

        it('should return readable product names', function () {
            expect(AcceptedOfferResponseParser.format({
                timestamp: "2014-08-13T09:08:40.424+02:00",
                accountNumber: 32569017000,
                crossSell: {
                    applicationNumber: "SATMSYST 20141024124610002",
                    offerDetails: [{
                        approved: true,
                        productFamily: "DEBIT CARD",
                        productDetails: [{
                            name: "MASTERCARD UNEMBOSSED CHEQUE CARD",
                            number: 1099
                        }, {
                            name: "SBSA GOLD CHEQUE CARD",
                            number: 1489
                        }, {
                            name: "SBSA TITANIUM CHEQUE CARD",
                            number: 4251
                        }, {
                            name: "PRESTIGE ONE ACCOUNT TITANIUM CHEQUE CARD",
                            number: 4256
                        }, {
                            "name": "SBSA VISA GOLD CHEQUE CARD",
                            "number": 4295
                        }]
                    }]
                }
            })).toEqual({
                timestamp: "2014-08-13T09:08:40.424+02:00",
                accountNumber: 32569017000,
                crossSell: {
                    applicationNumber: "SATMSYST 20141024124610002",
                    offerDetails: [{
                        approved: true,
                        productFamily: "DEBIT CARD",
                        productDetails: [{
                            name: "MasterCard Blue Cheque Card",
                            number: 1099
                        }, {
                            name: "MasterCard Gold Cheque Card",
                            number: 1489
                        }, {
                            name: "MasterCard Titanium Cheque Card",
                            number: 4251
                        }, {
                            name: "MasterCard Titanium Cheque Card",
                            number: 4256
                        }, {
                            name: "Visa Gold Cheque Card",
                            number: 4295
                        }],
                        productImage: 'assets/images/Prestige.jpg'
                    }]
                }
            });
        });

        it('should filter products that are not cheque cards', function () {
            expect(AcceptedOfferResponseParser.format({
                timestamp: '2014-08-13T09:08:40.424+02:00',
                accountNumber: 32569017000,
                crossSell: {
                    applicationNumber: 'SATMSYST 20141024124610002',
                    offerDetails: [
                        {
                            approved: true,
                            productFamily: 'CREDIT CARD',
                            productDetails: [
                                {
                                    name: 'STD BANK MASTERCARD GOLD CREDIT CARD',
                                    number: 2233
                                },
                                {
                                    name: 'STANDARD BANK VISA GOLD CREDIT',
                                    number: 3344
                                }
                            ]
                        },
                        {
                            approved: true,
                            productFamily: 'DEBIT CARD',
                            productDetails: [
                                {
                                    name: 'SBSA GOLD CHEQUE CARDD',
                                    number: 1489
                                },
                                {
                                    name: 'SBSA VISA GOLD CHEQUE CARD',
                                    number: 4295
                                },
                                {
                                    name: 'SBSA VISA GOLD CHEQUE CARD',
                                    number: 4296
                                },
                                {
                                    name: 'VISA ONYX ONE ACCOUNT CHEQUE CARD',
                                    number: 2065
                                }
                            ]
                        }
                    ]
                }
            })).toEqual({
                timestamp: '2014-08-13T09:08:40.424+02:00',
                accountNumber: 32569017000,
                crossSell: {
                    applicationNumber: 'SATMSYST 20141024124610002',
                    offerDetails: [
                        {
                            approved: true,
                            productFamily: 'DEBIT CARD',
                            productDetails: [
                                {
                                    name: 'MasterCard Gold Cheque Card',
                                    number: 1489
                                },
                                {
                                    name: 'Visa Gold Cheque Card',
                                    number: 4295
                                }],
                            productImage: 'assets/images/Elite_MasterCard_Visa.jpg'
                        }
                    ]
                }
            });
        });

        it('should not return offerDetails when there are no valid products', function () {
            expect(AcceptedOfferResponseParser.format({
                timestamp: '2014-08-13T09:08:40.424+02:00',
                accountNumber: 32569017000,
                crossSell: {
                    applicationNumber: 'SATMSYST 20141024124610002',
                    offerDetails: [
                        {
                            approved: true,
                            productFamily: 'DEBIT CARD',
                            productDetails: [
                                {
                                    name: 'SBSA VISA GOLD CHEQUE CARD',
                                    number: 4296
                                },
                                {
                                    name: 'VISA ONYX ONE ACCOUNT CHEQUE CARD',
                                    number: 2065
                                }
                            ]
                        }
                    ]
                }
            })).toEqual({
                timestamp: '2014-08-13T09:08:40.424+02:00',
                accountNumber: 32569017000,
                crossSell: {
                    applicationNumber: 'SATMSYST 20141024124610002',
                    offerDetails: []
                }
            });
        });

        describe('with product image', function () {
            it('should return Mastercard product image', function () {
                expect(AcceptedOfferResponseParser.format({
                    timestamp: "2014-08-13T09:08:40.424+02:00",
                    accountNumber: 32569017000,
                    crossSell: {
                        applicationNumber: "SATMSYST 20141024124610002",
                        offerDetails: [{
                            approved: true,
                            productFamily: "DEBIT CARD",
                            productDetails: [{
                                name: "MASTERCARD UNEMBOSSED CHEQUE CARD",
                                number: 1099
                            }]
                        }]
                    }
                })).toEqual({
                    timestamp: "2014-08-13T09:08:40.424+02:00",
                    accountNumber: 32569017000,
                    crossSell: {
                        applicationNumber: "SATMSYST 20141024124610002",
                        offerDetails: [{
                            approved: true,
                            productFamily: "DEBIT CARD",
                            productDetails: [{
                                name: "MasterCard Blue Cheque Card",
                                number: 1099
                            }],
                            productImage: 'assets/images/Elite_MasterCard.jpg'
                        }]
                    }
                });
            });

            it('should return Visa product image', function () {
                expect(AcceptedOfferResponseParser.format({
                    timestamp: "2014-08-13T09:08:40.424+02:00",
                    accountNumber: 32569017000,
                    crossSell: {
                        applicationNumber: "SATMSYST 20141024124610002",
                        offerDetails: [{
                            approved: true,
                            productFamily: "DEBIT CARD",
                            productDetails: [{
                                name: "SBSA VISA GOLD CHEQUE CARD",
                                number: 4295
                            }]
                        }]
                    }
                })).toEqual({
                    timestamp: "2014-08-13T09:08:40.424+02:00",
                    accountNumber: 32569017000,
                    crossSell: {
                        applicationNumber: "SATMSYST 20141024124610002",
                        offerDetails: [{
                            approved: true,
                            productFamily: "DEBIT CARD",
                            productDetails: [{
                                name: "Visa Gold Cheque Card",
                                number: 4295
                            }],
                            productImage: 'assets/images/Elite_Visa.jpg'
                        }]
                    }
                });
            });
        });
    });
});