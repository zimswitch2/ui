describe('EntitlementsBeneficiaryPaymentService', function(){
    beforeEach(module('refresh.accountSharing.beneficiaryPayments'));

    var http, url, entitlementsBeneficiaryPaymentService, user;
    var currentSystemPrincipalIdentifiers = {
        "systemPrincipalIdentifiers": {
            "systemPrincipalId": "123132",
            "systemPrincipalKey": "SED"
        }
    };

    beforeEach(inject(function(EntitlementsBeneficiaryPaymentService, _$httpBackend_, _URL_, _User_){
        entitlementsBeneficiaryPaymentService = EntitlementsBeneficiaryPaymentService;
        http = _$httpBackend_;
        url = _URL_;
        user = _User_;

        spyOn(user, 'principal').and.returnValue(currentSystemPrincipalIdentifiers);
        spyOn(user, 'principalForCurrentDashboard');
    }));

    describe('pendingPayments', function(){
        describe('with successful service response', function(){

            var pendingPayments =
            [
                {
                    "beneficiaryName" : "Alpha",
                    "beneficiaryAccount" : "123456",
                    "description" : "Plumbing - as per our agreement",
                    "amount" : 2000,
                    "currency" : "R",
                    "yourReference" : "12345",
                    "beneficiaryReference" : "67890",
                    "status" : "pending"
                },
                {
                    "beneficiaryName" : "Bravo",
                    "beneficiaryAccount" : "123457",
                    "description" : "Security",
                    "amount" : 1500,
                    "currency" : "R",
                    "yourReference" : "12346",
                    "beneficiaryReference" : "67891",
                    "status" : "pending"
                }
            ];

            describe('pending payments list fetch', function(){
                it('should contain a list of pending payments', function(){
                    http.expectPOST(url.getPendingPayments, currentSystemPrincipalIdentifiers).respond(200, {
                        "transactions" : pendingPayments
                    }, {
                        'x-sbg-response-code': '0000',
                        'x-sbg-response-type': 'SUCCESS'
                    });

                    var responseData;

                    entitlementsBeneficiaryPaymentService.getPendingPayments()
                        .then(function(response){
                            responseData = response;
                        });
                    http.flush();

                    expect(responseData).toEqual( pendingPayments );
                });

                it('should return an error when an unknown error occurs', function(){
                    http.expectPOST(url.getPendingPayments, currentSystemPrincipalIdentifiers).respond(200, {}, {
                        'x-sbg-response-code': '9999',
                        'x-sbg-response-type': 'ERROR',
                        'x-sbg-response-message': 'An error has occurred'
                    });

                    var errorMessage;

                    entitlementsBeneficiaryPaymentService.getPendingPayments()
                        .catch(function(error){
                            errorMessage = error.message;
                        });

                    http.flush();

                    expect(errorMessage).toEqual('An error has occurred');
                });
            });
        });
    });

    describe('rejectedPayments', function(){
        describe('with successful service response', function(){

            var rejectedPayments =
                [
                    {
                        "paymentNotificationMethod": "Email",
                        "beneficiaryName": "M Monte",
                        "beneficiaryEmail": "accounts@flowers.com",
                        "beneficiaryCell": "27829266693",
                        "beneficiaryFax": "",
                        "beneficiaryAccount": "12345",
                        "rejectedBy": "Joanna",
                        "reasonForPayment": "Payment to the flower delivery company",
                        "reasonForRejection": "Incomplete payment",
                        "paymentNotification": true,
                        "beneficiaryReference": "Test Bene",
                        "customerReference": "Test",
                        "paymentDate": "2016-03-19T00:00:00Z",
                        "amount": 400
                    },
                    {
                        "paymentNotificationMethod": "SMS",
                        "beneficiaryName": "M Monte 2",
                        "beneficiaryEmail": "accounts@flowers.com",
                        "beneficiaryCell": "27829266693",
                        "beneficiaryFax": "",
                        "beneficiaryAccount": "12345",
                        "rejectedBy": "Joanna",
                        "reasonForPayment": "Payment to the flower delivery company",
                        "reasonForRejection": "Incomplete payment",
                        "paymentNotification": true,
                        "beneficiaryReference": "Test Bene",
                        "customerReference": "Test",
                        "paymentDate": "2016-03-19T00:00:00Z",
                        "amount": 400
                    },
                    {
                        "paymentNotificationMethod": "Email",
                        "beneficiaryName": "M Monte 3",
                        "beneficiaryEmail": "accounts@flowers.com",
                        "beneficiaryCell": "27829266693",
                        "beneficiaryFax": "",
                        "beneficiaryAccount": "12345",
                        "rejectedBy": "Joanna",
                        "reasonForPayment": "Payment to the flower delivery company",
                        "reasonForRejection": "Incomplete payment",
                        "paymentNotification": true,
                        "beneficiaryReference": "Test Bene",
                        "customerReference": "Test",
                        "paymentDate": "2016-03-19T00:00:00Z",
                        "amount": 400
                    }
                ];

            describe('pending payments list fetch', function(){
                it('should contain a list of pending payments', function(){

                    http.expectPOST(url.getRejectedPayments, currentSystemPrincipalIdentifiers).respond(200, {
                        "transactions" : rejectedPayments
                    }, {
                        'x-sbg-response-code': '0000',
                        'x-sbg-response-type': 'SUCCESS'
                    });

                    var responseData;

                    entitlementsBeneficiaryPaymentService.getRejectedPayments()
                        .then(function(response){
                            responseData = response;
                        });
                    http.flush();

                    expect(responseData).toEqual( rejectedPayments );
                });

                it('should return an error when an unknown error occurs', function(){
                    http.expectPOST(url.getPendingPayments, currentSystemPrincipalIdentifiers).respond(200, {}, {
                        'x-sbg-response-code': '9999',
                        'x-sbg-response-type': 'ERROR',
                        'x-sbg-response-message': 'An error has occurred'
                    });

                    var errorMessage;

                    entitlementsBeneficiaryPaymentService.getRejectedPayments()
                        .catch(function(error){
                            errorMessage = error.message;
                        });

                    http.flush();

                    expect(errorMessage).toEqual('An error has occurred');
                });
            });
        });
    });

    describe('rejected payment details', function(){

        var rejectedPayment = {
            "paymentNotificationMethod": "Email",
            "beneficiaryName": "M Monte",
            "beneficiaryEmail": "accounts@flowers.com",
            "beneficiaryCell": "27829266693",
            "beneficiaryFax": "",
            "beneficiaryAccount": "12345",
            "rejectedBy": "Joanna",
            "reasonForPayment": "Payment to the flower delivery company",
            "reasonForRejection": "Incomplete payment",
            "paymentNotification": true,
            "beneficiaryReference": "Test Bene",
            "customerReference": "Test",
            "paymentDate": "2016-03-19T00:00:00Z",
            "amount": 400
        };

        it("should call setter for rejected payment", function(){
            spyOn(entitlementsBeneficiaryPaymentService, 'setRejectedPaymentDetails');
            entitlementsBeneficiaryPaymentService.setRejectedPaymentDetails(rejectedPayment);
            expect(entitlementsBeneficiaryPaymentService.setRejectedPaymentDetails).toHaveBeenCalledWith(rejectedPayment);
        });

        it('should set rejected payment', function () {
            entitlementsBeneficiaryPaymentService.setRejectedPaymentDetails(rejectedPayment);
            expect(entitlementsBeneficiaryPaymentService.getRejectedPaymentsDetails()).toEqual(rejectedPayment);
        });

    });
});