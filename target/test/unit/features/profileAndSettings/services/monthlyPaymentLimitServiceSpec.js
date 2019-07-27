describe('LimitMaintenanceService', function () {
    beforeEach(module('refresh.profileAndSettings.limitMaintenanceService'));

    var test, LimitMaintenanceService;
    beforeEach(inject(function (_ServiceTest_, _LimitMaintenanceService_) {
        test = _ServiceTest_;
        LimitMaintenanceService = _LimitMaintenanceService_;
    }));

    describe('maintain', function () {
        it('should return a successful promise on valid input', function () {
            var expectedRequest = {
                "card"       : {
                    "number": "12345"
                },
                "newEAPLimit": {
                    "amount": '10000'
                }
            };

            var expectedResponse = {
                usedEAPLimit     : {
                    amount  : '1000',
                    currency: 'R'
                },
                availableEAPLimit: {
                    amount  : '10000',
                    currency: 'R'
                },
                monthlyEAPLimit  : {
                    amount  : '10000',
                    currency: 'R'
                }
            };

            var expectedHeaders = {
                "x-sbg-response-type": "SUCCESS",
                "x-sbg-response-code": "0000"
            };
            test.spyOnEndpoint('maintainMonthlyPaymentLimit');
            test.stubResponse('maintainMonthlyPaymentLimit', 200, expectedResponse, expectedHeaders);
            expect(LimitMaintenanceService.maintain(expectedRequest)).toBeResolvedWith(expectedResponse);
            test.resolvePromise();
        });

        it('should return a rejected promise on invalid request', function() {
            var expectedRequest = {
                "card"       : {
                    "number": "12345"
                },
                "newEAPLimit": {
                    "amount": '-10000'
                }
            };

            var expectedResponse = {
                code: '250',
                message: 'We are experiencing technical problems. Please try again later',
                model: expectedRequest
            };

            var expectedHeaders = {
                "x-sbg-response-type": "ERROR",
                "x-sbg-response-code": "250"
            };
            test.spyOnEndpoint('maintainMonthlyPaymentLimit');
            test.stubResponse('maintainMonthlyPaymentLimit', 204, expectedResponse, expectedHeaders);
            expect(LimitMaintenanceService.maintain(expectedRequest)).toBeRejectedWith(expectedResponse);
            test.resolvePromise();
        });
    });
});
