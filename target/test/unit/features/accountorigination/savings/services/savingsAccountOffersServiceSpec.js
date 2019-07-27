describe('SavingsAccountOffersService', function () {

    'use strict';

    var savingsAccountOffersService, ServiceTest, usersCard, SavingsAccountApplication;

    beforeEach(module('refresh.accountOrigination.savings.services.savingsAccountOffersService',
        'refresh.accountOrigination.savings.domain.savingsAccountApplication'));

    beforeEach(inject(function (SavingsAccountOffersService, _ServiceTest_, _Card_, _SavingsAccountApplication_) {
        savingsAccountOffersService = SavingsAccountOffersService;
        ServiceTest = _ServiceTest_;
        ServiceTest.spyOnEndpoint('createSavingsAccountApplication');
        ServiceTest.stubResponse('createSavingsAccountApplication', 200, {
            offerId: "1234567890",
            caseId: "12345"
        });
        ServiceTest.spyOnEndpoint('originateSavingsAccount');
        ServiceTest.stubResponse('originateSavingsAccount', 200, {
            accountNumber: "10-00-035-814-00",
            originationDate: "2015-09-14T10:49:51.000+0000"
        });
        spyOn(_Card_, 'current').and.returnValue({ number: "123456789" });
        usersCard = _Card_.current();
        SavingsAccountApplication = _SavingsAccountApplication_;
        spyOn(_SavingsAccountApplication_, 'productName').and.returnValue("SavingsProduct");
        spyOn(_SavingsAccountApplication_, 'productCode').and.returnValue("1234");
    }));

    describe('getOfferButtonText', function () {
        it('should return \'Submit\'', function(){
            expect(savingsAccountOffersService.getOfferButtonText()).toBe('Submit');
        });
    });

    describe('getOffers', function () {
        it('should call AccountOriginationService/CreateSavingsAccountApplication', function(){
            savingsAccountOffersService.getOffers();
            ServiceTest.resolvePromise();
            expect(ServiceTest.endpoint('createSavingsAccountApplication')).toHaveBeenCalledWith({
                productId: "1234",
                analyticsData: "Application for SavingsProduct account",
                card: usersCard
            }, {omitServiceErrorNotification: true});
        });

        describe('gets a valid offer', function () {
            beforeEach(inject(function () {
                ServiceTest.stubResponse('createSavingsAccountApplication', 200, {
                    offerId: "1234567890",
                    caseId: "12345"
                });
            }));

            it('should return a valid offer id', function() {
                expect(savingsAccountOffersService.getOffers()).toBeResolvedWith(jasmine.objectContaining({offerId: "1234567890", caseId: "12345"}));
                ServiceTest.resolvePromise();
            });
        });

        describe('encounters a problem which is handled on the backend', function () {
            describe('where the customer is not AML compliant', function () {
                beforeEach(inject(function () {
                    ServiceTest.stubResponse('createSavingsAccountApplication', 204, { }, { 'x-sbg-response-type': 'ERROR', 'x-sbg-response-code': '052(ZAO_BS_INT)', 'x-sbg-response-message': 'Business Partner is not AML compliant' });
                }));

                it('should reject the promise with a reason', function() {
                    expect(savingsAccountOffersService.getOffers()).toBeRejectedWith(jasmine.objectContaining({'reason': 'DECLINED'}));
                    ServiceTest.resolvePromise();
                });
            });

            describe('where the customer is another non-generic error', function () {
                beforeEach(inject(function () {
                    ServiceTest.stubResponse('createSavingsAccountApplication', 204, { }, { 'x-sbg-response-type': 'ERROR', 'x-sbg-response-code': '1234', 'x-sbg-response-message': 'Some specific problem happened' });
                }));

                it('should reject the promise with a reason', function() {
                    expect(savingsAccountOffersService.getOffers()).toBeRejectedWith(jasmine.objectContaining({'reason': 'Some specific problem happened'}));
                    ServiceTest.resolvePromise();
                });
            });

            describe('where the problem is a generic error', function () {
                beforeEach(inject(function () {
                    ServiceTest.stubResponse('createSavingsAccountApplication', 204, { }, { 'x-sbg-response-type': 'ERROR', 'x-sbg-response-code': '9999', 'x-sbg-response-message': 'An error happened' });
                }));

                it('should reject the promise', function() {
                    expect(savingsAccountOffersService.getOffers()).toBeRejectedWith(jasmine.objectContaining({'message': 'An error happened'}));
                    ServiceTest.resolvePromise();
                });
            });
        });

        describe('encounters a problem which was NOT handled on the backend', function () {
            beforeEach(inject(function () {
                ServiceTest.stubResponse('createSavingsAccountApplication', 500);
            }));

            it('should reject the promise', function() {
                expect(savingsAccountOffersService.getOffers()).toBeRejected();
                ServiceTest.resolvePromise();
            });
        });
    });

    describe('originateAccount', function () {
        var offerId, productCode, transferFromAccount, initialDepositAmount;
        beforeEach(function () {
            offerId = "1234567890";
            transferFromAccount = {
                "accountFeature": [
                    {
                        "feature": "PAYMENTFROM",
                        "value": true
                    }],
                "formattedNumber": "12-34-567-890-0",
                "number": "12345678900",
                "availableBalance": 9000.0,
                accountType: "CURRENT"
            };
            productCode = "1234";
            initialDepositAmount = 123;
            spyOn(SavingsAccountApplication, 'offerId').and.returnValue(offerId);
            spyOn(SavingsAccountApplication, 'transferFromAccount').and.returnValue(transferFromAccount);
            spyOn(SavingsAccountApplication, 'initialDepositAmount').and.returnValue(initialDepositAmount);
        });

        it('should call AccountOriginationService/OriginateSavingsAccount', function(){
            savingsAccountOffersService.originateAccount();
            ServiceTest.resolvePromise();
            expect(ServiceTest.endpoint('originateSavingsAccount')).toHaveBeenCalledWith(jasmine.objectContaining({
                offerId: offerId,
                productId: productCode,
                analyticsData: "Originate SavingsProduct account",
                transferFromAccountNumber: transferFromAccount.number,
                initialTransferAmount: initialDepositAmount,
                cardNumber: usersCard.number
            }));
        });

        describe('gets a valid offer', function () {
            var date;
            beforeEach(inject(function () {
                date = new Date().toString();
                ServiceTest.stubResponse('originateSavingsAccount', 200, {
                    accountNumber: "1234567890",
                    originationDate: date
                });
            }));

            it('should return a valid account number and date opened', function() {
                expect(savingsAccountOffersService.originateAccount()).toBeResolvedWith(jasmine.objectContaining({accountNumber: "1234567890", originationDate: date}));
                ServiceTest.resolvePromise();
            });
        });

        describe('encounters a problem which is handled on the backend', function () {
            beforeEach(inject(function () {
                ServiceTest.stubResponse('originateSavingsAccount', 204, { }, { 'x-sbg-response-type': 'ERROR', 'x-sbg-response-message': 'An error happened' });
            }));

            it('should reject the promise', function() {
                expect(savingsAccountOffersService.originateAccount()).toBeRejectedWith(jasmine.objectContaining({'message': 'An error happened'}));
                ServiceTest.resolvePromise();
            });
        });

        describe('encounters a problem which was NOT handled on the backend', function () {
            beforeEach(inject(function () {
                ServiceTest.stubResponse('originateSavingsAccount', 500);
            }));

            it('should reject the promise', function() {
                expect(savingsAccountOffersService.originateAccount()).toBeRejected();
                ServiceTest.resolvePromise();
            });
        });
    });
});
