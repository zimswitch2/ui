describe('RcpOfferService', function () {
    'use strict';

    var test, service, newAccountDetails, debitOrderDetails, systemPrincipal, rcpLoanAgreementRequest;

    beforeEach(module('refresh.accountOrigination.rcp.services.OfferService'));


    beforeEach(inject(function (User, ServiceTest, RcpOfferService) {
        spyOn(User, 'principal');

        systemPrincipal = {
            systemPrincipalIdentifier: {
                systemPrincipalId: '1',
                systemPrincipalKey: 'SBSA_BANKING'
            }
        };

        User.principal.and.returnValue(systemPrincipal);

        test = ServiceTest;

        service = RcpOfferService;

        newAccountDetails = new NewAccountDetails('SATMSYST 20140820141510001', 123, 2508, 6000);
        debitOrderDetails = {
            debitOrderRepaymentAmount: 231.00,
            debitOrderAccountNumber: '282974644',
            debitOrderCycleCode: 113,
            debitOrderElectronicConsentReceived: true,
            debitOrderIbtNumber: 2505
        };

        rcpLoanAgreementRequest = {
            applicationNumber: "SATMSYST 20140820141510001",
            productNumber: 123,
            requestedLimit: 6000
        };
    }));


    it('getPath should be defined ', function () {
        expect(service.getPath()).toEqual('/apply/rcp/offer');
    });

    describe('create rcp offer', function () {
        beforeEach(function () {
            test.spyOnEndpoint('createRcpOffer');
        });

        describe('failure', function () {
	    beforeEach(function(){

            });

            it('should reject if call returns error headers', function () {
                test.stubResponse('createRcpOffer', 500, {}, {'x-sbg-response-code': '8815'});
                //test.stubRejection('createRcpOffer', 200, {"headers": function(headerString) { return '8815';} });
                expect(service.getOffers()).toBeRejectedWith({ 'reason': 'UNSUPPORTED' });
                test.resolvePromise();
            });

            it('should reject if call returns unsupported code in headers', function () {
                test.stubResponse('createRcpOffer', 500, {}, {'x-sbg-response-type': 'ERROR', 'x-sbg-response-code': '8815'});
                expect(service.getOffers()).toBeRejectedWith({ 'reason': 'UNSUPPORTED' });
                test.resolvePromise();
            });

            it('should reject if the call fails', function () {
                test.stubResponse('createRcpOffer', 500, {});
                expect(service.getOffers()).toBeRejected();
                test.resolvePromise();
            });
        });

        describe('reject', function () {
            beforeEach(function () {
                var rejectedOfferResponse = {
                    applicationNumber: 'SATMSYST 20140820141510001',
                    rcpOfferDetails: [{
                        approved: false,
                        message: 'declined reason message'
                    }]
                };
                test.stubResponse('createRcpOffer', 200, rejectedOfferResponse);
            });

            it('should reject with the service response', function () {
                expect(service.getOffers()).toBeRejectedWith({
                    applicationNumber: 'SATMSYST 20140820141510001',
                    reason: 'DECLINED',
                    message: 'declined reason message'
                });
                test.resolvePromise();
            });
        });

        describe("success", function () {
            beforeEach(function () {
                var offer = {
                    applicationNumber: 'SATMSYST 20140820141510001',
                    rcpOfferDetails: [{
                        approved: true,
                        maximumLoanAmount: 120000,
                        interestRate: 21.0,
                        loanTermInMonths: 54,
                        productName: 'RCP',
                        productNumber: 8
                    }]
                };

                test.stubResponse('createRcpOffer', 200, offer);
            });
            it('should invoke the getOffers rcp offers endpoint', function () {
                service.getOffers();
                expect(test.endpoint('createRcpOffer')).toHaveBeenCalledWith(systemPrincipal, { omitServiceErrorNotification: true });
                test.resolvePromise();
            });

            it('should resolve with the service response', function () {
                expect(service.getOffers(newAccountDetails, debitOrderDetails)).toBeResolvedWith({
                    applicationNumber: 'SATMSYST 20140820141510001',
                    rcpOfferDetails: {
                        approved: true,
                        maximumLoanAmount: 120000,
                        interestRate: 21.0,
                        loanTermInMonths: 54,
                        productName: 'RCP',
                        productNumber: 8
                    }
                });
                test.resolvePromise();
            });
        });
    });

    describe('getPreAgreementHtml', function () {
        beforeEach(function () {
            test.spyOnEndpoint('getPreAgreementHtml');
        });

        describe('success', function () {
            beforeEach(function () {
                test.stubResponse('getPreAgreementHtml', 200, '<html>Pre Agreement</html>');
            });

            it('should call endpoint with offer details and user principal', function () {
                service.getPreAgreementHtml({
                    applicationNumber: '1234',
                    productNumber: 8,
                    requestedLimit: 120000
                });
                expect(test.endpoint('getPreAgreementHtml')).toHaveBeenCalledWith({
                    systemPrincipalIdentifier: {
                        systemPrincipalId: '1',
                        systemPrincipalKey: 'SBSA_BANKING'
                    },
                    applicationNumber: '1234',
                    productNumber: 8,
                    requestedLimit: 120000
                });
            });

            it('should resolve with service response', function () {
                expect(service.getPreAgreementHtml()).toBeResolvedWith('<html>Pre Agreement</html>');
                test.resolvePromise();
            });
        });

        describe('failure', function () {
            it('should resolve with service response', function () {
                test.stubResponse('getPreAgreementHtml', 500, {}, {'x-sbg-response-code': '8888'});
                expect(service.getPreAgreementHtml()).toBeRejected();
                test.resolvePromise();
            });
        });
    });

    describe('accept Rcp offer', function () {

        beforeEach(function () {
            test.spyOnEndpoint('acceptRcpOffer');
        });

        describe('success', function () {
            beforeEach(function () {
                var acceptedOffer = {
                    timestamp: '2014-08-13T09:08:40.424+02:00',
                    accountNumber: 0,
                    maximumDebitOrderRepaymentAmount: 5000.20

                };
                test.stubResponse('acceptRcpOffer', 200, acceptedOffer);
            });


            it('should call the endpoint', function () {
                service.accept(newAccountDetails, debitOrderDetails);
                expect(test.endpoint('acceptRcpOffer')).toHaveBeenCalledWith({
                    systemPrincipalIdentifier: {
                        systemPrincipalId: '1',
                        systemPrincipalKey: 'SBSA_BANKING'
                    },
                    productNumber: 'SATMSYST 20140820141510001',
                    selectedOffer: 1,
                    preferredBranch: 2508,
                    applicationNumber: 123,
                    requestedLimit: 6000,
                    debitOrderRepaymentAmount: 231.00,
                    debitOrderAccountNumber: "282974644",
                    debitOrderCycleCode: 113,
                    debitOrderElectronicConsentReceived : true,
                    debitOrderIbtNumber: 2505

                });
            });

            it('should set requestLimit to zero when undefined', function () {
                newAccountDetails = new NewAccountDetails('SATMSYST 20140820141510001', 123, 2508);
                service.accept(newAccountDetails, debitOrderDetails);
                expect(test.endpoint('acceptRcpOffer')).toHaveBeenCalledWith({
                    systemPrincipalIdentifier: {
                        systemPrincipalId: '1',
                        systemPrincipalKey: 'SBSA_BANKING'
                    },
                    productNumber: 'SATMSYST 20140820141510001',
                    selectedOffer: 1,
                    preferredBranch: 2508,
                    applicationNumber: 123,
                    requestedLimit: 0,
                    debitOrderRepaymentAmount: 231.00,
                    debitOrderAccountNumber: "282974644",
                    debitOrderCycleCode: 113,
                    debitOrderElectronicConsentReceived : true,
                    debitOrderIbtNumber: 2505

                });
            });

            it('should resolve with the service response', function () {
                expect(service.accept(newAccountDetails, debitOrderDetails)).toBeResolvedWith(jasmine.objectContaining({
                    timestamp: '2014-08-13T09:08:40.424+02:00',
                    accountNumber: 0,
                    maximumDebitOrderRepaymentAmount: 5000.20
                }));
                test.resolvePromise();
            });
        });

        describe('failure', function () {
            it('should resolve with the service response', function () {
                test.stubResponse('acceptRcpOffer', 500, {}, {'x-sbg-response-code': '8888'});
                expect(service.accept()).toBeRejected();
                test.resolvePromise();
            });
        });
    });

});
