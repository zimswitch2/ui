describe('EditIncomeAndExpenseController', function () {
    'use strict';

    beforeEach(module('refresh.accountOrigination.customerInformation.edit.incomeAndExpense',
        'refresh.accountOrigination.domain.customer', 'refresh.dtmanalytics'));

    var scope, controller, CustomerService, updateIncomeAndExpensesSpy, CustomerInformationData, CancelConfirmationService,
        User, location, timeout, window, mock, applicationParameters;

    function PromiseLookUp(values) {
        return {
            promise: function () {
                return mock.resolve(values);
            }
        };
    }

    var Lookups = {
        incomeType: new PromiseLookUp([
            {code: '01', description: 'Gross salary'},
            {code: '02', description: 'Commission'}
        ]),
        expenseType: new PromiseLookUp([
            {code: '29', description: 'Alimony/maintenance'},
            {code: '28', description: 'Budget and savings'}
        ])
    };

    describe('routes', function () {
        var route, location;
        beforeEach(inject(function ($route, $location) {
            route = $route;
            location = $location;
        }));

        it('should load the correct controller', function () {
           expect(route.routes['/apply/:product/income/edit'].controller).toBe('EditIncomeAndExpenseController');
        });

        it('should load the correct template', function () {
            expect(route.routes['/apply/:product/income/edit'].templateUrl).toBe('features/accountorigination/customerInformation/partials/editIncomeAndExpenses.html');
        });
    });

    describe('controller', function () {
        var initialiseController = function () {
            controller('EditIncomeAndExpenseController', {
                $scope: scope,
                $timeout: timeout,
                CancelConfirmationService: CancelConfirmationService,
                CustomerService: CustomerService,
                LookUps: Lookups,
                $routeParams: {product: 'current-account'},
                User: User,
                ApplicationParameters: applicationParameters
            });

            scope.$digest();
            timeout.flush();
        };

        beforeEach(inject(function ($rootScope, $controller, ServiceTest, $timeout, $window, $location,
                                    _CustomerService_, _CustomerInformationData_, _CancelConfirmationService_, _mock_,
                                    _User_, _ApplicationParameters_) {
            CustomerService = _CustomerService_;
            CustomerInformationData = _CustomerInformationData_;
            CancelConfirmationService = _CancelConfirmationService_;
            location = $location;
            timeout = $timeout;
            window = spyOn($window.history, 'go');
            User = _User_;
            mock = _mock_;
            applicationParameters = _ApplicationParameters_;

            location.path('/apply/current-account/income/edit');
            updateIncomeAndExpensesSpy = spyOn(CustomerService, ['updateIncomeAndExpenses']).and.returnValue(_mock_.resolve());

            spyOn(User, 'hasDashboards').and.returnValue(true);

            spyOn(CancelConfirmationService, 'cancelEdit').and.callThrough();

            controller = $controller;
            scope = $rootScope.$new();
            scope.customerInformationData = CustomerInformationData.initialize({});

            initialiseController();
        }));

        describe('initialise', function () {
            describe('if the customer has income and total expense item', function () {
                var incomeExpenseItems = [{itemExpenditureIndicator: 'I', itemAmount: 200}, {itemExpenditureIndicator: 'E', itemTypeCode: '99', itemAmount: 300}];
                beforeEach(function () {
                    scope.customerInformationData.incomeExpenseItems = incomeExpenseItems;
                    initialiseController();
                });

                it('should not initialise an empty income and total expense item', function () {
                    expect(scope.customerInformationData.incomeExpenseItems.length).toBe(2);
                    expect(scope.customerInformationData.incomeExpenseItems).toEqual(incomeExpenseItems);
                });

                it('cancel button text should be cancel', function () {
                    expect(scope.cancelButtonText).toEqual('Cancel');
                });
            });

            describe('if the customer does not have any income and total expense item', function () {
                beforeEach(function () {
                    initialiseController();
                });

                it('should initialise an empty income and total expense item if the customer does not have them', function () {
                    var emptyIncomeAndExpense = [{itemExpenditureIndicator: 'I'}, {itemExpenditureIndicator: 'E', itemTypeCode: '99'}];
                    expect(scope.customerInformationData.incomeExpenseItems.length).toBe(2);
                    expect(scope.customerInformationData.incomeExpenseItems).toEqual(emptyIncomeAndExpense);
                });

                it('cancel button text should be back', function () {
                    expect(scope.cancelButtonText).toEqual('Back');
                });
            });
        });

        describe('on save', function () {

            it('should redirect back to view on successful update', function () {
                scope.incomeAndExpensesForm = {};
                scope.save();
                scope.$digest();

                expect(CustomerService.updateIncomeAndExpenses).toHaveBeenCalledWith(scope.customerInformationData);
                expect(location.url()).toBe('/apply/current-account/income');
            });

            describe('on error', function () {
                beforeEach(function () {
                    scope.incomeAndExpensesForm = {};
                    updateIncomeAndExpensesSpy.and.returnValue(mock.reject({message: 'random OTP error'}));
                    spyOn(applicationParameters, ['pushVariable']);
                });

                it('should show OTP errors for an existing user', function () {
                    scope.save();
                    scope.$digest();

                    expect(User.hasDashboards).toHaveBeenCalled();
                    expect(applicationParameters.pushVariable).toHaveBeenCalledWith('otpErrorMessage', 'random OTP error');
                });

                it('should not show OTP errors for a new user', function () {
                    User.hasDashboards.and.returnValue(false);
                    scope.save();
                    scope.$digest();

                    expect(User.hasDashboards).toHaveBeenCalled();
                    expect(applicationParameters.pushVariable).not.toHaveBeenCalledWith('otpErrorMessage', 'random OTP error');
                });

                it('should set server error message on scope', function () {
                    scope.save();
                    scope.$digest();

                    expect(scope.serverErrorMessage).toBe('random OTP error');
                });

                it('should not redirect to view income and expense page', function () {
                    scope.save();
                    scope.$digest();

                    expect(location.url()).not.toEqual('/apply/current-account/income');
                });
            });

        });

        describe("cancel", function () {
            it("should cancel edit using CancelConfirmationService", function () {
                scope.cancel();
                expect(CancelConfirmationService.cancelEdit).toHaveBeenCalledWith(jasmine.any(Function));
            });

            it("should call cancel confirmation and go back one in history", function () {
                scope.incomeForm = {$pristine: true};
                CancelConfirmationService.setEditForm(scope.incomeForm);
                scope.cancel();

                expect(window).toHaveBeenCalledWith(-1);
            });
        });

        describe('on next', function () {
            it('should navigate to consent page while cancelling customer information edit', function () {
                scope.incomeAndExpensesForm = {$pristine: true};
                CancelConfirmationService.setEditForm(scope.incomeAndExpensesForm);

                scope.next();

                expect(CancelConfirmationService.cancelEdit).toHaveBeenCalledWith(jasmine.any(Function));
                expect(location.url()).toBe('/apply/current-account/submit');
            });
        });

        describe('income', function () {
            it('should remove the income details field', function () {
                scope.incomeAndExpensesForm = jasmine.createSpyObj('form', ['$setDirty']);

                scope.customerInformationData = CustomerInformationData.initialize({
                    grossIncome: 324000.0,
                    incomeExpenseItems: [
                        {itemTypeCode: '01', itemAmount: 1000.0, itemExpenditureIndicator: 'E'},
                        {itemTypeCode: '04', itemAmount: 3600.0, itemExpenditureIndicator: 'I'}
                    ]
                });
                scope.removeItem(scope.customerInformationData.incomeExpenseItems[1]);
                expect(scope.customerInformationData.getIncomes().length).toBe(0);
                expect(scope.customerInformationData.incomeExpenseItems).toEqual([
                    {itemTypeCode: '01', itemAmount: 1000.0, itemExpenditureIndicator: 'E'},
                ]);
                expect(scope.incomeAndExpensesForm.$setDirty).toHaveBeenCalled();
            });

            it('should add additional income items', function () {
                scope.customerInformationData = CustomerInformationData.initialize({incomeExpenseItems: []});
                scope.addItem('I');
                expect(scope.customerInformationData.incomeExpenseItems.length).toBe(1);
                expect(scope.customerInformationData.incomeExpenseItems[0]).toEqual({
                    itemExpenditureIndicator: 'I'
                });
            });

            it('should fetch a list of income types', function () {
                expect(scope.incomeTypes).toEqual([
                    {code: '01', description: 'Gross salary'},
                    {code: '02', description: 'Commission'}
                ]);
            });

            it("should show add additional income item", function () {
                scope.customerInformationData = CustomerInformationData.initialize({
                    incomeExpenseItems: [
                        {'itemTypeCode': '01', itemExpenditureIndicator: 'I'}
                    ]
                });

                expect(scope.showAddIncomeItemLink()).toBeTruthy();
            });

            it("should hide add additional income item", function () {
                scope.customerInformationData = CustomerInformationData.initialize({
                    incomeExpenseItems: [
                        {'itemTypeCode': '01', itemExpenditureIndicator: 'I'},
                        {'itemTypeCode': '02', itemExpenditureIndicator: 'I'}
                    ]
                });

                expect(scope.showAddIncomeItemLink()).toBeFalsy();
            });
        });

        describe('getValidationNotification', function () {
            it('should get customer info validation for income', inject(function (CustomerInfoValidation) {
                spyOn(CustomerInfoValidation, ['getValidationNotificationForSection']);
                scope.getValidationNotification();
                expect(CustomerInfoValidation.getValidationNotificationForSection).toHaveBeenCalledWith('income');
            }));
        });

        describe('filter', function () {
            var allTypesFromService, selectedItems, currentItemTypeCode, filteredList;
            beforeEach(inject(function ($filter) {
                allTypesFromService = [
                    {'code': "01"},
                    {'code': '02'},
                    {'code': '03'}
                ];

                selectedItems = [
                    {'itemTypeCode': '01'},
                    {'itemTypeCode': '02'}
                ];

                currentItemTypeCode = '02';

                filteredList = $filter('typesFilter')(allTypesFromService, selectedItems, currentItemTypeCode);
            }));

            it('should remove original items from list', function () {
                expect(filteredList).not.toContain(jasmine.objectContaining({'code': "01"}));
            });

            it('should add current item type to list', function () {
                expect(filteredList).toContain(jasmine.objectContaining({'code': "02"}));
            });

            it('should add other item type to list', function () {
                expect(filteredList).toContain(jasmine.objectContaining({'code': "03"}));
            });
        });
    });
});
