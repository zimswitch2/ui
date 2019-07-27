describe('beneficiary list service', function () {
    beforeEach(module('refresh.beneficiaries.beneficiariesListService', 'refresh.beneficiaries'));
    var service, card, test;

    var beneficiaries = [
        {
            recipientId: "1",
            name: "Test",
            accountNumber: "211",
            recipientReference: "Test",
            customerReference: "Test",
            recentPayment: [
                {date: "2014-02-03", amount: {amount: 0}}
            ],
            bank: {
                name: "Standard Bank",
                code: "051",
                branch: {
                    code: 20091600,
                    name: "DURBAN CENTRAL FOREX OPS"
                }
            },
            paymentConfirmation: {
                address: "address",
                confirmationType: "confirmationType",
                recipientName: "recipientName",
                sendFutureDated: "sendFutureDated"
            },
            recipientGroup: {
                'name': 'Group 1',
                'oldName': null,
                'orderIndex': "1"
            },
            beneficiaryType: 'PRIVATE'
        },
        {
            recipientId: "2",
            name: "Test2",
            accountNumber: "211",
            recipientReference: "Test",
            customerReference: "Test",
            recentPayment: [
                {date: "2014-02-03", amount: {amount: 10}}
            ],
            bank: {
                name: "Standard Bank",
                code: "051",
                branch: {
                    code: 20091600,
                    name: "DURBAN CENTRAL FOREX OPS"
                }
            },
            paymentConfirmation: {
                address: "address",
                confirmationType: "confirmationType",
                recipientName: "recipientName",
                sendFutureDated: "sendFutureDated"
            },
            recipientGroup: null,
            beneficiaryType: 'PRIVATE'
        },
        {
            recipientId: "3",
            name: "Test3",
            accountNumber: "2112",
            recipientReference: "Test",
            customerReference: "Test",
            recentPayment: [],
            bank: {
                name: "Standard Bank",
                code: "051",
                branch: {
                    code: 20091600,
                    name: "DURBAN CENTRAL FOREX OPS"
                }
            },
            paymentConfirmation: {
                address: "user@standardbank.co.za",
                confirmationType: "email",
                recipientName: "ben",
                sendFutureDated: null
            },
            recipientGroup: null,
            beneficiaryType: 'PRIVATE'
        }

    ];

    var expectedFormattedBeneficiaries = [
        {
            recipientId: '1',
            name: 'Test',
            accountNumber: '211',
            recipientReference: 'Test',
            customerReference: 'Test',
            lastPaymentDate: "",
            recentPayment: [],
            formattedLastPaymentDate: undefined,
            bank: {
                name: "Standard Bank",
                code: "051",
                branch: {
                    code: 20091600,
                    name: "DURBAN CENTRAL FOREX OPS"
                }
            },
            paymentConfirmation: {
                address: "address",
                confirmationType: "confirmationType",
                recipientName: "recipientName",
                sendFutureDated: "sendFutureDated"
            },
            amountPaid: 0,
            recipientGroupName: 'Group 1',
            canSelect: false,
            originalBeneficiary: beneficiaries[0],
            selectedClass: "",
            beneficiaryType: 'PRIVATE'
        },
        {
            recipientId: '2',
            name: 'Test2',
            accountNumber: '211',
            recipientReference: 'Test',
            customerReference: 'Test',
            lastPaymentDate: "2014-02-03",
            recentPayment: [
                {date: "2014-02-03", amount: {amount: 10}}
            ],
            formattedLastPaymentDate: '3 February 2014',
            bank: {
                name: "Standard Bank",
                code: "051",
                branch: {
                    code: 20091600,
                    name: "DURBAN CENTRAL FOREX OPS"
                }
            },
            paymentConfirmation: {
                address: "address",
                confirmationType: "confirmationType",
                recipientName: "recipientName",
                sendFutureDated: "sendFutureDated"
            },
            amountPaid: 10,
            recipientGroupName: "",
            canSelect: true,
            originalBeneficiary: beneficiaries[1],
            selectedClass: "",
            beneficiaryType: 'PRIVATE'
        },
        {
            recipientId: '3',
            name: 'Test3',
            accountNumber: '2112',
            recipientReference: 'Test',
            customerReference: 'Test',
            lastPaymentDate: "",
            recentPayment: [],
            formattedLastPaymentDate: undefined,
            bank: {
                name: "Standard Bank",
                code: "051",
                branch: {
                    code: 20091600,
                    name: "DURBAN CENTRAL FOREX OPS"
                }
            },
            paymentConfirmation: {
                address: "user@standardbank.co.za",
                confirmationType: "email",
                recipientName: "ben",
                sendFutureDated: null
            },
            amountPaid: undefined,
            recipientGroupName: "",
            canSelect: true,
            originalBeneficiary: beneficiaries[2],
            selectedClass: "",
            beneficiaryType: 'PRIVATE'
        }
    ];

    beforeEach(inject(function (BeneficiariesListService, _ServiceTest_) {
        test = _ServiceTest_;
        test.spyOnEndpoint('listBeneficiary');
        service = BeneficiariesListService;
        card = {'number': '12345', 'countryCode': 'ZA', 'type': "0"};
    }));

    it('should know the lists of formatted beneficiaries', function (done) {
        test.stubResponse('listBeneficiary', 200, {beneficiaries: beneficiaries});
        service.formattedBeneficiaryList(card).then(function (beneficiaryList) {
            expect(beneficiaryList).toEqual(expectedFormattedBeneficiaries);
            expect(test.endpoint('listBeneficiary')).toHaveBeenCalled();
            done();
        });
        test.resolvePromise();
    });

    describe('list cache', function () {
        var cacheFactory;
        beforeEach(inject(function (_DSCacheFactory_) {
            cacheFactory = _DSCacheFactory_;
        }));
        it('should not populate the cache with the list of beneficiaries if the call fails', function (done) {
            test.stubResponse('listBeneficiary', 500, {beneficiaries: beneficiaries});
            var listPromise = service.formattedBeneficiaryList(card);
            listPromise.then(function (data) {
            }, function (error) {
                expect(error.status).toEqual(500);
                done();
            });
            test.resolvePromise();
        });

        it('should load data from the cache if we have it', function (done) {
            test.stubResponse('listBeneficiary', 200, {beneficiaries: beneficiaries});
            service.formattedBeneficiaryList(card).then(function () {
                var listPromise = service.formattedBeneficiaryList(card);
                listPromise.then(function (data) {
                    expect(data).toEqual(expectedFormattedBeneficiaries);
                    expect(test.endpoint('listBeneficiary').calls.count()).toEqual(1);
                    done();
                });
            });
            test.resolvePromise();
        });

        it('should load the beneficiaries from the service if not in the cache', function (done) {
            test.stubResponse('listBeneficiary', 200, {beneficiaries: beneficiaries});
            service.formattedBeneficiaryList(card).then(function () {
                service.clear();
                var listPromise = service.formattedBeneficiaryList(card);
                listPromise.then(function (data) {
                    expect(data).toEqual(expectedFormattedBeneficiaries);
                    expect(test.endpoint('listBeneficiary').calls.count()).toEqual(2);
                    done();
                });
            });
            test.resolvePromise();
        });
    });

    describe('beneficiary validation', function(){

        it('should return true if beneficiary is still valid', function () {
            test.stubResponse('listBeneficiary', 200, {beneficiaries: beneficiaries});

            service.isBeneficiaryValid(card, "1")
                .then(function(isValid){
                    expect(isValid).toBeTruthy();
                });

            test.resolvePromise();
        });

        it('should return true if beneficiary is still valid', function () {
            test.stubResponse('listBeneficiary', 200, {beneficiaries: beneficiaries});

            service.isBeneficiaryValid(card, "7")
                .then(function(isValid){
                    expect(isValid).toBeFalsy();
                });

            test.resolvePromise();
        });
    });
});


