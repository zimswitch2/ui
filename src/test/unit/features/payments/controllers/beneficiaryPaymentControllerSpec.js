var accountSharing = false;
if(feature.accountSharing) {
    accountSharing = true;
}

describe('single beneficiary payment', function () {
    'use strict';

    beforeEach(module('ngMessages', 'refresh.payment'));

    describe('routes', function () {
        var route;

        beforeEach(inject(function ($route) {
            route = $route;
        }));

        describe('when a beneficiary is to be paid', function () {
            it('should use the correct controller', function () {
                expect(route.routes['/payment/beneficiary'].controller).toEqual('BeneficiaryPaymentController');
            });

            it('should use the correct template', function () {
                expect(route.routes['/payment/beneficiary'].templateUrl).toEqual('features/payment/partials/payBeneficiary.html');
            });
        });
    });

    describe('BeneficiaryPaymentController', function () {
        var rootScope, scope, accountsService, paymentService, mock, card, flow, location,
            expectedSteps, applicationParams, windowSpy, test, $controller, beneficiary, beneficiariesService,
            beneficiaryWithoutConfirmation, limitMaintenanceService, beneficiaryPayment, user, operatorPaymentLimitsService, paymentLimitsService;
        var accounts = [
            {
                accountFeature: [
                    {
                        feature: 'PAYMENTFROM',
                        value: true
                    }
                ],
                formattedNumber: '12-34-567-890-0',
                availableBalance:
                {
                    amount: 9000.0
                },
                name: 'CURRENT'
            },
            {
                accountFeature: [
                    {
                        feature: 'PAYMENTFROM',
                        value: true
                    }
                ],
                formattedNumber: '1234-1234-1234-1234',
                availableBalance: {amount: 10000.0},
                name: 'CREDIT_CARD'
            },
            {
                accountFeature: [
                    {
                        feature: 'PAYMENTFROM',
                        value: false
                    }
                ],
                formattedNumber: '1234-1234-1234-1234',
                availableBalance: {amount: 10000.0},
                name: 'HOME_LOAN'
            }
        ];

        var cardProfile = {
            monthlyEAPLimit: {amount: 10000, currency: 'ZAR'},
            monthlyWithdrawalLimit: {amount: 10000, currency: 'ZAR'},
            usedEAPLimit: {amount: 2000, currency: 'ZAR'},
            remainingEAP: {amount: 8000, currency: 'ZAR'}
        };

        var paymentSuccessfulResponse = {
            responseFromServer: {}
        };

        var initializeController = function () {
            $controller('BeneficiaryPaymentController', {
                $scope: scope,
                AccountsService: accountsService,
                BeneficiariesService: beneficiariesService,
                BeneficiaryPaymentService: paymentService,
                $location: location,
                Card: card,
                ApplicationParameters: applicationParams,
                $routeParam: {},
                $window: windowSpy,
                LimitMaintenanceService: limitMaintenanceService,
                User: user
            });
            scope.$digest();
        };

        beforeEach(inject(function ($rootScope, _$controller_, _mock_, Flow, ApplicationParameters, ServiceTest, _AccountsService_, User, _BeneficiaryPayment_, OperatorPaymentLimitsService, PaymentLimitsService) {

            rootScope = $rootScope;
            this.rootScope = $rootScope;
            test = ServiceTest;
            test.spyOnEndpoint('listAccounts');

            scope = $rootScope.$new();
            accountsService = _AccountsService_;
            operatorPaymentLimitsService = OperatorPaymentLimitsService;
            paymentLimitsService = PaymentLimitsService;
            paymentService = jasmine.createSpyObj('beneficiaryPaymentService', ['payBeneficiary']);

            beneficiariesService = jasmine.createSpyObj('BeneficiariesService', ['addOrUpdate']);

            card = jasmine.createSpyObj('card', ['current']);

            beneficiary = {
                name: 'Someone',
                accountNumber: '12345',
                paymentConfirmation: {confirmationType: 'Email', recipientName: 'Someone', address: 'someone@somewhere.com'},
                recipientReference: 'Test',
                customerReference: 'Test',
                originalBeneficiary: {
                    customerReference: 'Some reference',
                    paymentConfirmation: {  address: null,
                        confirmationType: 'None',
                        recipientName: null,
                        sendFutureDated: null
                    }
                }
            };

            beneficiaryPayment = _BeneficiaryPayment_;
            beneficiaryPayment.start(beneficiary);

            var currentPrincipalMock = {
                systemPrincipalIdentifier: {
                    systemPrincipalId: 4321,
                    systemPrincipalKey: 'SED'
                }
            };
            user = User;
            spyOn(User, ['principalForCurrentDashboard']).and.returnValue(currentPrincipalMock);
            spyOn(User, ['isCurrentDashboardCardHolder']);
            spyOn(User, ['isSEDOperator']);
            user.isSEDOperator.and.returnValue(false);

            location = jasmine.createSpyObj('location', ['path']);

            windowSpy = jasmine.createSpyObj('$window', ['print']);

            mock = _mock_;
            flow = Flow;
            applicationParams = ApplicationParameters;

            card.current.and.returnValue({number: 'number'});

            test.stubResponse('listAccounts', 200, {
                accounts: accounts,
                cardProfile: {
                    monthlyEAPLimit: {amount: 10000, currency: 'ZAR'},
                    monthlyWithdrawalLimit: {amount: 10000, currency: 'ZAR'},
                    usedEAPLimit: {amount: 2000, currency: 'ZAR'},
                    remainingEAP: {amount: 10000, currency: 'ZAR'}
                }
            });

            accountsService.list({number: 'number'});

            expectedSteps = [
                {name: 'Enter details', complete: false, current: true},
                {name: 'Confirm details', complete: false, current: false}
            ];
            $controller = _$controller_;
        }));


        function setupController($controller) {
            $controller('BeneficiaryPaymentController', {
                $scope: scope,
                AccountsService: accountsService,
                BeneficiaryPaymentService: paymentService,
                $location: location,
                Card: card,
                ApplicationParameters: applicationParams,
                BeneficiaryPayment: beneficiaryPayment
            });
        }

        it('should set Date to current date', function () {
            var now = moment('2014-11-22');
            var clock = sinon.useFakeTimers(now.toDate().getTime());
            scope.beneficiary = {
                name: 'Someone', accountNumber: '12345',
                paymentConfirmation: {confirmationType: 'Email', recipientName: 'Someone', address: 'someone@somewhere.com'}
            };
            setupController($controller);
            expect(scope.statementDate.isSame(now)).toBeTruthy();
            clock.restore();
        });

        describe('when initialized', function () {
            beforeEach(function () {
                scope.beneficiary = {
                    name: 'Someone', accountNumber: '12345',
                    paymentConfirmation: {confirmationType: 'Email', recipientName: 'Someone', address: 'someone@somewhere.com'}
                };
            });

            describe('for account sharing feature', function() {

                it('should choose the paymentLimitsService when toggle is off', function () {
                    accountSharing = false;
                    initializeController();
                    expect(scope.limitsService instanceof paymentLimitsService).toBeTruthy();
                });

                it('should choose the paymentLimitsService when user is NOT an SED operator when toggle is on', function () {
                    accountSharing = true;
                    user.isSEDOperator.and.returnValue(false);
                    initializeController();
                    expect(scope.limitsService instanceof paymentLimitsService).toBeTruthy();
                });

                it('should choose the operatorPaymentLimitsService when user is an SED operator when toggle is on', function () {
                    accountSharing = true;
                    user.isSEDOperator.and.returnValue(true);
                    initializeController();
                    expect(scope.limitsService instanceof operatorPaymentLimitsService).toBeTruthy();
                });
            });

            it('should set isFutureDatedPayment to false', function () {
                initializeController();

                expect(scope.isFutureDatedPayment).toBeFalsy();
            });

            it('should set to hasZeroEAPLimit to false when limit is not zero', function () {
                initializeController();

                expect(scope.monthlyEAPLimit).toEqual(10000);
                expect(scope.hasZeroEAPLimit).toBeFalsy();
            });

            it('should set to hasZeroEAPLimit to true when limit is zero', function () {
                test.stubResponse('listAccounts', 200, {
                    accounts: accounts,
                    cardProfile: {
                        monthlyEAPLimit: {amount: 0.0, currency: 'ZAR'},
                        monthlyWithdrawalLimit: {amount: 0.0, currency: 'ZAR'},
                        usedEAPLimit: {amount: 0.0, currency: 'ZAR'},
                        remainingEAP: {amount: 0.0, currency: 'ZAR'}
                    }
                });

                accountsService.list({number: 'number'});

                initializeController();

                expect(scope.monthlyEAPLimit).toEqual(0.00);
                expect(scope.hasZeroEAPLimit).toBeTruthy();
            });

            it('should default account to first payment account', function () {
                test.stubResponse('listAccounts', 200, {
                    accounts: accounts,
                    cardProfile: {
                        monthlyEAPLimit: {amount: 0.0, currency: 'ZAR'},
                        monthlyWithdrawalLimit: {amount: 0.0, currency: 'ZAR'},
                        usedEAPLimit: {amount: 0.0, currency: 'ZAR'},
                        remainingEAP: {amount: 0.0, currency: 'ZAR'}
                    }
                });

                accountsService.list({number: 'number'});

                initializeController();

                expect(scope.account).toEqual(scope.payFromAccounts[0]);
            });

            it('should update account when exist in scope', function () {
                initializeController();

                scope.account = {
                    accountFeature: [
                        {
                            feature: 'PAYMENTFROM',
                            value: true
                        }
                    ],
                    formattedNumber: '1234-1234-1234-1234',
                    availableBalance: {amount: 80000.0},
                    name: 'CREDIT_CARD'
                };
                scope.$digest();

                paymentService.payBeneficiary.and.returnValue(mock.resolve({}));
                test.stubResponse('listAccounts', 200, {
                    accounts: accounts,
                    cardProfile: {
                        monthlyEAPLimit: {amount: 0.0, currency: 'ZAR'},
                        monthlyWithdrawalLimit: {amount: 0.0, currency: 'ZAR'},
                        usedEAPLimit: {amount: 0.0, currency: 'ZAR'},
                        remainingEAP: {amount: 0.0, currency: 'ZAR'}
                    }
                });
                scope.confirm();
                scope.$digest();

                expect(scope.account).toEqual(accounts[1]);
            });


            it('should have the flow header as Pay single beneficiary', function () {
                initializeController();

                expect(flow.get().headerName).toEqual('Pay single beneficiary');
            });

            it('should know the flow steps and state of the steps with the first step as current', function () {
                initializeController();

                var steps = flow.get().steps;
                expect(steps).toEqual(expectedSteps);
            });

            it('should only list accounts that are payable from', function () {
                initializeController();

                expect(scope.payFromAccounts.length).toEqual(2);
                expect(scope.hasInfo).toBeFalsy();
            });

            it('should set hasInfo and infoMessage if no available account exists', function () {
                test.stubResponse('listAccounts', 200, {
                    accounts: [],
                    cardProfile: {
                        monthlyEAPLimit: {amount: 0.0, currency: 'ZAR'},
                        monthlyWithdrawalLimit: {amount: 0.0, currency: 'ZAR'},
                        usedEAPLimit: {amount: 0.0, currency: 'ZAR'},
                        remainingEAP: {amount: 0.0, currency: 'ZAR'}
                    }
                });

                accountsService.list({number: 'number'});

                initializeController();

                expect(scope.hasInfo).toBeTruthy();
                expect(scope.infoMessage).toEqual('You do not have an account linked to your profile from which payment may be made to a third party');
            });

            it('should have the monthly electronic transfer limit', function () {
                initializeController();

                expect(scope.cardProfile.monthlyEAPLimit.amount).toEqual(10000);
                expect(scope.monthlyEAPLimit).toEqual(10000);
            });

            it('should have the card profile', function () {
                initializeController();

                var expectedCardProfile = {
                    monthlyEAPLimit: {amount: 10000, currency: 'ZAR'},
                    monthlyWithdrawalLimit: {amount: 10000, currency: 'ZAR'},
                    usedEAPLimit: {amount: 2000, currency: 'ZAR'},
                    'remainingEAP' : { amount : 10000, currency : 'ZAR' }
                };
                expect(scope.cardProfile).toEqual(expectedCardProfile);
            });

            it('should have the used electronic transfer limit', function () {
                initializeController();

                expect(scope.cardProfile.usedEAPLimit.amount).toEqual(2000);
            });

            it('should know available transfer limit', function () {
                initializeController();

                expect(scope.availableEAPLimit).toEqual(10000);
            });

            it('should clean up successful status', function () {
                initializeController();

                expect(scope.isSuccessful).toBeFalsy();
            });

            it('should display beneficiary details for the selected beneficiary', function () {
                initializeController();

                expect(scope.beneficiary.name).toEqual('Someone');
                expect(scope.beneficiary.accountNumber).toEqual('12345');
                expect(scope.state).toEqual('paymentDetails');
            });

            it('should display the payment confirmation details for the selected beneficiary', function () {
                initializeController();

                expect(scope.paymentConfirmation).toBeTruthy();
                expect(scope.beneficiary.paymentConfirmation.confirmationType).toEqual('Email');
                expect(scope.beneficiary.paymentConfirmation.recipientName).toEqual('Someone');
                expect(scope.beneficiary.paymentConfirmation.address).toEqual('someone@somewhere.com');
            });

            describe('when setting beneficiary and payment details', function() {

                beforeEach(function() {
                    beneficiaryPayment.start(beneficiary);
                    beneficiaryPayment.getAmount().value = 234.32;
                    beneficiaryPayment.setErrorMessage('All gone wrong');

                    initializeController();
                });

                it('should set the beneficiary on the scope', function() {
                   expect(scope.beneficiary).toEqual(beneficiary);
                });

                it('should set the payment detail on the scope', function() {
                   expect(scope.paymentDetail).toBeTruthy();
                });

                it('should set the payment confirmation on the scope', function() {
                   expect(scope.paymentConfirmation).toBeTruthy();
                });

                it('should set the recurring payment to true', function() {
                   expect(scope.isRecurringPayment).toEqual(false);
                });

                it('should set the existing amount on the scope', function() {
                   expect(scope.amount.value).toEqual(234.32);
                });

                it('should set the error message on the scope', function() {
                   expect(scope.errorMessage).toEqual('All gone wrong');
                });

                it('should set the recurring payment option to false', function() {
                    initializeController();
                    expect(scope.isRecurringPayment).toBeFalsy();
                });
            });

            describe('when an account is selected', function () {
                beforeEach(function () {
                    scope.account = accounts[0];
                });

                it('should have checking account number to transfer from available', function () {
                    expect(scope.account.formattedNumber).toEqual('12-34-567-890-0');
                });

                it('should have the available balance on the account in the scope', function () {
                    expect(scope.account.availableBalance.amount).toEqual(9000.0);
                });
            });

            describe('when the payment confirmation preference changes', function () {

                beforeEach(function () {
                    beneficiaryWithoutConfirmation = {
                        name: 'Someone else',
                        accountNumber: '12345',
                        paymentConfirmation: {confirmationType: 'None', recipientName: 'Someone else'},
                        originalBeneficiary: {
                            paymentConfirmation: {  address: null,
                                confirmationType: 'None',
                                recipientName: null,
                                sendFutureDated: null
                            }
                        }
                    };

                    initializeController();
                });

                it('should pre-populate the recipient name with the beneficiary name for private individuals', function () {
                    expect(scope.beneficiary.paymentConfirmation.recipientName).toEqual('Someone');
                });

                it('should pre-populate the recipient name with the beneficiary name when confirmation type is None', function () {
                    beneficiaryPayment.start(beneficiaryWithoutConfirmation);

                    initializeController();

                    expect(scope.beneficiary.paymentConfirmation.confirmationType).toEqual('None');
                    expect(scope.beneficiary.paymentConfirmation.recipientName).toEqual('Someone else');
                });

                it('should display message notifying user that confirmation type settings are valid for this transaction only', function () {
                    scope.beneficiary.paymentConfirmation.confirmationType = 'SMS';
                    scope.$digest();

                    expect(scope.confirmationTypeNotification).toEqual('Selected notification method will apply to this payment only');
                });

                it('should set notification message to undefined when reverting to the old confirmation type', function () {
                    scope.beneficiary.paymentConfirmation.confirmationType = 'SMS';
                    scope.$digest();

                    expect(scope.confirmationTypeNotification).toEqual('Selected notification method will apply to this payment only');

                    scope.beneficiary.paymentConfirmation.confirmationType = 'Email';
                    scope.$digest();
                    expect(scope.confirmationTypeNotification).toEqual(undefined);
                });

                it('should set notification message when recipient name changes', function () {
                    scope.confirmationTypeNotification = undefined;
                    scope.beneficiary.paymentConfirmation.recipientName = 'Someone in this world';
                    scope.$digest();

                    expect(scope.confirmationTypeNotification).toEqual('Selected notification method will apply to this payment only');
                });

                it('should set notification message when option to send payment confirmation changes', function () {
                    scope.confirmationTypeNotification = undefined;
                    scope.paymentConfirmation = true;
                    scope.$digest();

                    scope.paymentConfirmation = false;
                    scope.$digest();

                    expect(scope.confirmationTypeNotification).toEqual('Selected notification method will apply to this payment only');
                });

                it('should not pre-populate the recipient name for company beneficiaries', function () {
                    scope.beneficiary.beneficiaryType = 'COMPANY';
                    scope.paymentConfirmation = true;
                    scope.$digest();
                    expect(scope.beneficiary.paymentConfirmation.recipientName).toEqual('Someone');
                });

                it('should not pre-populate the recipient name for company beneficiaries', function () {
                    beneficiaryPayment.start({
                        name: 'Someone',
                        accountNumber: '12345',
                        paymentConfirmation: {confirmationType: 'None', recipientName: 'Someone', address: 'someone@somewhere.com'},
                        originalBeneficiary: {
                            paymentConfirmation: {  address: null,
                                confirmationType: 'None',
                                recipientName: null,
                                sendFutureDated: null
                            }
                        }
                    });

                    initializeController();

                    scope.beneficiary.beneficiaryType = 'COMPANY';
                    scope.paymentConfirmation = true;
                    scope.$digest();

                    expect(scope.beneficiary.paymentConfirmation.recipientName).toBeNull();
                });

                it('should set the email address as the default payment confirmation', function () {
                    scope.paymentConfirmation = true;
                    scope.$digest();
                    expect(scope.beneficiary.paymentConfirmation.confirmationType).toEqual('Email');
                });

                it('should default the payment confirmation recipient name to the beneficiary name for private beneficiaries', function () {
                    beneficiaryPayment.start(beneficiaryWithoutConfirmation);
                    initializeController();
                    scope.paymentConfirmation = true;
                    scope.$digest();
                    expect(scope.beneficiary.paymentConfirmation.recipientName).toEqual('Someone else');
                });

                it('should not clear payment confirmation fields when confirmation is set to false', function () {
                    scope.beneficiary.paymentConfirmation.recipientName = 'name';
                    scope.beneficiary.paymentConfirmation.address = 'address';
                    scope.paymentConfirmation = false;
                    scope.$digest();
                    expect(scope.beneficiary.paymentConfirmation.recipientName).toBe('name');
                    expect(scope.beneficiary.paymentConfirmation.address).toBe('address');
                });
            });
        });

        describe('when modified', function () {
            beforeEach(function () {
                initializeController();

                flow.create(['Enter details', 'Confirm details'], 'Pay single beneficiary');
                flow.next();

                scope.modify();
            });

            it('should go back to input screen when modify is clicked', function () {
                expect(scope.state).toEqual('paymentDetails');
            });

            it('should know the flow steps and state of the steps with the first step as current', function () {
                var steps = flow.get().steps;
                expect(steps).toEqual(expectedSteps);
            });
        });

        describe('when proceed', function () {
            beforeEach(function () {
                flow.create(['Enter details', 'Confirm details'], 'Pay single beneficiary');
                initializeController();
                scope.proceed();
            });

            it('should display transaction details for confirmation', function () {
                expect(scope.state).toEqual('reviewing');
            });

            it('should know the current step is the last step and the other two steps have been completed', function () {
                expectedSteps[0].current = false;
                expectedSteps[0].complete = true;

                expectedSteps[1].current = true;
                expectedSteps[1].complete = false;

                expect(flow.get().steps).toEqual(expectedSteps);
            });
        });

        describe('when submit for approval', function () {

            beforeEach(function() {
                initializeController();
            });

            it("should set success message on scope for successful capture", function () {
                scope.submitForApproval();
                expect(scope.successMessage).toBe('Payment request was successfully sent, it is now waiting for approval');
            });
        });

        describe('when capturing a payment in current SED dashboard', function () {

            beforeEach(function() {
                initializeController();
            });

            it("should set isCapture to true if not card holder", function () {
                user.isCurrentDashboardCardHolder.and.returnValue(false);
                expect(scope.isCapture()).toBeTruthy();
            });

            it("should set isCapture to false if card holder", function () {
                user.isCurrentDashboardCardHolder.and.returnValue(true);
                expect(scope.isCapture()).toBeFalsy();
            });
        });

        describe('update references', function() {

            var path;

            beforeEach(function () {
                updateBeneficiaryReferencesOnPayFeature = true;
                flow.create(['Enter details', 'Confirm details'], 'Pay single beneficiary');
                initializeController();
                beneficiariesService.addOrUpdate.and.returnValue(mock.resolve({}));
                path = jasmine.createSpyObj('path', ['replace']);
                location.path.and.returnValue(path);
            });

            it('should call service to update beneficiary when customer reference has changed and customer requested it be updated', function() {
                scope.beneficiary.customerReference = 'New your ref';
                scope.saveReferences.saveCustomerRef = true;
                scope.beneficiary.recipientReference = 'New ben ref';
                scope.proceed();

                expect(beneficiariesService.addOrUpdate.calls.count()).toEqual(1);
                var addOrUpdateArgs = beneficiariesService.addOrUpdate.calls.mostRecent().args;
                expect(addOrUpdateArgs[0].customerReference).toEqual('New your ref');
                expect(addOrUpdateArgs[0].recipientReference).toEqual('Test');
                expect(addOrUpdateArgs[1]).toEqual({
                    "number": "number"
                });
            });
            
            it('should not update beneficiary if feature is toggled off', function() {
                updateBeneficiaryReferencesOnPayFeature = false;
                scope.beneficiary.customerReference = 'New your ref';
                scope.saveReferences.saveCustomerRef = true;
                scope.proceed();

                expect(beneficiariesService.addOrUpdate.calls.count()).toEqual(0);
            });

            it('should not call service to update beneficiary when customer reference has changed and customer did not request it to be updated', function() {
                scope.beneficiary.customerReference = 'New your ref';
                scope.saveReferences.saveCustomerRef = false;
                scope.proceed();

                expect(beneficiariesService.addOrUpdate.calls.count()).toEqual(0);
            });

            it('should not call service to update beneficiary when customer reference has not changed and customer did request it to be updated', function() {
                scope.saveReferences.saveCustomerRef = true;
                scope.proceed();

                expect(beneficiariesService.addOrUpdate.calls.count()).toEqual(0);
            });


            it('should call service to update beneficiary when customer beneficiary reference has changed and customer requested it to be updated', function() {
                scope.beneficiary.customerReference = 'New your ref';
                scope.beneficiary.recipientReference = 'New ben ref';
                scope.saveReferences.saveRecipientRef = true;
                scope.proceed();

                expect(beneficiariesService.addOrUpdate.calls.count()).toEqual(1);
                var addOrUpdateArgs = beneficiariesService.addOrUpdate.calls.mostRecent().args;
                expect(addOrUpdateArgs[0].customerReference).toEqual('Test');
                expect(addOrUpdateArgs[0].recipientReference).toEqual('New ben ref');
                expect(addOrUpdateArgs[1]).toEqual({
                    "number": "number"
                });
            });

            it('should not call service to update beneficiary when customer reference has not changed and customer did request it to be updated', function() {
                scope.saveReferences.saveRecipientRef = true;
                scope.proceed();

                expect(beneficiariesService.addOrUpdate.calls.count()).toEqual(0);
            });

            it('should store the current state as reviewing', function() {
                scope.beneficiary.customerReference = 'New your ref';
                scope.saveReferences.saveCustomerRef = true;
                scope.proceed();

                expect(beneficiaryPayment.getState()).toEqual('reviewing');
            });

            it('should reload the page', function() {
                scope.beneficiary.customerReference = 'New your ref';
                scope.saveReferences.saveCustomerRef = true;
                scope.proceed();
                scope.$digest();

                expect(location.path).toHaveBeenCalledWith('/payment/beneficiary');
                expect(path.replace).toHaveBeenCalled();
            });

            it('after page reload it should set the page state to reviewing', function() {
                flow.create(['Enter details', 'Confirm details'], 'Pay single beneficiary');
                beneficiaryPayment.setState('reviewing');

                initializeController();

                expect(scope.state).toEqual('reviewing');
            });

            it('after page reload it should change the flow to a review state', function() {
                scope.beneficiary.customerReference = 'New your ref';
                scope.saveReferences.saveCustomerRef = true;
                scope.proceed();
                scope.$digest();

                expect(flow.currentStep()).toEqual({name: 'Confirm details', complete: false, current: true});
            });

        });

        describe('when confirm', function () {
            beforeEach(function () {
                test.stubResponse('listAccounts', 200, {accounts: accounts, cardProfile: cardProfile});
                initializeController();
                scope.amount = '123.45';
                scope.beneficiary = {
                    recipientId: '123',
                    name: 'Test',
                    accountNumber: '1234567890',
                    recipientReference: 'Test',
                    customerReference: 'Test',
                    lastPaymentDateForSorting: moment('2014-02-03'),
                    formattedLastPaymentDate: '3 February 2014',
                    somethingElse: 'don\'t care',
                    originalBeneficiary: {
                        name: 'The original beneficiary from the service',
                        accountNumber: 'ORIGINAL-123',
                        paymentConfirmation: {
                            address: null,
                            confirmationType: 'None',
                            recipientName: null,
                            sendFutureDated: null
                        }
                    }
                };

                flow.create(['Enter details', 'Confirm details'], 'Pay single beneficiary');
                flow.next();
                paymentService.payBeneficiary.and.returnValue(mock.resolve(paymentSuccessfulResponse));
            });

            it('should know the current step is the last step and the other two steps have been completed when success', function () {
                expectedSteps[0].current = false;
                expectedSteps[0].complete = true;
                expectedSteps[1].current = true;
                expectedSteps[1].complete = true;

                accountsService.list({number: 'number'});

                scope.confirm();
                scope.$digest();

                expect(flow.get().steps).toEqual(expectedSteps);

                test.resolvePromise();
            });

            it('should know the current step is the first step when error', function () {
                expectedSteps[0].current = true;
                expectedSteps[0].complete = false;

                expectedSteps[1].current = false;
                expectedSteps[1].complete = false;
                paymentService.payBeneficiary.and.returnValue(mock.response({something: 'else'}, 500));
                scope.confirm();
                scope.$digest();

                expect(flow.get().steps).toEqual(expectedSteps);
            });

            it('should call the payment service with today\'s date and no repeat options when date is latestTimestampFromServer', function () {
                scope.latestTimestampFromServer = '2014-06-01T13:00:00.000+0000';
                scope.paymentDetail.fromDate = moment('01 June 2014').format();
                scope.confirm();
                expect(scope.isFutureDatedPayment).toBeFalsy();
                expect(paymentService.payBeneficiary).toHaveBeenCalledWith({
                    beneficiary: scope.beneficiary.originalBeneficiary,
                    account: scope.account,
                    amount: scope.amount.value,
                    date: moment(scope.paymentDetail.fromDate).format(),
                    repeatInterval: 'Single',
                    repeatNumber: undefined
                });
            });

            it('should call service with formatted paymentDate when date is not latestTimestampFromServer', function () {
                scope.latestTimestampFromServer = '2014-06-01T22:00:00.000+0000';
                scope.paymentDetail.fromDate = moment('30 July 2014').format();
                scope.isRecurringPayment  = false;
                scope.$apply();
                scope.confirm();
                expect(paymentService.payBeneficiary).toHaveBeenCalledWith({
                    beneficiary: scope.beneficiary.originalBeneficiary,
                        account: scope.account,
                        amount: scope.amount.value,
                        date: '2014-07-30T00:00:00+02:00',
                        repeatInterval: 'Single',
                        repeatNumber: undefined
                });
            });

            it('should call the service with the correct beneficiary details when a beneficiary is updated', function() {
                scope.beneficiary.recipientReference = 'New Recipient Reference';
                scope.beneficiary.customerReference = 'New Customer Reference';

                scope.$apply();
                scope.confirm();

                var savedPayment = paymentService.payBeneficiary.calls.mostRecent().args[0];

                expect(savedPayment.beneficiary.recipientReference).toEqual('New Recipient Reference');
                expect(savedPayment.beneficiary.customerReference).toEqual('New Customer Reference');
            });

            it('should not send payment confirmation details when No option is chosen', function () {
                scope.paymentConfirmation = false;
                scope.confirm();
                expect(scope.beneficiary.originalBeneficiary.paymentConfirmation).toEqual({
                    address: null,
                    confirmationType: 'None',
                    recipientName: null,
                    sendFutureDated: null
                });
            });

            it('should set the success message on the scope from the service response', function () {
                var responseWithMessage = _.cloneDeep(paymentSuccessfulResponse);
                responseWithMessage.successMessage = 'Some success message';
                paymentService.payBeneficiary.and.returnValue(mock.resolve(responseWithMessage));
                scope.latestTimestampFromServer = '2014-06-01T22:00:00.000+0000';
                scope.paymentDetail.fromDate = '30 July 2014';
                scope.$apply();

                scope.confirm();
                scope.$digest();

                expect(scope.successMessage).toBe('Some success message');
            });

            it('should send payment confirmation details when Yes option is chosen', function () {
                scope.paymentConfirmation = true;
                scope.beneficiary.originalBeneficiary.paymentConfirmation = { address: 'some address',
                    confirmationType: 'Email',
                    recipientName: 'some dude',
                    sendFutureDated: null};

                scope.confirm();
                expect(scope.beneficiary.originalBeneficiary.paymentConfirmation).toEqual({
                    address: 'some address',
                    confirmationType: 'Email',
                    recipientName: 'some dude',
                    sendFutureDated: null
                });
            });

            describe('for recurring payments', function () {

                beforeEach(function () {
                    scope.isRecurringPayment = true;
                    scope.$apply();
                });

                it('should call payBeneficiary function on service with payment date, interval and repeatNumber', function () {
                    scope.paymentDetail = new PaymentDetail({ repeatInterval: 'Weekly', repeatNumber: 10});
                    scope.paymentDetail.fromDate = moment('02 July 2014').format();
                    scope.$apply();

                    scope.confirm();

                    expect(paymentService.payBeneficiary).toHaveBeenCalledWith({
                        beneficiary: scope.beneficiary.originalBeneficiary,
                        account: scope.account,
                        amount: scope.amount.value,
                        date: '2014-07-02T00:00:00+02:00',
                        repeatInterval: 'Weekly',
                        repeatNumber: 10
                    });
                });

                it('should update the state and flow if the service call succeeds', function () {
                    scope.repeatInterval = 'Weekly';
                    scope.paymentDetail.fromDate = '02 July 2014';
                    scope.repeatNumber = 10;

                    scope.confirm();
                    scope.$digest();

                    expect(scope.isSuccessful).toBeTruthy();
                    expect(scope.state).toEqual('done');
                });
            });

            describe('upon failure', function () {

                it('should payBeneficiary with http 500 error status', function () {
                    initializeController();
                    paymentService.payBeneficiary.and.returnValue(mock.reject({message: undefined}, 500));
                    scope.confirm();
                    scope.$digest();
                    expect(scope.state).toEqual('paymentDetails');
                    expect(scope.errorMessage).toBeFalsy();
                    expect(scope.account.availableBalance.amount).toEqual(9000.0);
                    expect(scope.cardProfile.usedEAPLimit.amount).toEqual(2000);
                    expect(paymentService.payBeneficiary).toHaveBeenCalled();
                });

                it('payBeneficiary with http 401 error status', function () {
                    paymentService.payBeneficiary.and.returnValue(mock.reject({message: ': some message'}, 401));
                    scope.confirm();
                    scope.$digest();
                    expect(scope.state).toEqual('paymentDetails');
                    expect(scope.account.availableBalance.amount).toEqual(9000.0);
                    expect(scope.cardProfile.usedEAPLimit.amount).toEqual(2000);
                    expect(paymentService.payBeneficiary).toHaveBeenCalled();
                    expect(scope.errorMessage).toEqual('Could not process payment: some message');
                });

                it('application error', function () {
                    paymentService.payBeneficiary.and.returnValue(mock.reject({
                        transactionResults: [
                            {
                                responseCode: {
                                    code: null,
                                    responseType: 'ERROR',
                                    message: 'Something bad'
                                }
                            }
                        ]
                    }, 200));
                    scope.confirm();
                    scope.$digest();
                    expect(scope.state).toEqual('paymentDetails');
                    expect(scope.errorMessage).toBeFalsy();
                    expect(scope.account.availableBalance.amount).toEqual(9000.0);
                    expect(scope.cardProfile.usedEAPLimit.amount).toEqual(2000);
                });

                it('non-0000 response code', function () {
                    paymentService.payBeneficiary.and.returnValue(mock.reject({
                        transactionResults: [
                            {
                                responseCode: {
                                    code: '1234',
                                    responseType: 'something',
                                    message: undefined
                                }
                            }
                        ]
                    }, 200));

                    initializeController();

                    scope.confirm();
                    scope.$digest();

                    expect(scope.state).toEqual('paymentDetails');
                    expect(scope.errorMessage).toBeFalsy();
                    expect(scope.account.availableBalance.amount).toEqual(9000.0);
                    expect(scope.cardProfile.usedEAPLimit.amount).toEqual(2000);
                });
            });

            describe('upon success', function () {
                var today, futureDate;
                beforeEach(function () {
                    scope.latestTimestampFromServer = '2014-06-01T09:00:00.000+0000';
                    today = '01 June 2014';
                    futureDate = '25 June 2014';
                    paymentService.payBeneficiary.and.returnValue(mock.resolve({
                            shouldUpdateAccountBalances: true
                        }
                    ));
                    scope.availableEAPLimit = 8000.0;
                    initializeController();
                });

                it('should not update the available balance and the monthly limit used when future dated payment', function () {
                    scope.paymentDetail.fromDate = futureDate;
                    scope.$apply();
                    scope.confirm();
                    expect(scope.account.availableBalance.amount).toEqual(9000.0);
                    expect(scope.availableEAPLimit).toEqual(8000.0);
                    expect(scope.cardProfile.usedEAPLimit.amount).toEqual(2000);
                });

                it('should call the payment service', function () {
                    scope.confirm();
                    expect(paymentService.payBeneficiary).toHaveBeenCalled();
                });

                it('should set flag indicating success', function () {
                    scope.confirm();
                    scope.$digest();
                    expect(scope.isSuccessful).toBeTruthy();
                });

                it('should move back to beginning of payment flow', function () {
                    scope.confirm();
                    scope.$digest();
                    expect(scope.state).toEqual('done');
                });

                it('should return to the list of beneficiaries when transaction is done using location path replace', function () {
                    var path = jasmine.createSpyObj('path', ['replace']);
                    location.path.and.returnValue(path);
                    scope.done();
                    expect(location.path).toHaveBeenCalledWith('/beneficiaries/list');
                    expect(path.replace).toHaveBeenCalled();
                });
            });

            describe('upon warning', function () {
                it('should respond with a success from the service if there is a warning', function () {

                    paymentService.payBeneficiary.and.returnValue(mock.resolve(
                        {
                            isWarning: true
                        }
                    ));

                    scope.confirm();
                    scope.$digest();

                    expect(scope.isSuccessful).toBeTruthy();
                    expect(scope.state).toEqual('successWithWarning');
                    expect(scope.errorMessage).toEqual('Your notification could not be delivered because the email address was invalid');
                });
            });
        });

        describe('increase eap limit', function() {
            var path;

            beforeEach(function() {
                path = jasmine.createSpyObj('path', ['replace']);
                location.path.and.returnValue(path);

                limitMaintenanceService = jasmine.createSpyObj('limitMaintenanceService', ['maintain']);
                limitMaintenanceService.maintain.and.returnValue(mock.resolve({}));
            });

            it('should call the maintain eap limit service with the correct details', function() {
                initializeController();
                scope.amount = {
                    value: 322
                };

                scope.increaseEapLimit();

                expect(limitMaintenanceService.maintain).toHaveBeenCalledWith({
                    "card": {
                        "number": "number"
                    },
                    "newEAPLimit": {
                        "amount": 2322,
                        "currency": "ZAR"
                    }
                });
            });

            describe('when successful', function() {
                it('should reload the page', function() {
                    initializeController();

                    scope.increaseEapLimit();
                    scope.$digest();

                    expect(location.path).toHaveBeenCalledWith('/payment/beneficiary');
                    expect(path.replace).toHaveBeenCalled();
                });
            });

            describe('when an error occurs', function() {
                beforeEach(function() {
                    limitMaintenanceService.maintain.and.returnValue(mock.reject({ message: 'oh dear'}));
                    initializeController();
                });

                it('should store the error', function() {
                    scope.increaseEapLimit();
                    scope.$digest();

                    expect(beneficiaryPayment.getErrorMessage()).toEqual('oh dear');
                });

                it('should reload the page', function() {

                    scope.increaseEapLimit();
                    scope.$digest();

                    expect(location.path).toHaveBeenCalledWith('/payment/beneficiary');
                    expect(path.replace).toHaveBeenCalled();
                });
            });
        });

        describe('show increase eap section', function() {
            beforeEach(function() {
                initializeController();
                user.isCurrentDashboardCardHolder.and.returnValue(true);
            });

            it('should not show the widget if the user is not a card holder', function() {
                user.isCurrentDashboardCardHolder.and.returnValue(false);
                scope.amount.value = 11000;
                expect(scope.showIncreaseEapLimitSection()).toBeFalsy();
            });

            it('should show the widget if the amount is greater than the available eap limit', function() {
                scope.amount.value = 11000;
                expect(scope.showIncreaseEapLimitSection()).toBeTruthy();
            });

            it('should not show the widget if the amount is less than the available eap limit', function() {
                scope.amount.value = 2000;
                expect(scope.showIncreaseEapLimitSection()).toBeFalsy();
            });
        });
    });
});
