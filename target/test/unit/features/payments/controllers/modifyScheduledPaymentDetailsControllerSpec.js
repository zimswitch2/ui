describe('modify scheduled payment details', function () {
    'use strict';

    beforeEach(module('refresh.payment.future.controllers.modify.details'));

    var scope, controller, mock, beneficiariesListService, accountsService, flow, applicationParameters, viewModel, card, location, limitsService, path;
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
            name: "CURRENT"
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
            name: "CREDIT_CARD"
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
            name: "HOME_LOAN"
        }
    ];

    beforeEach(inject(function ($rootScope, $controller, _mock_, Flow, ApplicationParameters, ViewModel, LimitsService) {
        scope = $rootScope;
        controller = $controller;
        mock = _mock_;
        flow = Flow;
        applicationParameters = ApplicationParameters;
        viewModel = ViewModel;
        limitsService = LimitsService;

        path = jasmine.createSpyObj('path', ['replace']);
        location = jasmine.createSpyObj('$location', ['path']);
        location.path.and.returnValue(path);

        accountsService = jasmine.createSpyObj('AccountsService', ['list', 'validFromPaymentAccounts']);
        beneficiariesListService = jasmine.createSpyObj('BeneficiariesListService', ['formattedBeneficiaryList']);
        beneficiariesListService.formattedBeneficiaryList.and.returnValue(mock.resolve(
            [
                {recipientId: 'someRecipientId', vlaue: 'someValue'}
            ]
        ));

        card = jasmine.createSpyObj('Card', ['current']);
        card.current.and.returnValue(mock.resolve({}));
        accountsService.list.and.returnValue(mock.resolve({
            "accounts": accounts,
            "cardProfile": {
                "monthlyEAPLimit": {"amount": 10000, "currency": "ZAR"},
                "monthlyWithdrawalLimit": {"amount": 10000, "currency": "ZAR"},
                "usedEAPLimit": {"amount": 2000, "currency": "ZAR"}
            }
        }));
        accountsService.validFromPaymentAccounts.and.returnValue([accounts[0], accounts[1]]);

        var model = {futureTransaction: {futureDatedInstruction: {repeatInterval: 'Daily'}}};
        viewModel.current(model);
        viewModel.modifying();
    }));

    var initializeController = function () {
        controller('ModifyScheduledPaymentDetailsController', {
            $scope: scope,
            $location: location,
            Flow: flow,
            ViewModel: viewModel,
            BeneficiariesListService: beneficiariesListService,
            AccountsService: accountsService,
            Card: card,
            ApplicationParameters: applicationParameters,
            LimitsService: limitsService
        });
        scope.$digest();
    };

    describe('is recurring payment', function () {
        describe('when repeat interval is single', function () {
            it('should be false', function () {
                var model = {
                    scheduledPayment: {futureTransaction: {futureDatedInstruction: {repeatInterval: 'Single'}}},
                    paymentDetail: new PaymentDetail({repeatInterval: 'Single'})
                };
                viewModel.current(model);
                viewModel.modifying();
                initializeController();
                expect(scope.isRecurringPayment).toBeFalsy();
            });
        });

        describe('when repeat interval is daily', function () {
            it('should be true', function () {
                var model = {
                    scheduledPayment: {futureTransaction: {futureDatedInstruction: {repeatInterval: 'Daily'}}},
                    paymentDetail: new PaymentDetail({repeatInterval: 'Daily'})
                };
                viewModel.current(model);
                viewModel.modifying();
                initializeController();
                expect(scope.isRecurringPayment).toBeTruthy();
            });
        });
    });

    describe('latest timestamp from server', function () {
        it('should set from application parameter', function () {
            var model = {
                scheduledPayment: {
                    amount: {amount: 10},
                    futureTransaction: {futureDatedInstruction: {repeatInterval: 'Daily'}}
                }, paymentDetail: new PaymentDetail({repeatInterval: 'Daily'})
            };
            viewModel.current(model);
            viewModel.modifying();
            applicationParameters.pushVariable('latestTimestampFromServer', moment('12 March 2014'));
            initializeController();
            expect(scope.latestTimestampFromServer.format('DD-MM-YYYY')).toBe('12-03-2014');
        });
    });

    describe('enforcer', function () {
        beforeEach(function () {
            var model = {
                scheduledPayment: {futureTransaction: {futureDatedInstruction: {repeatInterval: 'Daily'}}},
                paymentDetail: new PaymentDetail({repeatInterval: 'Daily'})
            };
            viewModel.current(model);
            viewModel.modifying();
            initializeController();
        });
        it('should check amount is greater than 0', function () {
            expect(scope.enforcer(0)).toEqual({
                error: true,
                type: 'amountValue',
                message: 'Please enter an amount greater than zero'
            });
        });

        it('should check amount is most two decimal places', function () {
            expect(scope.enforcer(0.001)).toEqual({
                error: true,
                type: 'currencyFormat',
                message: 'Please enter the amount in a valid format'
            });
        });
    });

    describe('controller proceed', function () {
        beforeEach(function () {
            var model = {
                scheduledPayment: {futureTransaction: {futureDatedInstruction: {repeatInterval: 'Daily'}}},
                paymentDetail: new PaymentDetail({repeatInterval: 'Daily'})
            };
            viewModel.current(model);
            viewModel.modifying();
            initializeController();
        });

        it('should modify view model with scope values', function () {
            scope.scheduledPayment = 'scheduledPayment';
            scope.paymentDetail = 'paymentDetail';
            scope.beneficiary = 'beneficiary';
            scope.amount = 'amount';


            spyOn(viewModel, 'current');
            spyOn(viewModel, 'modifying');
            scope.proceed();

            expect(viewModel.current).toHaveBeenCalledWith({
                scheduledPayment: 'scheduledPayment',
                paymentDetail: 'paymentDetail',
                beneficiary: 'beneficiary',
                amount: 'amount'
            });
        });

        it('should re-locate to confirm page', function () {
            scope.proceed();
            expect(location.path).toHaveBeenCalledWith('/payment/scheduled/modify/confirm');
            expect(path.replace).toHaveBeenCalled();
        });
    });

    describe('beneficiary', function () {
        it('should initial with service if is not in model', function () {
            var model = {
                scheduledPayment: {recipientId: 'someRecipientId'},
                paymentDetail: new PaymentDetail({repeatInterval: 'Daily'})
            };
            viewModel.current(model);
            viewModel.modifying();

            initializeController();

            expect(beneficiariesListService.formattedBeneficiaryList).toHaveBeenCalled();
            expect(scope.beneficiary).toEqual({recipientId: 'someRecipientId', vlaue: 'someValue'});
        });

        it('should not change the value from view model', function () {
            var model = {
                scheduledPayment: {recipientId: 'someRecipientId'},
                paymentDetail: new PaymentDetail({repeatInterval: 'Daily'}),
                beneficiary: 'beneficiary'
            };
            viewModel.current(model);
            viewModel.modifying();

            initializeController();
            expect(scope.beneficiary).toEqual('beneficiary');
        });
    });

    describe('on error message', function () {
        it('should put error message on the scope', function () {
            var model = {
                scheduledPayment: {recipientId: 'someRecipientId'},
                paymentDetail: new PaymentDetail({repeatInterval: 'Daily'}),
                beneficiary: 'beneficiary'
            };
            viewModel.current(model);
            viewModel.error({message: 'This is an error message'});

            initializeController();

            expect(scope.errorMessage).toBe('This is an error message');
        });
    });

});