
var dynamicTargetOfferTemplates;

describe('Targeted Offers Service', function () {
    'use strict';

    beforeEach(module('refresh.targetedOffers.targetedOffersService', 'refresh.card'));

    var TargetedOffersService, test, User, Card, $location;
    var systemPrincipalIdentifier = {
        systemPrincipalIdentifier: {
            systemPrincipalId: '1',
            systemPrincipalKey: 'SBSA_BANKING'
        }
    };
    var customersCard = {
        countryCode: 'ZA',
        number: '1234567890',
        personalFinanceManagementId: 1,
        type: '0'
    };

    beforeEach(inject(function (_TargetedOffersService_, _ServiceTest_, _User_, _Card_, _$location_) {
        TargetedOffersService = _TargetedOffersService_;
        User = _User_;
        spyOn(_User_, 'principal').and.returnValue(systemPrincipalIdentifier);
        Card = _Card_;
        spyOn(Card, 'current').and.returnValue(customersCard);
        $location = _$location_;
        spyOn($location, 'path');
        test = _ServiceTest_;
        test.spyOnEndpoint('targetedOffersGetTemplate');
        test.spyOnEndpoint('targetedOffersGetOffer');
        test.spyOnEndpoint('targetedOffersActionOffer');
        test.spyOnEndpoint('targetedOffersSubmitDetailsToDCS');
        test.spyOnEndpoint('targetedOffersGetOfferWithTemplateData');
    }));

    describe('getOffer', function () {
        describe('all product types', function () {
            var stubResponseData = {
                offer: {
                    id: 1,
                    userName: "testing@sb.co.za",
                    cardNumber: "5222625263675970",
                    productCode: "PCC",
                    productName: "Platinum credit card",
                    productFamily: "Credit card",
                    lift: 0,
                    confidence: 0,
                    order: 0,
                    interestRate: 0,
                    qualifyingAmount: 40000

                }
            };

            beforeEach(function () {
                test.stubResponse('targetedOffersGetOffer', 200, stubResponseData);
            });

            it('should not display service error message', function () {
                TargetedOffersService.getOffer();
                test.resolvePromise();
                expect(test.endpoint('targetedOffersGetOffer')).toHaveBeenCalledWith(jasmine.any(Object), {omitServiceErrorNotification: true});
            });

            describe('when offer exists', function () {
                it('should call targetedOffersGetOffer endpoint with customer\'s card number', function () {
                    TargetedOffersService.getOffer();
                    test.resolvePromise();
                    expect(test.endpoint('targetedOffersGetOffer')).toHaveBeenCalledWith({cardNumber: customersCard.number}, jasmine.any(Object));
                });

                it('should return the offer from the gateway', function () {
                    expect(TargetedOffersService.getOffer()).toBeResolvedWith(jasmine.objectContaining(stubResponseData.offer));
                    test.resolvePromise();
                });

                describe('caching behaviour', function () {
                    it('should NOT call targetedOffersGetOffer endpoint with customer\'s card when an offer for that card is already defined', function () {
                        TargetedOffersService.getOffer();
                        test.resolvePromise();
                        TargetedOffersService.getOffer();
                        test.resolvePromise();
                        expect(test.endpoint('targetedOffersGetOffer').calls.count()).toEqual(1);
                    });
                });
            });

            describe('when no offer exists', function () {
                beforeEach(function () {
                    var noOfferStubData = _.clone(stubResponseData);
                    noOfferStubData.offer = undefined;
                    test.stubResponse('targetedOffersGetOffer', 200, {}, noOfferStubData);
                });

                it('should reject the request with gateway error message', function () {
                    expect(TargetedOffersService.getOffer()).toBeRejectedWith(jasmine.objectContaining(null));
                    test.resolvePromise();
                });
            });

            describe('when a technical error occurs', function () {
                beforeEach(function () {
                    test.stubResponse('targetedOffersGetOffer', 204, {}, {
                        "x-sbg-response-type": "ERROR",
                        "x-sbg-response-code": "9999",
                        "x-sbg-response-message": "This error message came from the gateway"
                    });
                });

                it('should reject the request with generic error message', function () {
                    expect(TargetedOffersService.getOffer()).toBeRejectedWith(jasmine.objectContaining({
                        'message': 'An error has occurred.'
                    }));
                    test.resolvePromise();
                });
            });

            describe('when an unexpected error occurs', function () {
                beforeEach(function () {
                    test.stubResponse('targetedOffersGetOffer', 204, {}, {
                        "x-sbg-response-type": "ERROR",
                        "x-sbg-response-message": "This error message came from the gateway"
                    });
                });

                it('should reject the request with generic error message', function () {
                    expect(TargetedOffersService.getOffer()).toBeRejectedWith(jasmine.objectContaining({
                        'message': 'This error message came from the gateway'
                    }));
                    test.resolvePromise();
                });
            });

            describe('when the gateway rejects the request', function () {
                beforeEach(function () {
                    test.stubRejection('targetedOffersGetOffer', 204, {}, {
                        "x-sbg-response-type": "ERROR",
                        "x-sbg-response-code": "9999",
                        "x-sbg-response-message": "This error message came from the gateway"
                    });
                });

                it('should reject the request with generic error message', function () {
                    expect(TargetedOffersService.getOffer()).toBeRejectedWith(jasmine.objectContaining({
                        'message': 'An error has occurred.'
                    }));
                    test.resolvePromise();
                });
            });
        });

        describe('where offer is a Platinum credit card', function () {
            var stubResponseData = {
                offer: {
                    id: 1,
                    userName: "testing@sb.co.za",
                    cardNumber: "5222625263675970",
                    productCode: "PCC",
                    productName: "Platinum credit card",
                    productFamily: "Credit card",
                    lift: 0,
                    confidence: 0,
                    order: 0,
                    interestRate: 0,
                    qualifyingAmount: 40000
                }
            };

            beforeEach(function () {
                test.stubResponse('targetedOffersGetOffer', 200, stubResponseData);
            });

            it('should set the product type, accept button text, DCS product name and accept URL to the correct values', function () {
                expect(TargetedOffersService.getOffer()).toBeResolvedWith(jasmine.objectContaining({
                    productType: 'CREDIT_CARD',
                    acceptButtonText: 'Call me back',
                    dcsProductName: 'CREDIT CARD',
                    acceptUrl: '/targetedoffers/platinum-credit-card/callmeback'
                }));
                test.resolvePromise();
            });
        });

        describe('where offer is a Private banking current account product', function () {
            var stubResponseData = {
                offer: {
                    id: 1,
                    userName: "testing@sb.co.za",
                    cardNumber: "2010102240670180",
                    productCode: "PRCA",
                    productName: "Private Banking",
                    productFamily: "Current account",
                    lift: 0,
                    confidence: 0,
                    order: 0,
                    interestRate: null,
                    qualifyingAmount: null
                }
            };

            beforeEach(function () {
                test.stubResponse('targetedOffersGetOffer', 200, stubResponseData);
            });

            it('should set the product type, accept button text, DCS product name and accept URL to the correct values', function () {
                expect(TargetedOffersService.getOffer()).toBeResolvedWith(jasmine.objectContaining({
                    productType: 'CURRENT',
                    acceptButtonText: 'Accept offer',
                    dcsProductName: 'CURRENT ACCOUNT',
                    acceptUrl: '/targetedoffers/current-account'
                }));
                test.resolvePromise();
            });
        });

        describe('where offer is for a Graduate and Professional current account', function () {
            var stubResponseData = {
                offer: {
                    id: 1,
                    userName: "testing@sb.co.za",
                    cardNumber: "503616347482457",
                    productCode: "GAP",
                    productName: "Graduate and Professional Banking",
                    productFamily: "Current account",
                    lift: 0,
                    confidence: 0,
                    order: 0,
                    interestRate: null,
                    qualifyingAmount: null
                }
            };

            beforeEach(function () {
                test.stubResponse('targetedOffersGetOffer', 200, stubResponseData);
            });

            it('should set the product type, accept button text, DCS product name and accept URL to the correct values', function () {
                expect(TargetedOffersService.getOffer()).toBeResolvedWith(jasmine.objectContaining({
                    productType: 'CURRENT',
                    acceptButtonText: 'Accept offer',
                    dcsProductName: 'CURRENT ACCOUNT',
                    acceptUrl: '/targetedoffers/current-account'
                }));
                test.resolvePromise();
            });
        });

        describe('where offer is an unknown product', function () {
            var stubResponseData = {
                offer: {
                    id: 1,
                    userName: "testing@sb.co.za",
                    cardNumber: "503616347482457",
                    productCode: "???",
                    productName: "Unknown product",
                    productFamily: "Family",
                    lift: 0,
                    confidence: 0,
                    order: 0,
                    interestRate: null,
                    qualifyingAmount: null
                }
            };

            beforeEach(function () {
                test.stubResponse('targetedOffersGetOffer', 200, stubResponseData);
            });

            it('should set the product type, accept button text, DCS product name and accept URL to the correct values', function () {
                expect(TargetedOffersService.getOffer()).toBeResolvedWith(jasmine.objectContaining({
                    productType: 'CURRENT',
                    acceptButtonText: 'Call me back',
                    dcsProductName: 'IB',
                    acceptUrl: '/targetedoffers/unknown-product/callmeback'
                }));
                test.resolvePromise();
            });
        });

        describe('where offer is an empty object', function () {
            beforeEach(function () {
                test.stubResponse('targetedOffersGetOffer', 200, {});
            });

            it('should set the product type, accept button text, DCS product name and accept URL to the correct values', function () {
                expect(TargetedOffersService.getOffer()).toBeRejectedWith(jasmine.objectContaining({
                    'message': 'No offer could be found.'
                }));
                test.resolvePromise();
            });
        });
    });

    describe('getOfferForDynamicTemplate', function () {

        describe('When offer data returns without recognized product name', function () {

            var offerWithTemplateData;

            var stubResponseData = {
                offer: {
                    id: 1,
                    userName: "testing@sb.co.za",
                    cardNumber: "5222625263675970",
                    productCode: "PCC",
                    productName: "Default Product",
                    productFamily: "Credit card",
                    lift: 0,
                    confidence: 0,
                    order: 0,
                    interestRate: 0,
                    qualifyingAmount: 40000
                },
                templateData: {
                    productCode: "PCC"
                }
            };

            var expectedOfferWithTemplateData = {
                offer: {
                    id: 1,
                    userName: "testing@sb.co.za",
                    cardNumber: "5222625263675970",
                    productCode: "PCC",
                    productName: "Default Product",
                    productType: "CURRENT",
                    productFamily: "Credit card",
                    dcsProductName: "IB",
                    lift: 0,
                    confidence: 0,
                    order: 0,
                    interestRate: 0,
                    qualifyingAmount: 40000

                },
                templateData: {
                    productCode: "PCC",
                    qualifyingAmountText: 'Limit up to ',
                    pdfLink: undefined
                }
            };

            beforeEach(function () {
                test.stubResponse('targetedOffersGetOfferWithTemplateData', 200, stubResponseData);
                offerWithTemplateData = TargetedOffersService.getOfferForDynamicTemplate();
                test.resolvePromise();
            });

            it('should call getOfferForDynamicTemplate endpoint', function () {
                expect(test.endpoint('targetedOffersGetOfferWithTemplateData')).toHaveBeenCalled();
            });

            it('should return object with required properties', function () {
                expect(offerWithTemplateData).toBeResolvedWith(jasmine.objectContaining(expectedOfferWithTemplateData.offerData));
            });
        });

        describe('When offer data returns with recognized product name', function () {

            var offerWithTemplateData;

            var stubResponseData = {
                offer: {
                    id: 1,
                    userName: "testing@sb.co.za",
                    cardNumber: "5222625263675970",
                    productCode: "PCC",
                    productName: "Platinum credit card",
                    productFamily: "Credit card",
                    lift: 0,
                    confidence: 0,
                    order: 0,
                    interestRate: 0,
                    qualifyingAmount: 40000
                },
                templateData: {
                    productCode: "PCC"
                }
            };

            var expectedOfferWithTemplateData = {
                offer: {
                    id: 1,
                    userName: "testing@sb.co.za",
                    cardNumber: "5222625263675970",
                    productCode: "PCC",
                    productName: "Platinum credit card",
                    productType: "CREDIT_CARD",
                    productFamily: "Credit card",
                    dcsProductName: "CREDIT CARD",
                    lift: 0,
                    confidence: 0,
                    order: 0,
                    interestRate: 0,
                    qualifyingAmount: 40000
                },
                templateData: {
                    productCode: "PCC",
                    qualifyingAmountText: 'Limit up to ',
                    pdfLink: undefined
                }
            };

            beforeEach(function () {
                test.stubResponse('targetedOffersGetOfferWithTemplateData', 200, stubResponseData);
                offerWithTemplateData = TargetedOffersService.getOfferForDynamicTemplate();
                test.resolvePromise();
            });

            it('should call getOfferForDynamicTemplate endpoint', function () {
                expect(test.endpoint('targetedOffersGetOfferWithTemplateData')).toHaveBeenCalled();
            });

            it('should return object with required properties', function () {
                expect(offerWithTemplateData).toBeResolvedWith(jasmine.objectContaining(expectedOfferWithTemplateData.offerData));
            });
        });

        describe('When no offer data is returned', function () {

            var offerWithTemplateData;

            var stubResponseData = {};


            beforeEach(function () {
                test.stubResponse('targetedOffersGetOfferWithTemplateData', 200, stubResponseData);
                offerWithTemplateData = TargetedOffersService.getOfferForDynamicTemplate();
                test.resolvePromise();
            });

            it('should call getOfferForDynamicTemplate endpoint', function () {
                expect(test.endpoint('targetedOffersGetOfferWithTemplateData')).toHaveBeenCalled();
            });

            it('should return object with required properties', function () {
                expect(offerWithTemplateData).toBeResolvedWith(jasmine.objectContaining(null));
            });
        });

        describe('When an offer has been cached', function () {

            var stubResponseData = {
                offer: {
                    id: 1,
                    userName: "testing@sb.co.za",
                    cardNumber: "5222625263675970",
                    productCode: "PCC",
                    productName: "Platinum credit card",
                    productFamily: "Credit card",
                    lift: 0,
                    confidence: 0,
                    order: 0,
                    interestRate: 0,
                    qualifyingAmount: 40000
                },
                templateData: {
                    productCode: "PCC"
                }
            };


            var expectedOfferWithTemplateData = {
                offerData: {
                    id: 1,
                    userName: "testing@sb.co.za",
                    cardNumber: "5222625263675970",
                    productCode: "PCC",
                    productName: "Platinum credit card",
                    productType: "CREDIT_CARD",
                    productFamily: "Credit card",
                    dcsProductName: "CREDIT CARD",
                    lift: 0,
                    confidence: 0,
                    order: 0,
                    interestRate: 0,
                    qualifyingAmount: 40000,
                },
                templateData: {
                    productCode: "PCC",
                    qualifyingAmountText: 'Limit up to ',
                    pdfLink: undefined
                }
            };

            beforeEach(function () {
                test.stubResponse('targetedOffersGetOfferWithTemplateData', 200, stubResponseData);
                TargetedOffersService.getOfferForDynamicTemplate();
                test.resolvePromise();
            });

            it('should return cached offer data', function () {
                expect(TargetedOffersService.getOfferForDynamicTemplate()).toBeResolvedWith(jasmine.objectContaining(expectedOfferWithTemplateData.offerData));
            });
        });

        describe('when a technical error occurs', function () {
            beforeEach(function () {
                test.stubResponse('targetedOffersGetOfferWithTemplateData', 204, {}, {
                    "x-sbg-response-type": "ERROR",
                    "x-sbg-response-code": "9999",
                    "x-sbg-response-message": "This error message came from the gateway"
                });
            });

            it('should reject the request with generic error message', function () {
                expect(TargetedOffersService.getOfferForDynamicTemplate()).toBeRejectedWith(jasmine.objectContaining({
                    'message': 'An error has occurred.'
                }));
                test.resolvePromise();
            });
        });

        describe('when an unexpected error occurs', function () {
            beforeEach(function () {
                test.stubResponse('targetedOffersGetOfferWithTemplateData', 204, {}, {
                    "x-sbg-response-type": "ERROR",
                    "x-sbg-response-message": "This error message came from the gateway"
                });
            });

            it('should reject the request with generic error message', function () {
                expect(TargetedOffersService.getOfferForDynamicTemplate()).toBeRejectedWith(jasmine.objectContaining({
                    'message': 'This error message came from the gateway'
                }));
                test.resolvePromise();
            });
        });

        describe('when the gateway rejects the request', function () {
            beforeEach(function () {
                test.stubRejection('targetedOffersGetOfferWithTemplateData', 204, {}, {
                    "x-sbg-response-type": "ERROR",
                    "x-sbg-response-code": "9999",
                    "x-sbg-response-message": "This error message came from the gateway"
                });
            });

            it('should reject the request with generic error message', function () {
                expect(TargetedOffersService.getOfferForDynamicTemplate()).toBeRejectedWith(jasmine.objectContaining({
                    'message': 'An error has occurred.'
                }));
                test.resolvePromise();
            });
        });
    });

    describe('other methods', function () {

        beforeEach(function(){
            dynamicTargetOfferTemplates = false;
        });

        describe('when dynamicTargetOfferTemplates is on', function(){
            beforeEach(function(){
               dynamicTargetOfferTemplates = true;
            });
            var offerThatWasActioned = {
                id: 1,
                userName: "testing@sb.co.za",
                cardNumber: "5222625263675970",
                productCode: "CODE",
                productName: "PRODUCT NAME",
                productFamily: "PRODUCT FAMILY",
                lift: 0,
                confidence: 0,
                order: 0,
                interestRate: 0,
                qualifyingAmount: 40000,
                productType: 'CURRENT',
                acceptButtonText: 'Call me back',
                dcsProductName: 'IB',
                acceptUrl: '/targetedoffers/product-name/callmeback'
            };
            
            var getOfferStubResponse = {
                offer: {
                    id: 1,
                    userName: "testing@sb.co.za",
                    cardNumber: "5222625263675970",
                    productCode: "CODE",
                    productName: "PRODUCT NAME",
                    productFamily: "PRODUCT FAMILY",
                    lift: 0,
                    confidence: 0,
                    order: 0,
                    interestRate: 0,
                    qualifyingAmount: 40000
                },
                templateData: {
                    productCode: "CODE"
                }
            };

            var offerToPost = {
                id: offerThatWasActioned.id,
                userName: offerThatWasActioned.userName,
                cardNumber: offerThatWasActioned.cardNumber,
                productCode: offerThatWasActioned.productCode,
                demographicCustomerNumber: offerThatWasActioned.demographicCustomerNumber,
                channelProfileId: offerThatWasActioned.channelProfileId,
                bpId: offerThatWasActioned.bpId,
                productFamily: offerThatWasActioned.productFamily,
                productName: offerThatWasActioned.productName,
                lift: offerThatWasActioned.lift,
                confidence: offerThatWasActioned.confidence,
                order: offerThatWasActioned.order,
                interestRate: offerThatWasActioned.interestRate,
                qualifyingAmount: offerThatWasActioned.qualifyingAmount,
            };

            beforeEach(function () {
                test.stubResponse('targetedOffersGetOfferWithTemplateData', 200, _.clone(getOfferStubResponse));
                test.stubResponse('targetedOffersActionOffer', 200, {});
                TargetedOffersService.getOfferForDynamicTemplate();
                test.resolvePromise();
                TargetedOffersService.actionOffer("Action taken");
            });

            describe('actionOffer', function(){
                it('should get offer data from offer object',function(){
                    test.resolvePromise();


                    expect(test.endpoint('targetedOffersActionOffer')).toHaveBeenCalledWith({
                        action: 'Action taken',
                        offer: offerToPost
                    });
                });
            });
        });


        describe('actionOffer', function () {
            var offerThatWasActioned = {
                id: 1,
                userName: "testing@sb.co.za",
                cardNumber: "5222625263675970",
                productCode: "CODE",
                productName: "PRODUCT NAME",
                productFamily: "PRODUCT FAMILY",
                lift: 0,
                confidence: 0,
                order: 0,
                interestRate: 0,
                qualifyingAmount: 40000,
                productType: 'CURRENT',
                acceptButtonText: 'Call me back',
                dcsProductName: 'IB',
                acceptUrl: '/targetedoffers/product-name/callmeback'
            };
            var getOfferStubResponse = {
                offer: {
                    id: 1,
                    userName: "testing@sb.co.za",
                    cardNumber: "5222625263675970",
                    productCode: "CODE",
                    productName: "PRODUCT NAME",
                    productFamily: "PRODUCT FAMILY",
                    lift: 0,
                    confidence: 0,
                    order: 0,
                    interestRate: 0,
                    qualifyingAmount: 40000
                }
            };

            var offerToPost = {
                id: offerThatWasActioned.id,
                userName: offerThatWasActioned.userName,
                cardNumber: offerThatWasActioned.cardNumber,
                productCode: offerThatWasActioned.productCode,
                demographicCustomerNumber: offerThatWasActioned.demographicCustomerNumber,
                channelProfileId: offerThatWasActioned.channelProfileId,
                bpId: offerThatWasActioned.bpId,
                productFamily: offerThatWasActioned.productFamily,
                productName: offerThatWasActioned.productName,
                lift: offerThatWasActioned.lift,
                confidence: offerThatWasActioned.confidence,
                order: offerThatWasActioned.order,
                interestRate: offerThatWasActioned.interestRate,
                qualifyingAmount: offerThatWasActioned.qualifyingAmount,
            };

            beforeEach(function () {
                test.stubResponse('targetedOffersGetOffer', 200, _.clone(getOfferStubResponse));
                test.stubResponse('targetedOffersActionOffer', 200, {});
                TargetedOffersService.getOffer();
                test.resolvePromise();
                TargetedOffersService.actionOffer("Action taken");
            });

            it('should call targetedOffersActionOffer endpoint with customer\'s card, product code and action', function () {
                test.resolvePromise();


                expect(test.endpoint('targetedOffersActionOffer')).toHaveBeenCalledWith({
                    action: 'Action taken',
                    offer: offerToPost
                });
            });

            describe('caching behaviour', function () {
                it('should move the offer to the last actioned offer', function () {
                    expect(TargetedOffersService.getLastActionedOffer()).toEqual(offerThatWasActioned);
                });
            });
        });

        describe('getTemplate', function () {
            describe('when template exists', function () {
                var stubResponseData = {
                    "subject": "Hello",
                    "body": "<h1>Hello</h1>"
                };

                beforeEach(function () {
                    test.stubResponse('targetedOffersGetTemplate', 200, stubResponseData);
                });

                it('should call targetedOffersGetTemplate endpoint with product code', function () {
                    TargetedOffersService.getTemplate('TEMPLATE_NAME');
                    test.resolvePromise();
                    expect(test.endpoint('targetedOffersGetTemplate')).toHaveBeenCalledWith({templateName: 'TEMPLATE_NAME'});
                });

                it('should return the template from the gateway', function () {
                    test.resolvePromise();
                    expect(TargetedOffersService.getTemplate()).toBeResolvedWith(stubResponseData.offer);
                });
            });

            describe('when no template exists', function () {
                beforeEach(function () {
                    test.stubResponse('targetedOffersGetTemplate', 204, {}, {
                        "x-sbg-response-type": "ERROR",
                        "x-sbg-response-code": "0000",
                        "x-sbg-response-message": "This error message came from the gateway"
                    });
                });

                it('should reject the request with gateway error message', function () {
                    expect(TargetedOffersService.getTemplate('CODE')).toBeRejectedWith(jasmine.objectContaining({
                        'message': 'This error message came from the gateway'
                    }));
                    test.resolvePromise();
                });
            });

            describe('when an unexpected error occurs', function () {
                beforeEach(function () {
                    test.stubResponse('targetedOffersGetTemplate', 204, {}, {
                        "x-sbg-response-type": "ERROR",
                        "x-sbg-response-code": "9999",
                        "x-sbg-response-message": "This error message came from the gateway"
                    });
                });

                it('should reject the request with generic error message', function () {
                    expect(TargetedOffersService.getTemplate('CODE')).toBeRejectedWith(jasmine.objectContaining({
                        'message': 'An error has occurred.'
                    }));
                    test.resolvePromise();
                });
            });

            describe('when the gateway rejects the request', function () {
                beforeEach(function () {
                    test.stubRejection('targetedOffersGetTemplate', 204, {}, {
                        "x-sbg-response-type": "ERROR",
                        "x-sbg-response-code": "9999",
                        "x-sbg-response-message": "This error message came from the gateway"
                    });
                });

                it('should reject the request with generic error message', function () {
                    expect(TargetedOffersService.getTemplate('CODE')).toBeRejectedWith(jasmine.objectContaining({
                        'message': 'An error has occurred.'
                    }));
                    test.resolvePromise();
                });
            });
        });

        describe('submitDetailsToDCS', function () {
            var getOfferStubResponse = {
                offer: {
                    id: 1,
                    userName: "testing@sb.co.za",
                    cardNumber: "5222625263675970",
                    productCode: "CODE",
                    productName: "PRODUCT NAME",
                    productFamily: "PRODUCT FAMILY",
                    lift: 0,
                    confidence: 0,
                    order: 0,
                    interestRate: 0,
                    qualifyingAmount: 40000
                }
            };

            var offerToPost = {
                id: getOfferStubResponse.offer.id,
                userName: getOfferStubResponse.offer.userName,
                cardNumber: getOfferStubResponse.offer.cardNumber,
                productCode: getOfferStubResponse.offer.productCode,
                demographicCustomerNumber: getOfferStubResponse.offer.demographicCustomerNumber,
                channelProfileId: getOfferStubResponse.offer.channelProfileId,
                bpId: getOfferStubResponse.offer.bpId,
                productFamily: getOfferStubResponse.offer.productFamily,
                productName: getOfferStubResponse.offer.productName,
                lift: getOfferStubResponse.offer.lift,
                confidence: getOfferStubResponse.offer.confidence,
                order: getOfferStubResponse.offer.order,
                interestRate: getOfferStubResponse.offer.interestRate,
                qualifyingAmount: getOfferStubResponse.offer.qualifyingAmount,
                //numberOfLogins: getOfferStubResponse.offer.numberOfLogins
            };
            beforeEach(function () {
                test.stubResponse('targetedOffersGetOffer', 200, getOfferStubResponse);
                test.stubResponse('targetedOffersSubmitDetailsToDCS', 200, {});
                TargetedOffersService.getOffer();
                test.resolvePromise();
            });

            it('should call targetedOffersSubmitDetailsToDCS endpoint without idNumber', function () {
                TargetedOffersService.submitDetailsToDCS('PRODUCT NAME', {
                    contact1: '******5887',
                    contact2: '******2144',
                    fullName: 'Mr Test Testington',
                    idNumber: '8010011234567'
                });
                test.resolvePromise();
                expect(test.endpoint('targetedOffersSubmitDetailsToDCS')).toHaveBeenCalledWith({
                    description: "PRODUCT NAME",
                    contact1: '******5887',
                    contact2: '******2144',
                    fullName: 'Mr Test Testington',
                    systemPrincipalIdentifier: systemPrincipalIdentifier.systemPrincipalIdentifier,
                    offer: offerToPost
                });
            });

            it('should call targetedOffersSubmitDetailsToDCS endpoint with product name customer details', function () {
                TargetedOffersService.submitDetailsToDCS('PRODUCT NAME', {
                    contact1: '******5887',
                    contact2: '******2144',
                    fullName: 'Mr Test Testington'
                });
                test.resolvePromise();
                expect(test.endpoint('targetedOffersSubmitDetailsToDCS')).toHaveBeenCalledWith({
                    description: "PRODUCT NAME",
                    contact1: '******5887',
                    contact2: '******2144',
                    fullName: 'Mr Test Testington',
                    systemPrincipalIdentifier: systemPrincipalIdentifier.systemPrincipalIdentifier,
                    offer: offerToPost
                });
            });
        });
    });

});
