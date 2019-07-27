describe('Multiple Payments Service', function () {
    beforeEach(module('refresh.multiplePaymentsService', 'refresh.beneficiaries.beneficiariesListService','refresh.test', 'refresh.configuration', 'refresh.navigation', 'refresh.fixture'));

    var accountsService, listService, paymentService;
    beforeEach(function () {
        accountsService = jasmine.createSpyObj('accounts', ['clear']);
        listService = jasmine.createSpyObj('beneficiariesList', ['clear']);
        paymentService = jasmine.createSpyObj('payment', ['pay']);
        module(function ($provide) {
            $provide.value('AccountsService', accountsService);
            $provide.value('BeneficiariesListService', listService);
            $provide.value('PaymentService', paymentService);
        });
    });

    var service, url, beneficiary, mocker, test;
    var accounts = [
        {
            "accountFeature": [
                {
                    "feature": "PAYMENTFROM",
                    "value": true
                }
            ],
            "formattedNumber": "12-34-567-890-0",
            "availableBalance": 9000.0,
            accountType: "CURRENT"
        },
        {
            "accountFeature": [
                {
                    "feature": "PAYMENTFROM",
                    "value": true
                }
            ],
            "formattedNumber": "1234-1234-1234-1234",
            "availableBalance": 10000.0,
            accountType: "CREDIT_CARD"
        },
        {
            "accountFeature": [
                {
                    "feature": "PAYMENTFROM",
                    "value": false
                }
            ],
            "formattedNumber": "1234-1234-1234-1234",
            "availableBalance": 10000.0,
            accountType: "HOME_LOAN"
        }
    ];

    beforeEach(inject(function (ServiceTest, _MultiplePaymentsService_, _URL_, mock) {
        test = ServiceTest;
        service = _MultiplePaymentsService_;
        url = _URL_;
        beneficiary = {};
        mocker = mock;
    }));

    it('should invoke the payment service and clear related caches', function () {
        service.payMultipleBeneficiaries('beneficiary', 'account');
        test.resolvePromise();

        expect(accountsService.clear).toHaveBeenCalled();
        expect(listService.clear).toHaveBeenCalled();
    });

    it('should add beneficiary when amount is more than zero', function () {
        var beneficiary = {recipientId: 19, name: 'Beneficiary'};
        var amounts = { 19: '100' };
        service.updatePayments(beneficiary, amounts);
        expect(service.selectedPayments()).toEqual([
            {beneficiary: beneficiary, amount: 100}
        ]);
    });

    it('should not allow duplicates in selected payments', function () {
        var beneficiary = {recipientId: 19, name: 'Beneficiary'};
        var amounts = { 19: '100' };
        service.updatePayments(beneficiary, amounts);
        amounts = { 19: '180' };
        service.updatePayments(beneficiary, amounts);
        expect(service.selectedPayments()).toEqual([
            {beneficiary: beneficiary, amount: 180}
        ]);
    });

    it('should not add beneficiary when amount is equal or less than zero', function () {
        var beneficiary = {recipientId: 19, name: 'Beneficiary'};
        var amounts = { 19: '0' };
        service.updatePayments(beneficiary, amounts);
        expect(service.selectedPayments()).toEqual([]);
    });

    it('should remove a beneficiary when the amount changes to zero', function () {
        var beneficiary = {recipientId: 19, name: 'Beneficiary'};
        var amounts = { 19: '100' };
        service.updatePayments(beneficiary, amounts);
        amounts = { 19: '0' };
        service.updatePayments(beneficiary, amounts);
        expect(service.selectedPayments()).toEqual([]);
    });

    it('should return amounts ', function () {
        var beneficiary = {recipientId: 19, name: 'Beneficiary'};
        var amounts = { 19: '0' };
        service.updatePayments(beneficiary, amounts);
        expect(service.amounts()).toEqual(amounts);
    });

    it('should return empty hash when amounts is undefined ', function () {
        expect(service.amounts()).toEqual({});
    });

    it('should return empty payment service data when no payments were added', function () {
        service.payMultipleBeneficiaries(accounts[0]);
        expect(service.paymentServiceData()).toEqual([]);
    });

    it('should return payment results on confirm', function () {
        var beneficiary = {
            recipientId: 19,
            name: 'Beneficiary',
            accountNumber: '12312312',
            recipientReference: 'sadf',
            customerReference: 'asdf',
            recentPayment: [],
            bank: {},
            paymentConfirmation: {},
            beneficiaryType: "PRIVATE"
        };
        var amounts = { 19: '100' };

        var transactionResults = [
            {
                transactionId: "19",
                responseCode: {
                    code: "0000",
                    responseType: "SUCCESS",
                    message: "Successful"
                }
            }
        ];

        var expectedResults = [
            {
                beneficiary: {
                    recipientId: 19,
                    name: 'Beneficiary',
                    accountNumber: '12312312',
                    recipientReference: 'sadf',
                    customerReference: 'asdf',
                    recentPayment: [],
                    bank: {},
                    paymentConfirmation: {},
                    beneficiaryType: "PRIVATE"
                },
                amount: 100,
                responseType: "SUCCESS",
                responseMessage: "Successful",
                hasConfirmationWarning: false,
                confirmationWarningMessage: undefined
            }
        ];

        service.updatePayments(beneficiary, amounts);
        service.confirm(transactionResults);
        expect(service.paymentResults()).toEqual(expectedResults);
    });

    it('should set success notification when one of the payments has a warning on confirmation', function () {
        var beneficiary = {
            recipientId: 19,
            name: 'Beneficiary',
            accountNumber: '12312312',
            recipientReference: 'sadf',
            customerReference: 'asdf',
            recentPayment: [],
            bank: {},
            paymentConfirmation: {

                address:'some invalid email address'
            },
            beneficiaryType: "PRIVATE"
        };
        var amounts = { 19: '100' };

        var transactionResults = [
            {
                transactionId: "19",
                responseCode: {
                    code: "2299",
                    responseType: "WARNING",
                    message: "Payment successful but confirmation failed"
                }
            }
        ];

        var expectedResults = [
            {
                beneficiary: {
                    recipientId: 19,
                    name: 'Beneficiary',
                    accountNumber: '12312312',
                    recipientReference: 'sadf',
                    customerReference: 'asdf',
                    recentPayment: [],
                    bank: {},
                    paymentConfirmation: {
                        address:'some invalid email address'
                    },
                    beneficiaryType: "PRIVATE"
                },
                amount: 100,
                responseType: "SUCCESS",
                responseMessage: "Successful",
                hasConfirmationWarning: true,
                confirmationWarningMessage: "Invalid email entered"
            }
        ];

        service.updatePayments(beneficiary, amounts);
        service.updatePayments(beneficiary, amounts);
        service.confirm(transactionResults);
        expect(service.paymentResults()).toEqual(expectedResults);

    });

    it('should return message on unknow code results on confirm', function () {
        var beneficiary = {
            recipientId: 19,
            name: 'Beneficiary',
            accountNumber: '12312312',
            recipientReference: 'sadf',
            customerReference: 'asdf',
            recentPayment: [],
            bank: {},
            paymentConfirmation: {},
            beneficiaryType: "PRIVATE"
        };
        var amounts = { 19: '100' };

        var transactionResults = [
            {
                transactionId: "19",
                responseCode: {
                    code: "0012",
                    message: 'Unknow Message',
                    responseType: "Unknow"
                }
            }
        ];

        var expectedResults = [
            {
                beneficiary: {
                    recipientId: 19,
                    name: 'Beneficiary',
                    accountNumber: '12312312',
                    recipientReference: 'sadf',
                    customerReference: 'asdf',
                    recentPayment: [],
                    bank: {},
                    paymentConfirmation: {},
                    beneficiaryType: "PRIVATE"
                },
                amount: 100,
                responseType: "Unknow",
                responseMessage: "Unknow Message",
                hasConfirmationWarning: false,
                confirmationWarningMessage: undefined
            }
        ];

        service.updatePayments(beneficiary, amounts);
        service.confirm(transactionResults);
        expect(service.paymentResults()).toEqual(expectedResults);
    });

    it('should return payment service data', function () {
        var beneficiary = {
            recipientId: 19,
            name: 'Beneficiary',
            accountNumber: '12312312',
            recipientReference: 'sadf',
            customerReference: 'asdf',
            recentPayment: [],
            bank: {},
            paymentConfirmation: {},
            beneficiaryType: "PRIVATE"
        };
        var amounts = { 19: '100' };
        var expectedBeneficiary = [
            {
                transactionId: 19,
                amount: {amount: 100, currency: "ZAR"},
                beneficiary: {
                    recipientId: beneficiary.recipientId,
                    name: beneficiary.name,
                    accountNumber: beneficiary.accountNumber,
                    recipientReference: beneficiary.recipientReference,
                    customerReference: beneficiary.customerReference,
                    recentPayment: beneficiary.recentPayment,
                    bank: beneficiary.bank,
                    paymentConfirmation: beneficiary.paymentConfirmation,
                    beneficiaryType: "PRIVATE"
                }
            }
        ];
        service.updatePayments(beneficiary, amounts);
        service.payMultipleBeneficiaries(accounts[0]);
        expect(service.paymentServiceData()).toEqual(expectedBeneficiary);
    });

    it('should reset selected payments', function () {
        var beneficiary = {recipientId: 19, name: 'Beneficiary'};
        var amounts = { 19: '100' };
        var transactionResults = [
            {
                transactionId: "19",
                responseCode: {
                    code: "0000",
                    responseType: "SUCCESS",
                    message: "Successful"
                }
            }
        ];
        service.updatePayments(beneficiary, amounts);
        service.confirm(transactionResults);
        service.reset();
        expect(service.selectedPayments()).toEqual([]);
        expect(service.paymentResults()).toEqual([]);
        expect(service.amounts()).toEqual({});
    });

    it('should have a default value for get from account', function () {
        expect(service.getFromAccount(accounts)).toEqual(accounts[0]);
    });

    it('should update From account', function () {
        service.updateFromAccount(accounts[1]);
        expect(service.getFromAccount(accounts)).toEqual(accounts[1]);
    });

    it('should update the amount total', function () {
        var amounts = { 19: '100', 20: '500', 88: '200' };
        var beneficiary = {recipientId: 19, name: 'Beneficiary'};

        service.updatePayments(beneficiary, amounts);
        expect(service.totalAmount()).toEqual(800);
    });

    it('should have zero as a value for the amount total', function () {
        expect(service.totalAmount()).toEqual(0);
    });
});