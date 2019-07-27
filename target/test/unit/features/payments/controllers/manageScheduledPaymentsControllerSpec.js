describe('ManageScheduledPaymentsController', function () {

    var scheduledPayments = [
        {
            beneficiaryName: "911 TRUCK RENTALS",
            amount: 11,
            nextPaymentDate: "2014-07-17T00:00:00.000+0000",
            finalPaymentDate: '2014-07-17T00:00:00.000+0000',
            frequency: 'Single',
            remainingPayments: 1,
            recipientId: 56,
            futureTransaction: {
                amount: {
                    amount: 11,
                    currency: "ZAR"
                },
                futureDatedId: "3613387054411",
                futureDatedInstruction: {
                    fromDate: "2014-07-17T00:00:00.000+0000",
                    repeatInterval: "Single",
                    repeatNumber: 1,
                    toDate: "2014-07-17T00:00:00.000+0000"
                },
                futureDatedItems: [
                    {
                        amount: {
                            amount: 11,
                            currency: "ZAR"
                        },
                        index: 1,
                        nextPaymentDate: "2014-07-17T00:00:00.000+0000"
                    }
                ],
                nextPaymentDate: "2014-07-17T00:00:00.000+0000"
            }
        },
        {
            beneficiaryName: 'DEMO',
            amount: 10,
            nextPaymentDate: "2014-06-26T00:00:00.000+0000",
            finalPaymentDate: '2014-07-03T00:00:00.000+0000',
            frequency: 'Weekly',
            remainingPayments: 2,
            recipientId: 12,
            futureTransaction: {
                "amount": {
                    "amount": 10,
                    "currency": "ZAR"
                },
                futureDatedId: "3612248739724",
                futureDatedInstruction: {
                    fromDate: "2014-06-19T00:00:00.000+0000",
                    repeatInterval: "Weekly",
                    repeatNumber: 3,
                    toDate: "2014-07-03T00:00:00.000+0000"
                },
                futureDatedItems: [
                    {
                        amount: {
                            amount: 10,
                            currency: "ZAR"
                        },
                        index: 1,
                        nextPaymentDate: "2014-06-26T00:00:00.000+0000"
                    },
                    {
                        amount: {
                            amount: 10,
                            currency: "ZAR"
                        },
                        index: 1,
                        nextPaymentDate: "2014-07-03T00:00:00.000+0000"
                    }
                ],
                nextPaymentDate: "2014-06-26T00:00:00.000+0000"
            }
        }
    ];

    beforeEach(module('refresh.payment.future.controllers', 'refresh.test'));

    var scope, mock, card, service, viewModel, location, controller;

    var initialController = function () {
        controller('ManageScheduledPaymentsController', {
            $scope: scope,
            $location: location,
            Card: card,
            ScheduledPaymentsService: service,
            ViewModel: viewModel
        });

        scope.$digest();
    };

    beforeEach(inject(function ($controller, $rootScope, _mock_) {
        scope = $rootScope.$new();
        mock = _mock_;
        controller = $controller;

        card = jasmine.createSpyObj('Card', ['current']);
        card.current.and.returnValue({number: '1234'});

        service = jasmine.createSpyObj('ScheduledPaymentsService', ['list', 'delete']);
        service.list.and.returnValue(mock.resolve(_.cloneDeep(scheduledPayments)));

        viewModel = jasmine.createSpyObj('ViewModel', ['current', 'modifying', 'initial']);
        viewModel.current.and.returnValue({});

        location = jasmine.createSpyObj('$location', ['path']);

        initialController();
    }));

    describe('routes', function () {
        var route;

        beforeEach(inject(function ($route) {
            route = $route;
        }));

        describe('managing future scheduled payments', function () {
            it('should use the correct template', function () {
                expect(route.routes['/payment/scheduled/manage'].templateUrl).toEqual('features/payment/partials/manageScheduledPayments.html');
            });

            it('should use the correct controller', function () {
                expect(route.routes['/payment/scheduled/manage'].controller).toEqual('ManageScheduledPaymentsController');
            });
        });
    });

    describe('on initialization', function () {

        it('should call the viewFutureScheduledPaymentService with the currently logged in card', function () {
            expect(scope.scheduledPayments).toEqual(scheduledPayments);
        });

        it("should have a confirm delete message", function () {
            expect(scope.confirmDeleteMessage()).toEqual('Are you sure you want to delete this scheduled payment?');
        });

        it('should have a error delete message', function () {
            expect(scope.errorDeleteMessage()).toEqual('Could not delete this scheduled payment, try again later.');
        });

        it('should mark a scheduled payment for deletion', function () {
            var scheduledPayment = scheduledPayments[0];
            scope.markForDeletion(scheduledPayment);
            expect(scope.currentDeletingId).toEqual('3613387054411');
        });

        it('should not indicate the current scheduled payment to be deleted', function () {
            var scheduledPayment = scheduledPayments[0];
            expect(scope.isBeingDeleted(scheduledPayment)).toBeFalsy();
        });

        it('should not indicate the current scheduled payment to be deleted', function () {
            var scheduledPayment = scheduledPayments[0];
            scope.currentDeletingId = scheduledPayment.futureTransaction.futureDatedId;
            expect(scope.isBeingDeleted(scheduledPayment)).toBeTruthy();
        });

        it('should move the one with future dated id in view model to top and set high light class', function () {
            viewModel.current.and.returnValue({modifiedFutureDatedId: '3612248739724'});
            initialController();
            expect(scope.scheduledPayments[0].futureTransaction.futureDatedId).toBe('3612248739724');
            expect(scope.scheduledPayments[0].highlightClass).toBe('highlight');
        });

        describe("sorting", function () {
            var sorter;

            beforeEach(inject(function ($sorter) {
                sorter = $sorter;
            }));

            it('should set the sorter', function () {
                expect(scope.sortBy).toEqual(sorter);
            });

            it('should sort by beneficiary name', function () {
                expect(scope.sort.criteria).toEqual('beneficiaryName');
            });

            it('should sort in descending order', function () {
                expect(scope.sort.descending).toEqual(true);
            });

            it('should have the sort arrow icon on the beneficiary name column by default', function () {
                expect(scope.sortArrowClass("")).toEqual('icon icon-sort');
            });

            it('should set the clicked column as active', function () {
                expect(scope.sortArrowClass('beneficiaryName')).toContain('active');
            });

            it('should set the sort criteria', function () {
                scope.sortBy('field');
                expect(scope.sort.criteria).toEqual('field');
            });
        });

        describe('no scheduled payments', function () {

            it('should false when there are scheduled payments', function () {
                expect(scope.noScheduledPayments()).toBeFalsy();
            });

            it('should true when there are no scheduled payments', function () {
                scope.scheduledPayments = [];
                expect(scope.noScheduledPayments()).toBeTruthy();
            });
        });
    });

    describe("on delete", function () {

        it("should delete the scheduled payment when a successful response is sent", function () {
            expect(scope.scheduledPayments.length).toBe(2);
            service.delete.and.returnValue(mock.resolve({success: true}));

            var scheduledPayment = scope.scheduledPayments[0];

            scope.delete(scheduledPayment);
            scope.$digest();
            expect(service.delete).toHaveBeenCalled();
            expect(scope.scheduledPayments.length).toBe(1);
        });

        it("should not delete the scheduled payment when a error response is sent", function () {
            expect(scope.scheduledPayments.length).toBe(2);

            service.delete.and.returnValue(mock.resolve({
                success: false,
                message: 'Could not delete scheduled payment'
            }));

            var scheduledPayment = scope.scheduledPayments[0];

            scope.delete(scheduledPayment).catch(function (response) {
                expect(response.success).toBeFalsy();
                expect(response.message).toEqual('Could not delete scheduled payment');
            });
            scope.$digest();

            expect(scope.scheduledPayments.length).toBe(2);
            expect(service.delete).toHaveBeenCalled();
        });

        it("should not delete the scheduled payment when the promise is rejected from the service call", function () {
            service.delete.and.returnValue(mock.reject({
                success: false,
                message: 'Could not delete scheduled payment'
            }));

            var scheduledPayment = scope.scheduledPayments[0];
            scope.delete(scheduledPayment).catch(function (response) {
                expect(response.success).toBeFalsy();
            });
            scope.$digest();

            expect(scope.scheduledPayments.length).toBe(2);
            expect(service.delete).toHaveBeenCalled();
        });
    });

    describe('modify', function () {
        it('should redirect to the modify scheduled payment page after setting the View Model', function () {
            scope.modify(scheduledPayments[1]);
            expect(viewModel.current).toHaveBeenCalled();
            var actualArgs = viewModel.current.calls.mostRecent().args[0];
            expect(actualArgs.scheduledPayment).toEqual(scheduledPayments[1]);
            expect(actualArgs.paymentDetail).toEqual(jasmine.objectContaining({
                repeatInterval: 'Weekly',
                repeatNumber: 3,
                fromDate: '2014-06-26T00:00:00.000+0000'
            }));

            expect(viewModel.modifying).toHaveBeenCalled();
            expect(location.path).toHaveBeenCalledWith('/payment/scheduled/modify');
        });
    });

    describe('scheduledPaymentFilter', function () {
        var scheduledPaymentFilter;
        beforeEach(inject(function ($filter) {
            scheduledPaymentFilter = $filter('scheduledPaymentFilter');
        }));

        it('should filter', function () {
            var result = scheduledPaymentFilter(scheduledPayments, 'TRUCK');
            expect(result.length).toBe(1);
            expect(result[0]).toEqual(scheduledPayments[0]);
        });

    });
});
