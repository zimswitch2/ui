describe('accountsValidationService', function () {
    'use strict';

    beforeEach(module('refresh.accountsValidationService'));

    var service;

    beforeEach(inject(function (_AccountsValidationService_) {
        service = _AccountsValidationService_;
    }));

    describe('validate info message', function () {
        it('should have info message if account is undefined or empty', function () {
            var expectedResult = {
                hasInfo: true,
                infoMessage: 'There are currently no accounts linked to your card. Please visit your nearest branch'
            };
            expect(service.validateInfoMessage(undefined)).toEqual(expectedResult);
            expect(service.validateInfoMessage([])).toEqual(expectedResult);
        });

        it('should not have info message if account is not empty', function () {
            expect(service.validateInfoMessage([{
                availableBalance: {amount: 0.00},
                number: "DOESN'T MATTER"
            }])).toEqual({hasInfo: false});
        });
    });
});
