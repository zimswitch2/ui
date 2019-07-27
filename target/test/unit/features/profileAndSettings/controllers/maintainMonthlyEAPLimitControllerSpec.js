describe('MaintainMonthlyEAPLimitController', function () {
    beforeEach(module('refresh.profileAndSettings'));

    var scope, serviceEndpoint, ServiceTest, accountsService, flow, viewModel,viewModelSpy, controller, location, limitMaintenanceService, mock;

    function initController() {
        controller('MaintainMonthlyEAPLimitController', {
            $scope: scope,
            AccountsService: accountsService,
            Flow: flow,
            ViewModel: viewModel,
            $location: location,
            LimitMaintenanceService: limitMaintenanceService
        });
    }

    beforeEach(inject(function ($rootScope, $controller, _ServiceTest_, _mock_, ViewModel, $location, LimitMaintenanceService) {
        scope = $rootScope.$new();
        ServiceTest = _ServiceTest_;
        limitMaintenanceService = LimitMaintenanceService;
        serviceEndpoint = ServiceTest.spyOnEndpoint('maintainMonthlyPaymentLimit');
        controller = $controller;
        location = jasmine.createSpyObj('$location',['path']);
        mock = _mock_;

        flow = jasmine.createSpyObj('Flow', ['create','next']);
        viewModel = ViewModel;
        accountsService = jasmine.createSpyObj('service', ['list', 'clear']);
        accountsService.list.and.returnValue(mock.resolve({
            "accounts": [],
            "cardProfile": {
                "monthlyEAPLimit": {"amount": 10000},
                "monthlyWithdrawalLimit": {"amount": 10000},
                "usedEAPLimit": {"amount": 2000},
                "remainingEAP": {"amount": 10000}
            }
        }));

        viewModelSpy = spyOn(viewModel, 'current').and.callThrough();

        initController();

        scope.cardProfile = {monthlyEAPLimit: {amount: 100}, usedEAPLimit: {amount: 7000}};

        scope.decreaseEAPLimitForm = {newEAPLimit: ''};
    }));

    describe('controller', function () {

        it('should have flow', function () {
            expect(flow.create).toHaveBeenCalledWith(['Monthly Payment Limit', 'Enter OTP'], 'Monthly Payment Limit', '/monthly-payment-limit');
        });

        it('should set the menuItems list ', function () {
            expect(scope.menuItems.length > 0).toBeTruthy();
        });

        it('should set success message from view model', function () {
            viewModel.current({isSuccessful: true, message: 'any message'});
            initController();
            expect(scope.isSuccessful).toBeTruthy();
            expect(scope.successMessage).toBe('any message');
            expect(viewModel.current()).toEqual({});
        });

        it('should set the error message if the view model has an error', function() {
           viewModel.error({ message: 'Something went wrong', code: '1234'});
            initController();
            expect(scope.errorMessage).toEqual('Something went wrong');

        });

    });

    describe('enforcer', function () {
        it('should know when to enforce the available balance', function () {
            expect(scope.enforcer(scope.newEAPLimit + 1)).toEqual({
                error: true,
                type: 'currencyFormat',
                message: 'Please enter the amount in a valid format'
            });
        });
    });

    describe('cancel', function () {
        beforeEach(function () {
            scope.isDecreasingLimit = true;
            ServiceTest.resolvePromise();
            scope.cancel();
        });

        it('should set the newEAPLimit be empty', function () {
            expect(scope.newEAPLimit.amount).toBeUndefined();
        });

        it('should hide the form', function () {
            expect(scope.isDecreasingLimit).toBeFalsy();
        });
    });

    describe('edit', function () {
        it('should show the form', function () {
            scope.isDecreasingLimit = false;
            scope.edit();
            scope.$digest();
            expect(scope.isDecreasingLimit).toBeTruthy();
        });
    });

    describe('save', function () {
        describe('on success', function () {
            var expectedResponse;
            beforeEach(function () {
                expectedResponse = {
                    usedEAPLimit: {
                        amount: '1000',
                        currency: 'R'
                    },
                    remainingEAP: {
                        amount: '10000',
                        currency: 'R'
                    },
                    monthlyEAPLimit: {
                        amount: '5000',
                        currency: 'R'
                    }
                };

                var expectedHeaders = {
                    "x-sbg-response-type": "SUCCESS",
                    "x-sbg-response-code": "0000"
                };


                location.path.and.returnValue('/otp');

                ServiceTest.stubResponse('maintainMonthlyPaymentLimit', 200, expectedResponse, expectedHeaders);
                scope.save();
                ServiceTest.resolvePromise();
            });

            it('should clear the accounts service cache', function () {
                expect(accountsService.clear).toHaveBeenCalled();
            });

            it('should clear the newEAPLimit field', function () {
                expect(scope.newEAPLimit.amount).toBeUndefined();
            });

            it('should hide the form', function () {
                expect(scope.isDecreasingLimit).toBeUndefined();
            });

            it('should remove error messages', function () {
                expect(scope.errorMessage).toBeUndefined();
            });

            it('should update the limits to the new values', function () {
                expect(scope.limits).toEqual({
                    monthlyEAPLimit: '5000',
                    usedEAPLimit: '1000',
                    availableEAPLimit: '10000'
                });
            });

            it('should update the cardProfile after limit increase', function () {
                expect(scope.cardProfile.monthlyEAPLimit.amount).toEqual(scope.limits.monthlyEAPLimit);
                expect(scope.cardProfile.remainingEAP.amount).toEqual(scope.limits.availableEAPLimit);
                expect(scope.cardProfile.usedEAPLimit.amount).toEqual(scope.limits.usedEAPLimit);
            });

            it('should go to maintain EAP limit with success message', function () {
                expect(viewModelSpy).toHaveBeenCalledWith({isSuccessful: true, message: 'Monthly payment limit successfully updated'});
                expect(location.path).toHaveBeenCalledWith('/monthly-payment-limit');

                expect(scope.isSuccessful).toBeTruthy();
                expect(scope.successMessage).toBe('Monthly payment limit successfully updated');
            });
        });

        describe('on success no OTP', function () {
            var expectedResponse;
            beforeEach(function () {
                expectedResponse = {
                    usedEAPLimit: {
                        amount: '1000',
                        currency: 'R'
                    },
                    remainingEAP: {
                        amount: '10000',
                        currency: 'R'
                    },
                    monthlyEAPLimit: {
                        amount: '5000',
                        currency: 'R'
                    }
                };

                var expectedHeaders = {
                    "x-sbg-response-type": "SUCCESS",
                    "x-sbg-response-code": "0000"
                };


                location.path.and.returnValue('/monthly-payment-limit');

                ServiceTest.stubResponse('maintainMonthlyPaymentLimit', 200, expectedResponse, expectedHeaders);
                scope.save();
                ServiceTest.resolvePromise();
            });

            it('should not set viewModel on decreasing (decreasing does not have OTP, therefore location path never changes)', function () {
                expect(viewModelSpy).not.toHaveBeenCalledWith({isSuccessful: true, message: 'Monthly payment limit successfully updated'});
                expect(scope.isSuccessful).toBeTruthy();
                expect(scope.successMessage).toBe('Monthly payment limit successfully updated');
            });

            it('should re-create flow', function () {
                expect(flow.create).toHaveBeenCalledWith(['Monthly Payment Limit', 'Enter OTP'], 'Monthly Payment Limit', '/monthly-payment-limit');
            });
        });

        describe('on failure', function () {
            var expectedResponse = {};

            beforeEach(function () {
                scope.newEAPLimit.amount = '10000000';
                scope.successMessage = 'success';
            });

            it('should add a Error on the backend ', function () {
                var expectedHeaders = {
                    "x-sbg-response-type": "ERROR",
                    "x-sbg-response-code": "250"
                };
                ServiceTest.stubResponse('maintainMonthlyPaymentLimit', 204, expectedResponse, expectedHeaders);
                scope.save();
                ServiceTest.resolvePromise();
                expect(scope.errorMessage).toEqual('We are experiencing technical problems. Please try again later');
            });

            it('should add an error message when new limit exceeds existing limit', function () {
                var expectedHeaders = {
                    "x-sbg-response-type": "ERROR",
                    "x-sbg-response-code": "300"
                };
                ServiceTest.stubResponse('maintainMonthlyPaymentLimit', 204, expectedResponse, expectedHeaders);
                scope.save();
                ServiceTest.resolvePromise();
                expect(scope.errorMessage).toEqual('Please enter an amount lower than your monthly limit');
            });

            it('should add an error message when new limit same as current limit', function () {
                var expectedHeaders = {
                    "x-sbg-response-type": "ERROR",
                    "x-sbg-response-code": "301"
                };
                ServiceTest.stubResponse('maintainMonthlyPaymentLimit', 204, expectedResponse, expectedHeaders);
                scope.save();
                ServiceTest.resolvePromise();
                expect(scope.errorMessage).toEqual('Please enter an amount lower than your monthly limit');
            });

            it('should add an error message when new limit less than zero', function () {
                var expectedHeaders = {
                    "x-sbg-response-type": "ERROR",
                    "x-sbg-response-code": "302"
                };
                ServiceTest.stubResponse('maintainMonthlyPaymentLimit', 204, expectedResponse, expectedHeaders);
                scope.save();
                ServiceTest.resolvePromise();
                expect(scope.errorMessage).toEqual('Please enter an amount greater than 0');
            });

            it('should add an error message when temporary limit exists', function () {
                var expectedHeaders = {
                    "x-sbg-response-type": "ERROR",
                    "x-sbg-response-code": "303"
                };
                ServiceTest.stubResponse('maintainMonthlyPaymentLimit', 204, expectedResponse, expectedHeaders);
                scope.save();
                ServiceTest.resolvePromise();
                expect(scope.errorMessage).toEqual('Please contact your branch to change the limit on your temporary card');
            });

            it('should redirect the page to /monthly-payment-limit if there is an otp error', function() {
                var error = {
                    otpError: true
                };

                spyOn(limitMaintenanceService, 'maintain').and.returnValue(mock.reject(error));
                scope.save();
                scope.$digest();

                expect(location.path).toHaveBeenCalledWith('/monthly-payment-limit');
            });

            it('should set the ViewModel error to serviceError', function() {
                var error = {
                    otpError: true,
                    errorMessage: 'Some Error'
                };

                spyOn(limitMaintenanceService, 'maintain').and.returnValue(mock.reject(error));
                spyOn(viewModel, 'error');
                scope.save();
                scope.$digest();

                expect(viewModel.error).toHaveBeenCalledWith(error);
            });


            it('should remove the success message', function () {
                var expectedHeaders = {
                    "x-sbg-response-type": "ERROR",
                    "x-sbg-response-code": "250"
                };
                ServiceTest.stubResponse('maintainMonthlyPaymentLimit', 204, expectedResponse, expectedHeaders);
                scope.save();
                ServiceTest.resolvePromise();
                expect(scope.successMessage).toBeUndefined();
                expect(scope.isSuccessful).toBeFalsy();
            });
        });

        describe('validations', function () {
            it('should set info message when below used eap limit', function () {
                scope.newEAPLimit.amount = '1000';
                scope.newEAPLimitChange();
                expect(scope.infoMessage).toEqual('Decreasing your limit to below the used limit amount will result in you not being able to make any further online payments this month.');
            });

            it('should set info message when below used eap limit with float', function () {
                scope.newEAPLimit.amount = 1000;
                scope.newEAPLimitChange();
                expect(scope.infoMessage).toEqual('Decreasing your limit to below the used limit amount will result in you not being able to make any further online payments this month.');
            });

            it('should not set info message when not below EAP limit', function () {
                scope.newEAPLimit = '4000';
                scope.newEAPLimitChange();
                expect(scope.infoMessage).toBeUndefined();
            });

        });
    });
});