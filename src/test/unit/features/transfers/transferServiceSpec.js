describe('transfer service ', function () {
    beforeEach(module('refresh.transfers'));

    var accountsService;
    beforeEach(function () {
        accountsService = jasmine.createSpyObj('accounts', ['clear', 'list', 'validTransferFromAccounts', 'validTransferToAccounts']);
        module(function ($provide) {
            $provide.value('AccountsService', accountsService);
        });
    });

    var rootScope, http, service, url, transactions, mock;
    var transferObject = {
        to: "1234-1234-1234",
        from: "1234-1234-1233",
        reference: "dummy",
        amount: 100
    };
    var expectedRequest = {"account": transferObject.from,
        "transactions": {
            "transfers": [
                {
                    "amount": {
                        'amount': 100,
                        "currency": "ZAR"
                    },
                    "transactionId": transferObject.reference,
                    "toAccount": transferObject.to
                }
            ]
        }
    };

    beforeEach(inject(function ($rootScope, _TransferService_, _$httpBackend_, _URL_, _mock_) {
        rootScope = $rootScope;
        http = _$httpBackend_;
        service = _TransferService_;
        url = _URL_;
        transactions = {};
        mock = _mock_;
    }));

    it('should invoke the transfer service and respond with a success', function (done) {

        var expectedResponse = {
            "transactionResults": [
                {
                    "responseCode": {
                        "code": "0000",
                        "responseType": "SUCCESS",
                        "message": "Your transfer has been completed successfully"
                    }
                }
            ]
        };

        http.expectPUT(url.transactions).respond(200, expectedResponse, {'x-sbg-response-code': "0000"});
        service.transfer(transferObject)
            .then(function (response) {
                expect(response.data).toEqual(expectedResponse);
                done();
            });
        expect(accountsService.clear).toHaveBeenCalled();
        http.flush();
    });

    it('should invoke the transfer service and respond with a system failure if the service returns a 500', function (done) {
        http.expectPUT(url.transactions, expectedRequest).respond(500, {"message": "An error has occurred"});
        service.transfer(transferObject)
            .catch(function (error) {
                expect(error.message).toEqual("An error has occurred");
                done();
            });
        expect(accountsService.clear).toHaveBeenCalled();
        http.flush();
    });

    it('should invoke the transfer service and fail if the service returns a failed response code', function (done) {
        http.expectPUT(url.transactions, expectedRequest)
            .respond(204, {}, {'x-sbg-response-type': "ERROR",
                'x-sbg-response-code': "1000",
                'x-sbg-response-message': 'Service error message'});
        service.transfer(transferObject)
            .catch(function (error) {
                expect(error.message).toEqual("Service error message");
                done();
            });
        expect(accountsService.clear).toHaveBeenCalled();
        http.flush();
    });

    describe('transfer possible', function () {
        var accountsResponse;

        it('should use the accounts list to get the transfer to and from accounts', function () {
            accountsResponse = { blah: 'asd', accounts: 'accounts here', more_blah: 'asdasd'};
            accountsService.list.and.returnValue(mock.resolve(accountsResponse));
            accountsService.validTransferFromAccounts.and.returnValue([]);
            accountsService.validTransferToAccounts.and.returnValue([]);
            service.transferPossible();
            rootScope.$digest();
            expect(accountsService.validTransferFromAccounts).toHaveBeenCalledWith('accounts here');
            expect(accountsService.validTransferToAccounts).toHaveBeenCalledWith('accounts here');
        });

        it('should be false with no from or to accounts', function () {
            accountsResponse = 'accounts response';
            accountsService.list.and.returnValue(mock.resolve(accountsResponse));
            accountsService.validTransferFromAccounts.and.returnValue([]);
            accountsService.validTransferToAccounts.and.returnValue([]);
            expect(service.transferPossible()).toBeResolvedWith(false);
            rootScope.$digest();
        });

        it('should be false with no from accounts', function () {
            accountsResponse = 'accounts response';
            accountsService.list.and.returnValue(mock.resolve(accountsResponse));
            accountsService.validTransferFromAccounts.and.returnValue([]);
            accountsService.validTransferToAccounts.and.returnValue(['1', '2']);
            expect(service.transferPossible()).toBeResolvedWith(false);
            rootScope.$digest();
        });

        it('should be false with no to accounts', function () {
            accountsResponse = 'accounts response';
            accountsService.list.and.returnValue(mock.resolve(accountsResponse));
            accountsService.validTransferFromAccounts.and.returnValue(['1', '2']);
            accountsService.validTransferToAccounts.and.returnValue([]);
            expect(service.transferPossible()).toBeResolvedWith(false);
            rootScope.$digest();
        });

        it('should be false with one from and one to account, both the same', function () {
            accountsResponse = 'accounts response';
            accountsService.list.and.returnValue(mock.resolve(accountsResponse));
            accountsService.validTransferFromAccounts.and.returnValue(['1']);
            accountsService.validTransferToAccounts.and.returnValue(['1']);
            expect(service.transferPossible()).toBeResolvedWith(false);
            rootScope.$digest();
        });

        it('should be true with one from and one different to account', function () {
            accountsResponse = 'accounts response';
            accountsService.list.and.returnValue(mock.resolve(accountsResponse));
            accountsService.validTransferFromAccounts.and.returnValue(['1']);
            accountsService.validTransferToAccounts.and.returnValue(['2']);
            expect(service.transferPossible()).toBeResolvedWith(true);
            rootScope.$digest();
        });

        it('should be true with many from and one to account', function () {
            accountsResponse = 'accounts response';
            accountsService.list.and.returnValue(mock.resolve(accountsResponse));
            accountsService.validTransferFromAccounts.and.returnValue(['1', '2']);
            accountsService.validTransferToAccounts.and.returnValue(['2']);
            expect(service.transferPossible()).toBeResolvedWith(true);
            rootScope.$digest();
        });

        it('should be true with one from and many to accounts', function () {
            accountsResponse = 'accounts response';
            accountsService.list.and.returnValue(mock.resolve(accountsResponse));
            accountsService.validTransferFromAccounts.and.returnValue(['1']);
            accountsService.validTransferToAccounts.and.returnValue(['1', '2']);
            expect(service.transferPossible()).toBeResolvedWith(true);
            rootScope.$digest();
        });
    });
});