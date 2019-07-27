describe('Unit Test - Formal Statement', function () {
    "use strict";

    beforeEach(module('refresh.formalStatement.service', 'refresh.test'));

    var test, formalStatementService, mock;
    beforeEach(inject(function (ServiceTest, FormalStatementService, _mock_) {
        test = ServiceTest;
        formalStatementService = FormalStatementService;
        mock = _mock_;

        test.spyOnEndpoint('viewFormalStatementList');
        test.spyOnEndpoint('emailFormalStatement');
    }));

    describe('view formal statement', function () {

        var accountNumber= '123456';

        var card = {
            number: '12345'
        };

        var accountType = 'CURRENT';

        var serviceRequest = {
            formalStatementAccount: {
                number: '123456',
                accountType: accountType
            },
            card: {
                number: '12345'
            }
        };
        var response = {
            dontCare: 'Blah blah'
        };


        it('should resolve with data from service endpoint', function() {
            test.stubResponse('viewFormalStatementList', 200, {statements: response}, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'SUCCESS'
            });
            expect(formalStatementService.viewFormalStatementList(accountNumber, accountType, card)).toBeResolvedWith(response);
            test.resolvePromise();
            expect(test.endpoint('viewFormalStatementList')).toHaveBeenCalledWith(serviceRequest);
        });

        it('should resolve with undefined from service endpoint when there is not data', function() {
            test.stubResponse('viewFormalStatementList', 200, {}, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'SUCCESS'
            });
            expect(formalStatementService.viewFormalStatementList(accountNumber, accountType, card)).toBeResolvedWith(undefined);
            test.resolvePromise();
            expect(test.endpoint('viewFormalStatementList')).toHaveBeenCalledWith(serviceRequest);
        });

        it('should reject with message from service endpoint when with error in header', function () {
            test.stubResponse('viewFormalStatementList', 200, {message: 'OK'}, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'ERROR',
                'x-sbg-response-message': 'Something is wrong'
            });
            expect(formalStatementService.viewFormalStatementList(accountNumber, accountType, card)).toBeRejectedWith(
                'We are experiencing technical problems. Please try again later');
            test.resolvePromise();
        });

        it('should reject with message for un-authorized error', function () {
            test.stubResponse('viewFormalStatementList', 204, {message: 'OK'}, {
                'x-sbg-response-code': '4444',
                'x-sbg-response-type': 'ERROR',
                'x-sbg-response-message': 'Something is wrong'
            });
            expect(formalStatementService.viewFormalStatementList(accountNumber, accountType, card)).toBeRejectedWith(
                'Cannot find this card number on your profile.');
            test.resolvePromise();
        });

        it('should reject with error and message when the status is not success and no error message', function () {
            test.stubResponse('viewFormalStatementList', 404);
            expect(formalStatementService.viewFormalStatementList(accountNumber, accountType, card)).toBeRejectedWith(
                'We are experiencing technical problems. Please try again later');
            test.resolvePromise();
        });
    });

    describe('email formal statement', function () {

        var statementId= 'statement id';
        var cardNumber = 'card number';
        var accountNumber = 'account number';
        var accountType = 'account type';
        var emailAddress = 'email address';

        it('should resolve with data from service endpoint', function() {
            test.stubResponse('emailFormalStatement', 200, {}, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'SUCCESS'
            });
            expect(formalStatementService.emailFormalStatement(cardNumber, statementId, accountNumber, accountType, emailAddress)).toBeResolvedWith({});
            test.resolvePromise();
            expect(test.endpoint('emailFormalStatement')).toHaveBeenCalledWith({
                statementId: statementId,
                cardNumber: cardNumber,
                accountNumber:accountNumber,
                accountType: accountType,
                emailAddress: emailAddress
            });
        });

        it('should reject with message from service endpoint when with error in header', function () {
            test.stubResponse('emailFormalStatement', 200, {message: 'OK'}, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'ERROR',
                'x-sbg-response-message': 'Something is wrong'
            });
            expect(formalStatementService.emailFormalStatement(cardNumber, statementId, accountNumber, emailAddress)).toBeRejectedWith(
                'We are experiencing technical problems. Please try again later');
            test.resolvePromise();
        });

        it('should reject with error and message when the status is not success and no error message', function () {
            test.stubResponse('emailFormalStatement', 404);
            expect(formalStatementService.emailFormalStatement(cardNumber, statementId, accountNumber, emailAddress)).toBeRejectedWith(
                'We are experiencing technical problems. Please try again later');
            test.resolvePromise();
        });
    });
});