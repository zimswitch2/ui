describe('OnceOffPaymentConfirmController', function () {

    beforeEach(module('refresh.onceOffPayment', 'refresh.test', 'refresh.configuration', 'refresh.navigation', 'refresh.fixture'));

    var scope, paymentService, mock, card, flow, location, expectedSteps, onceOffPaymentModel, beneficiariesService, beneficiaryPaymentService;

    var rootScope, controller;

    beforeEach(inject(function ($rootScope, $controller, _mock_, Flow, OnceOffPaymentModel) {
        rootScope = $rootScope;
        scope = rootScope.$new();
        paymentService = jasmine.createSpyObj('onceOffPaymentService', ['payPrivateBeneficiaryOnceOff']);
        beneficiaryPaymentService = jasmine.createSpyObj('beneficiaryPaymentService', ['payBeneficiary']);
        card = jasmine.createSpyObj('card', ['current']);
        location = jasmine.createSpyObj('location', ['path']);
        flow = Flow;
        onceOffPaymentModel = OnceOffPaymentModel;

        mock = _mock_;
        expectedSteps = [
            {name: 'Enter details', complete: false, current: true},
            {name: 'Confirm details', complete: false, current: false},
            {name: 'OTP', complete: false, current: false}
        ];

        beneficiariesService = jasmine.createSpyObj('beneficiariesService', ['addOrUpdate']);

        controller = $controller;

        controller('OnceOffPaymentConfirmController', {
            $scope: scope,
            $location: location,
            OnceOffPaymentService: paymentService,
            BeneficiaryPaymentService: beneficiaryPaymentService,
            Card: card,
            BeneficiariesService: beneficiariesService,
            Flow: flow,
            OnceOffPaymentModel: onceOffPaymentModel
        });
    }));

    describe('routes', function () {
        var route;

        beforeEach(inject(function ($route) {
            route = $route;
        }));

        describe('when a beneficiary is to be paid once off', function () {
            it('should use the correct controller', function () {
                expect(route.routes['/payment/onceoff'].controller).toEqual('OnceOffPaymentController');
            });

            it('should use the correct template', function () {
                expect(route.routes['/payment/onceoff'].templateUrl).toEqual('features/payment/partials/payBeneficiaryOnceOff.html');
            });
        });
    });

    beforeEach(function () {
        onceOffPaymentModel.initialise();
        onceOffPaymentModel.setAccount( {
            "formattedNumber": "1233445",
            "availableBalance": {
                "amount": 9000.0,
                "currency": "ZAR"
            }
        });
        onceOffPaymentModel.setCardProfile( {
            "monthlyEAPLimit": 10000,
            "monthlyWithdrawalLimit": 10000,
            "usedEAPLimit": 2000
        });
        onceOffPaymentModel.setAmount( "123.45");
        onceOffPaymentModel.setBeneficiary( {
            recipientId: '1',
            name: 'Test',
            accountNumber: '1234567890',
            paymentConfirmation: {
                "address": null,
                "confirmationType": 'None',
                "recipientName": null,
                "sendFutureDated": null
            },
            recipientReference: 'Test',
            customerReference: 'Test',
            something: 'else'
        });
        flow.create(['Enter details', 'Confirm details', 'OTP'], 'Pay single beneficiary');
    });

    describe('confirm', function () {

        describe('save beneficiary', function () {
            var cardResponse = {
                "countryCode": "ZA",
                "number": 12345,
                "type": "0"
            };
            var newBeneficiary = {
                "accountNumber": "45640211",
                "bank": {
                    "branch": {
                        "code": "51001",
                        "name": "SINGL IBT SBSA"
                    },
                    "code": "051",
                    "name": "STANDARD BANK"
                },
                "beneficiaryType": "PRIVATE",
                "recentPayment": [],
                "customerReference": "me",
                "favourite": true,
                "name": "THEM",
                "paymentConfirmation": null,
                "recipientGroup": null,
                "recipientId": 3,
                "recipientReference": "not me"
            };
            var addBeneficiaryResponse = {
                "beneficiaries": [newBeneficiary],
                "contacts": [],
                "keyValueMetadata": [],
                "stepUp": null
            };
            var payBeneficiaryResponse = {
                "account": [
                    {
                        "accountFeature": [],
                        "accountType": "UNKNOWN",
                        "arrearStatus": false,
                        "availableBalance": {
                            "amount": 8756.34,
                            "currency": "ZAR"
                        },
                        "branch": {
                            "code": "27",
                            "name": "                    "
                        },
                        "card": {
                            "countryCode": null,
                            "number": "4451221116405778",
                            "type": null
                        },
                        "creditLimit": null,
                        "currentBalance": {"amount": 8756.34},
                        "customName": "",
                        "disposalAccount": "",
                        "errorIndicator": false,
                        "formattedNumber": "10-00-035-814-0",
                        "goal": {
                            "amount": {"amount": 0, "currency": "ZAR"},
                            "name": "",
                            "targetDate": null
                        },
                        "holderName": null,
                        "interestRate": null,
                        "keyValueMetadata": [
                            {
                                "key": "BDS_ACCOUNT_TYPE_CODE",
                                "value": "000"
                            },
                            {
                                "key": "BDS_ACCOUNT_TYPE",
                                "value": "UNKNOWN"
                            },
                            {
                                "key": "ACCOUNT_SUITE_ID",
                                "value": "SP"
                            },
                            {
                                "key": "SOURCE_SYSTEM_ACCOUNT_TYPE_CODE",
                                "value": "000"
                            }
                        ],
                        "maturityDate": null,
                        "minimumPaymentDue": null,
                        "minimumPaymentDueDate": null,
                        "name": "   ",
                        "nextInterestDue": {"amount": 0},
                        "nextInterestDueDate": null,
                        "noticeAmount": null,
                        "noticeDate": null,
                        "noticeTerm": null,
                        "number": "10000358140",
                        "openedDate": null,
                        "overdraftAmount": {"amount": 0},
                        "overdraftBalance": {"amount": 0},
                        "primary": false,
                        "productName": "   ",
                        "remainingTerm": null,
                        "serialNumber": 0,
                        "totalInterestEarned": null,
                        "totalLoanAmount": null,
                        "unclearedAmount": {"amount": 0}
                    }
                ],
                "cardProfile": {
                    "card": null,
                    "combinedName": null,
                    "dailyWithdrawalLimit": {"amount": 10000, "currency": "ZAR"},
                    "holderName": "T TEST",
                    "initials": null,
                    "monthlyEAPLimit": {"amount": 10000, "currency": "ZAR"},
                    "monthlyWithdrawalLimit": {"amount": 10000, "currency": "ZAR"},
                    "usedEAPLimit": {"amount": 7.66, "currency": "ZAR"}
                },
                "transactionResults": [
                    {
                        "responseCode": {
                            "code": "0000",
                            "message": "Your payment has been completed successfully",
                            "responseType": "SUCCESS"
                        },
                        "transactionId": "1234567890",
                        "transactionResultMetaData": []
                    }
                ],
                "keyValueMetadata": [],
                "stepUp": null
            };

            beforeEach(function () {
                onceOffPaymentModel.setSaveAsBeneficiary( true);
                card.current.and.returnValue(cardResponse);
            });

            describe('when adding beneficiary succeeds', function () {
                beforeEach(function () {
                    beneficiariesService.addOrUpdate.and.returnValue(mock.resolve({data: addBeneficiaryResponse}));
                });

                describe('when paying beneficiary succeeds', function () {
                    it('should navigate to success page', function () {
                        beneficiaryPaymentService.payBeneficiary.and.returnValue(mock.resolve(payBeneficiaryResponse));
                        onceOffPaymentModel.setSaveAsBeneficiary( true);

                        var expectedBeneficiary = _.cloneDeep(scope.onceOffPaymentModel.beneficiary );
                        delete expectedBeneficiary.recipientId;

                        scope.confirm();
                        scope.$digest();

                        expect(beneficiariesService.addOrUpdate).toHaveBeenCalledWith(expectedBeneficiary, cardResponse);
                        expect(beneficiaryPaymentService.payBeneficiary).toHaveBeenCalledWith(
                            {
                                account: scope.onceOffPaymentModel.account,
                                amount: scope.onceOffPaymentModel.amount,
                                beneficiary: addBeneficiaryResponse.beneficiaries[0],
                                date: moment(scope.latestTimestampFromServer).format("DD MMMM YYYY")
                            }
                        );

                        expect(scope.onceOffPaymentModel.isSuccessful).toBeTruthy();
                        expect(scope.onceOffPaymentModel.beneficiaryAdded).toBeTruthy();
                        expect(location.path).toHaveBeenCalledWith('/payment/onceoff/success');
                        expect(scope.onceOffPaymentModel.errorMessage).toBeNull();
                    });
                });

                describe('when paying beneficiary fails', function () {
                    it('should go back to details with error message', function () {
                        beneficiaryPaymentService.payBeneficiary.and.returnValue(mock.reject({message: 'fail'}));
                        var expectedBeneficiary = _.cloneDeep(scope.onceOffPaymentModel.beneficiary );
                        delete expectedBeneficiary.recipientId;

                        scope.confirm();
                        scope.$digest();

                        expect(beneficiariesService.addOrUpdate).toHaveBeenCalledWith(expectedBeneficiary, cardResponse);
                        expect(beneficiaryPaymentService.payBeneficiary).toHaveBeenCalledWith(
                            {
                                account: scope.onceOffPaymentModel.account,
                                amount: scope.onceOffPaymentModel.amount,
                                beneficiary: addBeneficiaryResponse.beneficiaries[0],
                                date: moment(scope.latestTimestampFromServer).format("DD MMMM YYYY")
                            }
                        );

                        expect(scope.onceOffPaymentModel.beneficiaryAdded ).toBeTruthy();
                        expect(scope.onceOffPaymentModel.isSuccessful).toBeFalsy();
                        expect(location.path).toHaveBeenCalledWith('/payment/onceoff');
                        expect(scope.onceOffPaymentModel.errorMessage ).toEqual('Could not process payment: We are experiencing technical problems. Please try again later');
                    });
                });
            });

            describe('when adding beneficiary fails', function () {
                it('should not make the payment and go back to details page with error message', function () {
                    beneficiariesService.addOrUpdate.and.returnValue(mock.reject({message: 'error message adding beneficiary'}));
                    var expectedBeneficiary = _.cloneDeep(scope.onceOffPaymentModel.beneficiary );
                    delete expectedBeneficiary.recipientId;

                    scope.confirm();
                    scope.$digest();

                    expect(beneficiariesService.addOrUpdate).toHaveBeenCalledWith(expectedBeneficiary, cardResponse);
                    expect(beneficiaryPaymentService.payBeneficiary).not.toHaveBeenCalled();

                    expect(scope.beneficiaryAdded).toBeFalsy();
                    expect(scope.onceOffPaymentModel.isSuccessful ).toBeFalsy();
                    expect(location.path).toHaveBeenCalledWith('/payment/onceoff');
                    expect(scope.onceOffPaymentModel.errorMessage ).toEqual('There was a problem with the beneficiary details entered. The beneficiary was not saved and payment was unsuccessful');
                });
            });

            describe('when trying add and pay beneficiary fails due to OTP being locked', function () {
                it('should not make the payment and go back to details page with OTP locked error message', function () {
                    beneficiariesService.addOrUpdate.and.returnValue(mock.reject({message: 'Your OTP service has been locked. Please call Customer Care on 0860 123 000'}));
                    var expectedBeneficiary = _.cloneDeep(scope.onceOffPaymentModel.beneficiary );
                    delete expectedBeneficiary.recipientId;

                    scope.confirm();
                    scope.$digest();

                    expect(beneficiariesService.addOrUpdate).toHaveBeenCalledWith(expectedBeneficiary, cardResponse);
                    expect(beneficiaryPaymentService.payBeneficiary).not.toHaveBeenCalled();

                    expect(scope.onceOffPaymentModel.beneficiaryAdded).toBeFalsy();
                    expect(scope.onceOffPaymentModel.isSuccessful).toBeFalsy();
                    expect(location.path).toHaveBeenCalledWith('/payment/onceoff');
                    expect(scope.onceOffPaymentModel.errorMessage).toEqual('Your OTP service has been locked. Please call Customer Care on 0860 123 000');
                });
            });
        });

        it('should know the current step is the last step and the other two steps have been completed when success', function () {
            expectedSteps[0].current = false;
            expectedSteps[0].complete = true;

            expectedSteps[1].current = false;
            expectedSteps[1].complete = true;

            expectedSteps[2].current = true;
            expectedSteps[2].complete = false;

            paymentService.payPrivateBeneficiaryOnceOff.and.returnValue(mock.response({
                "transactionResults": [
                    {
                        "responseCode": {
                            "code": "0000",
                            "responseType": "SUCCESS",
                            "message": "Your payment has been completed successfully"
                        }
                    }
                ]
            }));
            scope.confirm();
            scope.$digest();

            expect(flow.get().steps).toEqual(expectedSteps);
        });

        it('should respond with a success from the service if there is a warning', function () {

            paymentService.payPrivateBeneficiaryOnceOff.and.returnValue(mock.resolve(
                {
                    isWarning: true
                }
            ));

            scope.confirm();
            scope.$digest();

            expect(scope.onceOffPaymentModel.isSuccessful).toBeTruthy();
            expect(scope.onceOffPaymentModel.errorMessage ).toEqual('Your notification could not be delivered because the email address was invalid');
        });

        it('should know the current step is the first step when error', function () {
            expectedSteps[0].current = true;
            expectedSteps[0].complete = false;

            expectedSteps[1].current = false;
            expectedSteps[1].complete = false;
            paymentService.payPrivateBeneficiaryOnceOff.and.returnValue(mock.response({something: "else"}, 500));
            scope.confirm();
            scope.$digest();

            expect(flow.get().steps).toEqual(expectedSteps);
        });

        describe('upon failure', function () {

            it('http error status', function () {
                paymentService.payPrivateBeneficiaryOnceOff.and.returnValue(mock.reject({message: undefined}, 500));
                scope.confirm();
                scope.$digest();

                expect(location.path).toHaveBeenCalledWith('/payment/onceoff');
                expect(scope.onceOffPaymentModel.errorMessage ).toBeTruthy();
                expect(scope.onceOffPaymentModel.account.availableBalance.amount).toEqual(9000.0);
                expect(scope.onceOffPaymentModel.cardProfile.usedEAPLimit).toEqual(2000);
                expect(paymentService.payPrivateBeneficiaryOnceOff).toHaveBeenCalledWith(scope.onceOffPaymentModel.beneficiary, scope.onceOffPaymentModel.account, scope.onceOffPaymentModel.amount);
            });

            it('application error', function () {
                paymentService.payPrivateBeneficiaryOnceOff.and.returnValue(mock.reject({
                    "transactionResults": [
                        {
                            "responseCode": {
                                "code": null,
                                "responseType": "ERROR",
                                "message": "Something bad"
                            }
                        }
                    ]
                }, 200));
                scope.confirm();
                scope.$digest();

                expect(location.path).toHaveBeenCalledWith('/payment/onceoff');
                expect(scope.onceOffPaymentModel.errorMessage ).toBeTruthy();
                expect(scope.onceOffPaymentModel.account.availableBalance.amount).toEqual(9000.0);
                expect(scope.onceOffPaymentModel.cardProfile.usedEAPLimit).toEqual(2000);
            });

            it('non-0000 response code', function () {
                paymentService.payPrivateBeneficiaryOnceOff.and.returnValue(mock.reject({
                    "transactionResults": [
                        {
                            "responseCode": {
                                "code": "1234",
                                "responseType": "something",
                                "message": undefined
                            }
                        }
                    ]
                }, 200));
                scope.confirm();
                scope.$digest();

                expect(location.path).toHaveBeenCalledWith('/payment/onceoff');
                expect(scope.onceOffPaymentModel.errorMessage ).toBeTruthy();
                expect(scope.onceOffPaymentModel.account.availableBalance.amount).toEqual(9000.0);
                expect(scope.onceOffPaymentModel.cardProfile.usedEAPLimit).toEqual(2000);
            });

            it('should set the previous payment confirmation state on the scope when there is an error and yes option was selected', function () {
                paymentService.payPrivateBeneficiaryOnceOff.and.returnValue(mock.reject({
                    "transactionResults": [
                        {
                            "responseCode": {
                                "code": null,
                                "responseType": "ERROR",
                                "message": "Something bad"
                            }
                        }
                    ]
                }, 200));
                onceOffPaymentModel.setPaymentConfirmation( true);
                scope.confirm();
                scope.$digest();

                expect(scope.onceOffPaymentModel.paymentConfirmation).toBeTruthy();
            });

            it('should set the previous payment confirmation state on the scope when there is an error and no option was selected', function () {
                paymentService.payPrivateBeneficiaryOnceOff.and.returnValue(mock.reject({
                    "transactionResults": [
                        {
                            "responseCode": {
                                "code": null,
                                "responseType": "ERROR",
                                "message": "Something bad"
                            }
                        }
                    ]
                }, 200));
                onceOffPaymentModel.setPaymentConfirmation( false);
                scope.confirm();
                scope.$digest();

                expect(scope.onceOffPaymentModel.paymentConfirmation ).not.toBeUndefined();
                expect(scope.onceOffPaymentModel.paymentConfirmation ).toBeFalsy();
            });
        });

        describe('once off payment of a listed beneficiary', function () {
            it('should transform the beneficiary into a listed beneficiary once off payment request', function () {
                var listedBeneficiary = {name: 'Ari', number: 123};
                onceOffPaymentModel.setListedBeneficiary( listedBeneficiary);
                paymentService.payPrivateBeneficiaryOnceOff.and.returnValue(mock.response({something: "else"}, 200));
                scope.confirm();
                scope.$digest();

                expect(scope.onceOffPaymentModel.beneficiary.beneficiaryType).toEqual("COMPANY");
                expect(scope.onceOffPaymentModel.beneficiary.name).toEqual(listedBeneficiary.name);
                expect(scope.onceOffPaymentModel.beneficiary.accountNumber).toEqual(listedBeneficiary.number);
            });
        });
    });

    describe('modify', function () {
        beforeEach(function () {
            flow.create(['Enter details', 'Confirm details', 'OTP'], 'Pay single beneficiary');
            flow.next();
            scope.modify();
        });

        it('should know the flow steps and state of the steps with the first step as current', function () {
            var steps = flow.get().steps;
            expect(steps).toEqual(expectedSteps);
        });
    });

});
