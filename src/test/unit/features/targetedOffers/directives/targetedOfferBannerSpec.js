var dynamicTargetOfferTemplates;

describe('Targeted Offer Banner', function () {
    'use strict';

    beforeEach(module('refresh.targetedOffers', 'refresh.test'));

    describe('Directive', function () {
        var test, template, $location, TargetedOffersService, DigitalId, outerScope, directiveScope, mock;
        var defaultTargetedOffer = {
            id: {
                userName: "testing@sb.co.za",
                cardNumber: "5222625263675970",
                productCode: "PCC"
            },
            productName: "Platinum credit card",
            productFamily: "Credit card",
            lift: 0,
            confidence: 0,
            order: 0,
            interestRate: 0,
            qualifyingAmount: 40000,
            productType: 'CREDIT_CARD',
            acceptButtonText: 'Call me back',
            dcsProductName: 'CREDIT CARD',
            acceptUrl: '/targetedoffers/callmeback/PCC'
        };
        var defaultTemplate = {
            subject: 'Do you want a {{offer.productName}}?',
            body: '<h1>{{offer.productName}} Offer content</h1>'
        };

        describe('When dynamic targeted offer banner is toggled off', function () {

            beforeEach(function () {
                dynamicTargetOfferTemplates = false;
            });
            describe('When setting the subject of an offer', function () {
                beforeEach(inject(function (_TemplateTest_, _$location_, _TargetedOffersService_, _DigitalId_, _mock_) {
                    mock = _mock_;

                    $location = _$location_;
                    TargetedOffersService = _TargetedOffersService_;
                    DigitalId = _DigitalId_;
                    spyOn(TargetedOffersService, 'getOffer').and.returnValue(mock.resolve(defaultTargetedOffer));
                    spyOn(TargetedOffersService, 'getTemplate').and.returnValue(mock.resolve(defaultTemplate));
                    test = _TemplateTest_;
                    test.allowTemplate('features/targetedOffers/directives/partials/targetedOfferBanner.html');
                    outerScope = test.scope;
                    outerScope.bannerTemplate = "";
                }));
                describe('when preferred name is available', function () {
                    beforeEach(function () {
                        spyOn(DigitalId, 'current').and.returnValue({preferredName: 'Test Name'});
                        template = test.compileTemplate('<targeted-offer-banner template-name-suffix="LARGE"></targeted-offer-banner>', true);
                        directiveScope = template.isolateScope();
                    });
                    it('should include preferred name when preferred name is available', function () {
                        mock.resolve();
                        expect(template.html()).toContain('Test Name');
                    });

                    it('should format subject text to include a comma and lower case first letter of subject', function () {
                        mock.resolve();
                        expect(template.html()).toContain(', do you want a ' + defaultTargetedOffer.productName + '?');
                    });
                });

                describe('when preferred name is not available', function () {

                    it('should show subject text without preferred name', function () {
                        spyOn(DigitalId, 'current').and.returnValue({preferredName: undefined});
                        template = test.compileTemplate('<targeted-offer-banner template-name-suffix="LARGE"></targeted-offer-banner>', true);
                        mock.resolve();
                        expect(template.html()).toContain('Do you want a ' + defaultTargetedOffer.productName + '?');
                    });
                });
            });

            describe('When a call me back offer is provided', function () {
                beforeEach(inject(function (_TemplateTest_, _$location_, _TargetedOffersService_, _DigitalId_, _mock_) {
                    mock = _mock_;

                    $location = _$location_;
                    spyOn($location, 'path');
                    TargetedOffersService = _TargetedOffersService_;
                    DigitalId = _DigitalId_;
                    spyOn(TargetedOffersService, 'getOffer').and.returnValue(mock.resolve(defaultTargetedOffer));
                    spyOn(TargetedOffersService, 'getTemplate').and.returnValue(mock.resolve(defaultTemplate));
                    spyOn(TargetedOffersService, 'actionOffer').and.returnValue(mock.resolve());
                    spyOn(DigitalId, 'current').and.returnValue({preferredName: 'Test Name'});
                    test = _TemplateTest_;
                    test.allowTemplate('features/targetedOffers/directives/partials/targetedOfferBanner.html');
                    outerScope = test.scope;
                    outerScope.bannerTemplate = "";
                    template = test.compileTemplate('<targeted-offer-banner template-name-suffix="LARGE"></targeted-offer-banner>', true);
                    directiveScope = template.isolateScope();
                }));

                it('should call TargetedOffersService.getOffer', function () {
                    expect(TargetedOffersService.getOffer).toHaveBeenCalled();
                });

                it('should call TargetedOffersService.getTemplate with the product code in the offer', function () {
                    mock.resolve();
                    expect(TargetedOffersService.getTemplate).toHaveBeenCalledWith(defaultTargetedOffer.mappedProductCode + "_TARGETED_OFFER_LARGE");
                });

                it('should add the \'creditcard\' class to the container element', function () {
                    mock.resolve();
                    expect(template.find('.product').hasClass('creditcard')).toBeTruthy();
                });

                it('should set the html content of the body area to the template body', function () {
                    mock.resolve();
                    expect(template.html()).toContain(defaultTargetedOffer.productName + ' Offer content');
                });

                it('should set the directive scope offer property to the offer returned from from TargetedOffersService', function () {
                    mock.resolve();
                    expect(directiveScope.offer).toBe(defaultTargetedOffer);
                });

                it('should set the directive scope offer property to the offer returned from from TargetedOffersService', function () {
                    mock.resolve();
                    expect(directiveScope.offerAndTemplateExist).toBeTruthy();
                });

                describe('When the user clicks Call me back', function () {
                    beforeEach(function () {
                        template.find('.accept-offer').trigger('click');
                    });

                    it('should call TargetedOffersService.goToOffer with the offer\'s product code', function () {
                        outerScope.$digest();
                        expect($location.path).toHaveBeenCalledWith(defaultTargetedOffer.acceptUrl);
                    });
                });
            });

            describe('When a not now offer is provided', function () {
                beforeEach(inject(function (_TemplateTest_, $compile, _TargetedOffersService_, _mock_) {
                    mock = _mock_;

                    TargetedOffersService = _TargetedOffersService_;
                    spyOn(TargetedOffersService, 'getOffer').and.returnValue(mock.resolve(defaultTargetedOffer));
                    spyOn(TargetedOffersService, 'getTemplate').and.returnValue(mock.resolve(defaultTemplate));
                    spyOn(TargetedOffersService, 'actionOffer').and.returnValue(mock.resolve());

                    test = _TemplateTest_;
                    test.allowTemplate('features/targetedOffers/directives/partials/targetedOfferBanner.html');

                    outerScope = test.scope;
                    outerScope.bannerTemplate = "";
                    template = test.compileTemplate('<targeted-offer-banner template-name-suffix="LARGE"></targeted-offer-banner>', true);
                    directiveScope = template.isolateScope();
                }));
            });

            describe('When a offer is provided that isn\'t a call me back offer', function () {
                beforeEach(inject(function (_TemplateTest_, $compile, _$location_, _TargetedOffersService_, _DigitalId_, _mock_) {
                    mock = _mock_;

                    $location = _$location_;
                    spyOn($location, 'path');
                    TargetedOffersService = _TargetedOffersService_;
                    DigitalId = _DigitalId_;
                    spyOn(TargetedOffersService, 'getOffer').and.returnValue(mock.resolve(defaultTargetedOffer));
                    spyOn(TargetedOffersService, 'getTemplate').and.returnValue(mock.resolve(defaultTemplate));
                    spyOn(TargetedOffersService, 'actionOffer').and.returnValue(mock.resolve());
                    spyOn(DigitalId, 'current').and.returnValue({preferredName: 'Test Name'});

                    test = _TemplateTest_;
                    test.allowTemplate('features/targetedOffers/directives/partials/targetedOfferBanner.html');
                    outerScope = test.scope;
                    outerScope.bannerTemplate = "";
                    template = test.compileTemplate('<targeted-offer-banner></targeted-offer-banner>', true);
                    directiveScope = template.isolateScope();
                }));

                describe('When the user clicks Accept offer', function () {
                    beforeEach(function () {
                        template.find('.accept-offer').trigger('click');
                    });

                    it('should call TargetedOffersService.goToOffer with the offer\'s product code', function () {
                        outerScope.$digest();
                        expect($location.path).toHaveBeenCalledWith(defaultTargetedOffer.acceptUrl);
                    });
                });
            });

            describe('When the user declines the offer', function () {
                beforeEach(inject(function (_TemplateTest_, $compile, _TargetedOffersService_, _DigitalId_, _mock_) {
                    mock = _mock_;

                    TargetedOffersService = _TargetedOffersService_;
                    DigitalId = _DigitalId_;
                    spyOn(TargetedOffersService, 'getOffer').and.returnValue(mock.resolve(defaultTargetedOffer));
                    spyOn(TargetedOffersService, 'getTemplate').and.returnValue(mock.resolve(defaultTemplate));
                    spyOn(TargetedOffersService, 'actionOffer').and.returnValue(mock.resolve());
                    spyOn(DigitalId, 'current').and.returnValue({preferredName: 'Test Name'});
                    test = _TemplateTest_;
                    test.allowTemplate('features/targetedOffers/directives/partials/targetedOfferBanner.html');
                    outerScope = test.scope;
                    outerScope.bannerTemplate = "";
                    template = test.compileTemplate('<targeted-offer-banner></targeted-offer-banner>', true);
                    directiveScope = template.isolateScope();

                    template.find('.decline-offer').trigger('click');
                }));

                it('should call TargetedOffersService.actionOffer with the product code and \'Not now\' as the action', function () {
                    expect(TargetedOffersService.actionOffer).toHaveBeenCalledWith('No thanks');
                });

                it('should add closing class when clicked', function () {
                    outerScope.$digest();
                    expect(directiveScope.offerAndTemplateExist).toBeFalsy();
                    expect(template.hasClass('closing')).toBeTruthy();
                });
            });

            describe('When a blank offer is provided', function () {
                beforeEach(inject(function (_TemplateTest_, $compile, _TargetedOffersService_, _mock_) {
                    mock = _mock_;

                    TargetedOffersService = _TargetedOffersService_;
                    spyOn(TargetedOffersService, 'getOffer').and.returnValue(mock.resolve({}));

                    test = _TemplateTest_;
                    test.allowTemplate('features/targetedOffers/directives/partials/targetedOfferBanner.html');
                    outerScope = test.scope;
                    outerScope.bannerTemplate = "";
                    template = test.compileTemplate('<targeted-offer-banner></targeted-offer-banner>', true);
                    directiveScope = template.isolateScope();
                }));

                it('should not display anything', function () {
                    expect(directiveScope.offerAndTemplateExist).toBeFalsy();
                    expect(template.hasClass('ng-hide')).toBeTruthy();
                });
            });

            describe('When NO offer is provided', function () {
                beforeEach(inject(function (_TemplateTest_, $compile, _TargetedOffersService_, _mock_) {
                    mock = _mock_;

                    TargetedOffersService = _TargetedOffersService_;
                    spyOn(TargetedOffersService, 'getOffer').and.returnValue(mock.reject({}));

                    test = _TemplateTest_;
                    test.allowTemplate('features/targetedOffers/directives/partials/targetedOfferBanner.html');
                    outerScope = test.scope;
                    outerScope.bannerTemplate = "";
                    template = test.compileTemplate('<targeted-offer-banner></targeted-offer-banner>', true);
                    directiveScope = template.isolateScope();
                }));

                it('should not display anything', function () {
                    mock.resolve();
                    expect(directiveScope.offerAndTemplateExist).toBeFalsy();
                    expect(template.hasClass('ng-hide')).toBeTruthy();
                });
            });

            describe('When NO template is provided', function () {
                beforeEach(inject(function (_TemplateTest_, $compile, _TargetedOffersService_, _mock_) {
                    mock = _mock_;

                    TargetedOffersService = _TargetedOffersService_;
                    spyOn(TargetedOffersService, 'getOffer').and.returnValue(mock.resolve(defaultTargetedOffer));
                    spyOn(TargetedOffersService, 'getTemplate').and.returnValue(mock.reject({}));

                    test = _TemplateTest_;
                    test.allowTemplate('features/targetedOffers/directives/partials/targetedOfferBanner.html');
                    outerScope = test.scope;
                    outerScope.bannerTemplate = "";
                    template = test.compileTemplate('<targeted-offer-banner></targeted-offer-banner>', true);
                    directiveScope = template.isolateScope();
                }));

                it('should not display anything', function () {
                    mock.resolve();
                    expect(directiveScope.offerAndTemplateExist).toBeFalsy();
                    expect(template.hasClass('ng-hide')).toBeTruthy();
                });
            });
        });

        describe('When dynamic targeted offer banner is toggled on', function () {
            var getOfferSpy;
            var mock;
            var template;
            var directiveScope;
            var dynamicTemplateMock = {
                offer: {
                    id: {
                        userName: "testing@sb.co.za",
                        cardNumber: "5222625263675970",
                        productCode: "PCC"
                    },
                    productName: "Platinum credit card",
                    productFamily: "Credit card",
                    lift: 0,
                    confidence: 0,
                    order: 0,
                    interestRate: 0,
                    qualifyingAmount: 40000,
                    productType: 'CREDIT_CARD',
                    acceptButtonText: 'Call me back',
                    dcsProductName: 'CREDIT CARD',
                    acceptUrl: '/targetedoffers/callmeback/PCC',
                    templateUrl: 'features/targetedOffers/directives/partials/currentAndCreditTemplate.html'
                },
                templateData:{
                    productCode: "PCC",
                    qualifyingAmountText: 'Dummy Qualifying Amount Text',
                    description: 'Dummy Description',
                    value: "12345678",
                    pdfLink: 'http://localhost:8080/Test.pdf'
                }
            };

            beforeEach(inject(function (_TemplateTest_) {
                dynamicTargetOfferTemplates = true;
                test = _TemplateTest_;
                test.allowTemplate('features/targetedOffers/directives/partials/targetedOfferBanner.html');
                test.allowTemplate('features/targetedOffers/directives/partials/currentAndCreditTemplate.html');

            }));

            describe('When an offer is returned', function () {

                beforeEach(inject(function (_TargetedOffersService_, _mock_, _DigitalId_) {
                    mock = _mock_;
                    TargetedOffersService = _TargetedOffersService_;
                    DigitalId = _DigitalId_;
                    spyOn(DigitalId, 'current').and.returnValue({preferredName: 'Test Name'});
                    getOfferSpy = spyOn(TargetedOffersService, 'getOfferForDynamicTemplate').and.returnValue(mock.resolve(dynamicTemplateMock));
                    template = test.compileTemplate('<targeted-offer-banner template-name-suffix="LARGE"></targeted-offer-banner>', true);
                    directiveScope = template.isolateScope();
                }));

                it('should not call getOffer on TargetedOfferService', function () {
                    expect(getOfferSpy).toHaveBeenCalled();
                });

                it('should use pdf link from getOfferForDynamicTemplate service', function () {
                    expect(template.html()).toContain(dynamicTemplateMock.templateData.pdfLink);
                });

                it('should use qualifying description from getOfferForDynamicTemplate service', function () {
                    expect(template.html()).toContain(dynamicTemplateMock.templateData.description);
                });

                it('should use qualifying amount text from getOfferForDynamicTemplate service', function () {
                    expect(template.html()).toContain(dynamicTemplateMock.templateData.qualifyingAmountText);
                });

                it('should use value from getOfferForDynamicTemplate service', function () {
                    expect(template.html()).toContain(dynamicTemplateMock.templateData.value);
                });

                it('should use correct product class from getOfferForDynamicTemplate service', function () {
                    expect(template.find('.product').hasClass('creditcard')).toBeTruthy();
                });

                it('should show template when offer is return', function () {
                    expect(directiveScope.offerAndTemplateExist).toBeTruthy();
                });
            });

            describe('When no offer is returned', function () {
                beforeEach(inject(function (_TargetedOffersService_, _mock_) {
                    mock = _mock_;
                    TargetedOffersService = _TargetedOffersService_;
                    getOfferSpy = spyOn(TargetedOffersService, 'getOfferForDynamicTemplate').and.returnValue(mock.resolve(undefined));
                    template = test.compileTemplate('<targeted-offer-banner template-name-suffix="LARGE"></targeted-offer-banner>', true);
                    directiveScope = template.isolateScope();
                }));

                it('should show template when offer is return', function () {
                    expect(directiveScope.offerAndTemplateExist).toBeFalsy();
                });
            });

            describe('When service call returns error', function () {
                beforeEach(inject(function (_TargetedOffersService_, _mock_) {
                    mock = _mock_;
                    TargetedOffersService = _TargetedOffersService_;
                    getOfferSpy = spyOn(TargetedOffersService, 'getOfferForDynamicTemplate').and.returnValue(mock.reject());
                    template = test.compileTemplate('<targeted-offer-banner template-name-suffix="LARGE"></targeted-offer-banner>', true);
                    directiveScope = template.isolateScope();
                }));

                it('should show template when offer is return', function () {
                    expect(directiveScope.offerAndTemplateExist).toBeFalsy();
                });
            });


        });
    });
});