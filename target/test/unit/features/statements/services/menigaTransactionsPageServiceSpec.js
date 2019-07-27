'use strict';
describe('meniga transactions page service', function () {
    var serviceTest, menigaTransactionsPageService, expectedRequest;
    var personalFinanceManagementId = 9;
    var testAccount = {number: 'Test account number'};
    var GET_TRANSACTION_PAGE_ENDPOINT = 'getTransactionsPage';
    var menigaTransactionsPageQuery = {
        personalFinanceManagementId: personalFinanceManagementId,
        account: testAccount,
        pageIndex: 0
    };

    beforeEach(module('refresh.menigaTransactionsPage.services', 'refresh.test', 'refresh.configuration'));

    var calculateDateForNumberOfMonthsHistory = function (monthsHistory) {
        var now = new Date();
        var transactionsPageStartDate = new Date(1900 + now.getYear(), now.getMonth() - monthsHistory, 1, 0, 0, 0, 0);
        return transactionsPageStartDate;
    };

    beforeEach(inject(function (_MenigaTransactionsPageService_, _ServiceTest_) {
        serviceTest = _ServiceTest_;
        serviceTest.spyOnEndpoint('getTransactionsPage');
        serviceTest.stubResponse('getTransactionsPage', 200);

        menigaTransactionsPageService = _MenigaTransactionsPageService_;

        expectedRequest = {
            personalFinanceManagementId: personalFinanceManagementId,
            payload: {
                page: 0,
                transactionsPerPage: 50,
                filter: {
                    AccountIdentifiers: [testAccount.number],
                    AscendingOrder: false,
                    HideExcluded: false,
                    PeriodFrom: calculateDateForNumberOfMonthsHistory(0)
                }
            }
        };
    }));

    describe('get transactions page method', function () {

        it('should ask for current month\'s transactions by default', function () {
            menigaTransactionsPageService.getTransactionsPage(menigaTransactionsPageQuery);
            expect(serviceTest.endpoint(GET_TRANSACTION_PAGE_ENDPOINT)).toHaveBeenCalledWith(expectedRequest);
        });

        describe('given number of months to go back, we should ask for transactions from the start of that month', function () {
            it('in the case of 1 month to go back, should ask for transactions from the beginning of last month', function () {
                var numberOfMonthsToGoBackTo = 1;
                menigaTransactionsPageQuery.monthsToGoBack = numberOfMonthsToGoBackTo;
                menigaTransactionsPageService.getTransactionsPage(menigaTransactionsPageQuery);

                expectedRequest.payload.filter.PeriodFrom = calculateDateForNumberOfMonthsHistory(numberOfMonthsToGoBackTo);
                expect(serviceTest.endpoint(GET_TRANSACTION_PAGE_ENDPOINT)).toHaveBeenCalledWith(expectedRequest);
            });

            it('in the case of 10 months to go back, should ask for 10 months worth of transactions i.e if we were in the month of december should thus ask for transaction from the beginning of February ',
                function () {
                    var numberOfMonthsToGoBackTo = 10;
                    menigaTransactionsPageQuery.monthsToGoBack = numberOfMonthsToGoBackTo;
                    expectedRequest.payload.filter.PeriodFrom = calculateDateForNumberOfMonthsHistory(numberOfMonthsToGoBackTo);
                    menigaTransactionsPageService.getTransactionsPage(menigaTransactionsPageQuery);
                    expect(serviceTest.endpoint(GET_TRANSACTION_PAGE_ENDPOINT)).toHaveBeenCalledWith(expectedRequest);
                }
            );
        });

        describe('Given a response from the gateway', function () {
            describe('When HTTP response status is 200', function () {
                beforeEach(function () {
                    serviceTest.stubResponse('getTransactionsPage', 200);
                });

                describe('And SBG type header does NOT equal \'ERROR\'', function () {
                    var stubResponse = {
                        payload: {
                            description: 'this is the payload in the response body returned by the gateway'
                        }
                    };

                    beforeEach(function () {
                        serviceTest.stubResponse('getTransactionsPage', 200, stubResponse, { "x-sbg-response-type": "NOT ERROR" });
                    });

                    it('should resolve with the payload object in the response', function () {
                        expect(menigaTransactionsPageService.getTransactionsPage(menigaTransactionsPageQuery)).toBeResolvedWith(stubResponse);
                        serviceTest.resolvePromise();
                    });
                });

                describe('And SBG type header does equal \'ERROR\'', function () {
                    var stubResponse = {
                        payload: {
                            description: 'this is the payload in the response body returned by the gateway'
                        }
                    };

                    beforeEach(function () {
                        serviceTest.stubResponse('getTransactionsPage', 200, stubResponse, { "x-sbg-response-type": "ERROR" });
                    });

                    describe('And SBG code header equals \'9999\'', function () {
                        beforeEach(function () {
                            serviceTest.stubResponse('getTransactionsPage', 200, stubResponse, { "x-sbg-response-type": "ERROR", "x-sbg-response-code": "9999" });
                        });

                        it('should reject with a generic error message', function () {
                            expect(menigaTransactionsPageService.getTransactionsPage(menigaTransactionsPageQuery)).toBeRejectedWith(jasmine.objectContaining({
                                'message': 'An error has occurred'
                            }));
                            serviceTest.resolvePromise();
                        });
                    });

                    describe('And SBG code header does NOT equal \'9999\'', function () {
                        beforeEach(function () {
                            serviceTest.stubResponse('getTransactionsPage', 200, stubResponse, { "x-sbg-response-type": "ERROR", "x-sbg-response-code": "1234", "x-sbg-response-message": "This error message came from the gateway" });
                        });

                        it('should reject with the error message from the gateway', function () {
                            expect(menigaTransactionsPageService.getTransactionsPage(menigaTransactionsPageQuery)).toBeRejectedWith(jasmine.objectContaining({
                                'message': 'This error message came from the gateway'
                            }));
                            serviceTest.resolvePromise();
                        });
                    });
                });

            });

            describe('When HTTP response status is NOT 200', function () {
                beforeEach(function () {
                    serviceTest.stubRejection('getTransactionsPage', 204);
                });

                it('should reject with a generic error message', function () {
                    expect(menigaTransactionsPageService.getTransactionsPage(menigaTransactionsPageQuery)).toBeRejectedWith(jasmine.objectContaining({
                        'message': 'An error has occurred'
                    }));
                    serviceTest.resolvePromise();
                });
            });
        });
    });
});
