describe('CurrentAccountOffersService', function () {
    beforeEach(function () {
        module('refresh.accountOrigination.currentAccount.services.currentAccountOffersService',
            'refresh.accountOrigination.currentAccount.domain.currentAccountProductContent');
        inject(function (_ServiceTest_, _CurrentAccountOffersService_, User) {
            this.test = _ServiceTest_;
            this.CurrentAccountOffersService = _CurrentAccountOffersService_;

            this.systemPrincipal = {
                systemPrincipalIdentifier: {
                    systemPrincipalId: '1',
                    systemPrincipalKey: 'SBSA_BANKING'
                }
            };

            spyOn(User, 'principal').and.returnValue(this.systemPrincipal);
            this.test.spyOnEndpoint('acceptOffer');
        });
    });

    //get offers
    describe('getOffers', function(){
        beforeEach(inject(function () {
            this.acceptedOfferResponse = {
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
                            }
                        ]
                    }
                ]
            };

            this.test.spyOnEndpoint('currentAccountOffers');
        }));

        describe('success', function () {
            beforeEach(function () {
                this.test.stubResponse('currentAccountOffers', 200, this.acceptedOfferResponse);
            });

            it('should invoke the current account offers endpoint', function () {
                this.CurrentAccountOffersService.getOffers();
                var serviceInput = _.merge(this.systemPrincipal);
                expect(this.test.endpoint('currentAccountOffers')).toHaveBeenCalledWith(serviceInput, {omitServiceErrorNotification: true});
                this.test.resolvePromise();
            });
        });

        describe('failure', function () {
            it('should reject if the call fails', function () {
                this.test.stubResponse('currentAccountOffers', 500, {});
                expect(this.CurrentAccountOffersService.getOffers()).toBeRejected();
                this.test.resolvePromise();
            });
        });

        describe('unsupported offer', function (){
            var offerWithUnsupportedProductFamily = {
                applicationNumber: 'SATMSYST 20140820141510001',
                offerDetails: [
                    {
                        productFamily: '',
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
                            }
                        ]
                    }
                ]
            };

            var offerWithNoProductDetails = {
                applicationNumber: 'SATMSYST 20140820141510001',
                offerDetails: [
                    {
                        productFamily: 'Elite',
                        approved: true,
                        overdraft: {
                            limit: 6000,
                            interestRate: 22.5
                        },
                        productDetails: [
                        ]
                    }
                ]
            };

            it('should reject with unsupported response if product family is empty', function () {

                this.test.stubResponse('currentAccountOffers', 200, offerWithUnsupportedProductFamily);

                expect(this.CurrentAccountOffersService.getOffers()).toBeRejectedWith({
                    reason: 'UNSUPPORTED'
                });
                this.test.resolvePromise();
            });

            it('should reject with unsupported response if products count is zero', function () {

                this.test.stubResponse('currentAccountOffers', 200, offerWithNoProductDetails);

                expect(this.CurrentAccountOffersService.getOffers()).toBeRejectedWith({
                    reason: 'UNSUPPORTED'
                });
                this.test.resolvePromise();
            });

        });


        describe('offer rejected', function () {
            beforeEach(function () {
                var rejectedOfferResponse = {
                    applicationNumber: 'SATMSYST 20140820141510001',
                    offerDetails: [
                        {
                            productFamily: 'ELITE',
                            approved: false
                        }
                    ]
                };
                this.test.stubResponse('currentAccountOffers', 200, rejectedOfferResponse);
            });

            it('should reject with the service response', function () {
                expect(this.CurrentAccountOffersService.getOffers()).toBeRejectedWith({
                    applicationNumber: 'SATMSYST 20140820141510001',
                    reason: 'DECLINED'
                });
                this.test.resolvePromise();
            });
        });
    });

    //get quotation details
    describe('getQuotationDetails', function(){
        beforeEach(inject(function () {
            this.acceptedOfferResponse = {
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
                            }
                        ]
                    }
                ]
            };

            this.test.spyOnEndpoint('currentAccountOffers');
            this.test.spyOnEndpoint('getQuotationDetails');
        }));

        describe('success', function () {
            beforeEach(function () {
                this.test.stubResponse('getQuotationDetails', 200, this.acceptedOfferResponse);
            });

            it('should invoke the get quotation details endpoint', function () {
                this.CurrentAccountOffersService.getQuotationDetails('SATMSYST 20140820141510001');
                var serviceInput = _.merge({applicationNumber: 'SATMSYST 20140820141510001'}, this.systemPrincipal);
                expect(this.test.endpoint('getQuotationDetails')).toHaveBeenCalledWith(serviceInput);
                this.test.resolvePromise();
            });
        });

        describe('failure', function () {
            it('should reject if the call fails', function () {
                this.test.stubResponse('getQuotationDetails', 500, {});
                expect(this.CurrentAccountOffersService.getQuotationDetails('SATMSYST 20140820141510001')).toBeRejected();
                this.test.resolvePromise();
            });
        });

        describe('unsupported offer', function (){
            var offerWithUnsupportedProductFamily = {
                applicationNumber: 'SATMSYST 20140820141510001',
                offerDetails: [
                    {
                        productFamily: '',
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
                            }
                        ]
                    }
                ]
            };

            var offerWithNoProductDetails = {
                applicationNumber: 'SATMSYST 20140820141510001',
                offerDetails: [
                    {
                        productFamily: 'Elite',
                        approved: true,
                        overdraft: {
                            limit: 6000,
                            interestRate: 22.5
                        },
                        productDetails: [
                        ]
                    }
                ]
            };

            it('should reject with unsupported response if product family is empty', function () {

                this.test.stubResponse('getQuotationDetails', 200, offerWithUnsupportedProductFamily);

                expect(this.CurrentAccountOffersService.getQuotationDetails('SATMSYST 20140820141510001')).toBeRejectedWith({
                    reason: 'UNSUPPORTED'
                });
                this.test.resolvePromise();
            });

            it('should reject with unsupported response if products count is zero', function () {

                this.test.stubResponse('getQuotationDetails', 200, offerWithNoProductDetails);

                expect(this.CurrentAccountOffersService.getQuotationDetails('SATMSYST 20140820141510001')).toBeRejectedWith({
                    reason: 'UNSUPPORTED'
                });
                this.test.resolvePromise();
            });

        });


        describe('offer rejected', function () {
            beforeEach(function () {
                var rejectedOfferResponse = {
                    applicationNumber: 'SATMSYST 20140820141510001',
                    offerDetails: [
                        {
                            productFamily: 'ELITE',
                            approved: false
                        }
                    ]
                };
                this.test.stubResponse('getQuotationDetails', 200, rejectedOfferResponse);
            });

            it('should reject with the service response', function () {
                expect(this.CurrentAccountOffersService.getQuotationDetails('SATMSYST 20140820141510001')).toBeRejectedWith({
                    applicationNumber: 'SATMSYST 20140820141510001',
                    reason: 'DECLINED'
                });
                this.test.resolvePromise();
            });
        });
    });

    describe('accept offer', function () {

        beforeEach(function () {
            this.test.stubResponse('acceptOffer', 200, {
                timestamp: '2014-08-13T09:08:40.424+02:00',
                accountNumber: 0
            }, {
                'x-sbg-response-type': 'SUCCESS',
                'x-sbg-response-code': '0000'
            });
        });

        it('should call the endpoint', function () {
            this.CurrentAccountOffersService.accept('SATMSYST 20140820141510001', 123, 2508, undefined);
            expect(this.test.endpoint('acceptOffer')).toHaveBeenCalledWith({
                systemPrincipalIdentifier: {
                    systemPrincipalId: '1',
                    systemPrincipalKey: 'SBSA_BANKING'
                },
                productNumber: 123,
                selectedOffer: 1,
                preferredBranch: 2508,
                applicationNumber: 'SATMSYST 20140820141510001',
                requestedLimit: 0
            });
        });

        describe('with overdraft selected', function () {
            it('should call the endpoint correct with overdraft electronic consents details', function () {
                this.CurrentAccountOffersService.accept('SATMSYST 20140820141510001', 123, 2508, 5000, {
                    statementsConsentSelected: true, statementsConsentBranchCode: '2345',
                    statementsConsentAccountNumber: '123', statementsConsentAccountType: 'current'
                });

                expect(this.test.endpoint('acceptOffer')).toHaveBeenCalledWith({
                    systemPrincipalIdentifier: {
                        systemPrincipalId: '1',
                        systemPrincipalKey: 'SBSA_BANKING'
                    },
                    productNumber: 123,
                    selectedOffer: 1,
                    preferredBranch: 2508,
                    applicationNumber: 'SATMSYST 20140820141510001',
                    requestedLimit: 5000,
                    statementsConsentSelected: true,
                    statementsConsentBranchCode: '2345',
                    statementsConsentAccountNumber: '123',
                    statementsConsentAccountType: 'current'
                });
            });
        });

        it('should resolve with the service response', function () {
            expect(this.CurrentAccountOffersService.accept('SATMSYST 20140820141510001', 123, 2508)).toBeResolvedWith(jasmine.objectContaining({
                timestamp: '2014-08-13T09:08:40.424+02:00',
                accountNumber: 0
            }));
            this.test.resolvePromise();
        });
    });
});
