describe('OnceOffPaymentSuccessController', function () {

    beforeEach(module('refresh.onceOffPayment', 'refresh.test', 'refresh.configuration', 'refresh.navigation', 'refresh.fixture'));

    var scope, accountsService, paymentService, mock, card, flow, location, expectedSteps, bankService, cdiService, windowSpy, onceOffPaymentModel;

    var banks = [
        {
            "name": "Standard Bank",
            "code": "051"
        },
        {
            "name": "ABSA",
            "code": "089"
        }
    ];

    var branches = [
        {
            "code": 20091600,
            "name": "DURBAN CENTRAL FOREX OPS"
        }
    ];

    var wooliesInTheCdi;
    var listedBeneficiaryThatCannotBeAdded;

    wooliesInTheCdi = {name: "woolies", number: "12345"};
    listedBeneficiaryThatCannotBeAdded = {name: "will not work", number: '808080'};

    var rootScope, controller;

    beforeEach(inject(function ($rootScope, $controller, _mock_, Flow, OnceOffPaymentModel) {
        rootScope = $rootScope;
        scope = rootScope.$new();
        accountsService = jasmine.createSpyObj('accountsService', ['list', 'validFromPaymentAccounts']);
        paymentService = jasmine.createSpyObj('onceOffPaymentService', ['payPrivateBeneficiaryOnceOff']);
        card = jasmine.createSpyObj('card', ['current']);
        location = jasmine.createSpyObj('location', ['path']);
        mock = _mock_;
        flow = Flow;
        onceOffPaymentModel = OnceOffPaymentModel;
        bankService = jasmine.createSpyObj('bankService', ['list', 'searchBranches']);
        cdiService = jasmine.createSpyObj('cdiService', ['list']);
        bankService.list.and.returnValue(mock.resolve(banks));
        bankService.searchBranches.and.returnValue(mock.resolve(branches));
        cdiService.list.and.returnValue(mock.resolve([wooliesInTheCdi, listedBeneficiaryThatCannotBeAdded]));
        windowSpy = jasmine.createSpyObj('$window', ['print']);

        expectedSteps = [
            {name: 'Enter details', complete: false, current: true},
            {name: 'Confirm details', complete: false, current: false},
            {name: 'OTP', complete: false, current: false}
        ];

        controller = $controller;
    }));

    describe('upon success', function () {
        var account, cardProfile, model;

        beforeEach(function () {
            account = {
                "formattedNumber": "542312312",
                "availableBalance": {
                    "amount": 10000,
                    "currency": "ZAR"
                }
            };
            cardProfile = {
                "monthlyEAPLimit": { "amount": 10000},
                "monthlyWithdrawalLimit": { "amount": 10000},
                "usedEAPLimit": { "amount": 2000}
            };
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

        });

        function setupModel(paymentConfirmation) {
            onceOffPaymentModel.initialise();
            model = onceOffPaymentModel.getOnceOffPaymentModel();
            model.beneficiary.nae = 'Someone';
            model.beneficiary.accountNumber = '12345';
            onceOffPaymentModel.setPaymentConfirmation( paymentConfirmation);
            onceOffPaymentModel.setAccount( account);
            onceOffPaymentModel.setCardProfile( cardProfile);
            onceOffPaymentModel.setAmount( 123.45);
            model = _.cloneDeep(onceOffPaymentModel.getOnceOffPaymentModel() );
        }
        function setupController() {
            controller('OnceOffPaymentSuccessController', {
                $scope: scope,
                AccountsService: accountsService,
                OnceOffPaymentService: paymentService,
                $location: location,
                Card: card,
                BankService: bankService,
                CdiService: cdiService,
                $window: windowSpy,
                OnceOffPaymentModel: onceOffPaymentModel
            });
        }

        it('should load the payment flow parameter when it exists and the state is  "done" ', function () {
            setupModel(undefined);
            setupController();
            expect(scope.onceOffPaymentModel.beneficiary).toEqual(model.beneficiary);
        });

        it('should set Date to current date', function () {
            var now = moment('2014-11-22');
            var clock = sinon.useFakeTimers(now.toDate().getTime());
            setupModel(false);
            setupController();
            expect(scope.statementDate.isSame(now)).toBeTruthy();
            clock.restore();
        });

        describe("default controller state", function () {

            beforeEach(function () {
                setupModel(false);
                setupController();
            });

            it('should update the available balance and the monthly limit used', function () {
                expect(scope.onceOffPaymentModel.account.availableBalance.amount).toEqual(10000.0 - 123.45);
                expect(onceOffPaymentModel.getAvailableEAPLimit() ).toEqual(8000.0 - 123.45);
                expect(scope.onceOffPaymentModel.cardProfile.usedEAPLimit.amount).toEqual(2000 + 123.45);
            });

            it('should return to the transaction dashboard when transaction is done', function () {
                scope.done();
                expect(location.path).toHaveBeenCalledWith('/transaction/dashboard');
            });
        });
    });
});
