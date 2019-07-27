describe('modify scheduled payment confirm', function () {
    'use strict';

    beforeEach(module('refresh.payment.future.controllers.modify.confirm'));

    var scope, controller, mock, beneficiariesListService, flow, applicationParameters, viewModel, card, scheduledPaymentsService, window, location, path;

    beforeEach(inject(function ($rootScope, $controller, $window, _mock_, ApplicationParameters, ViewModel) {
        scope = $rootScope;
        controller = $controller;
        mock = _mock_;
        flow = jasmine.createSpyObj('Flow', ['previous', 'get']);
        applicationParameters = ApplicationParameters;
        viewModel = ViewModel;
        window = $window;

        path = jasmine.createSpyObj('path', ['replace']);
        location = jasmine.createSpyObj('$location', ['path']);
        location.path.and.returnValue(path);

        beneficiariesListService = jasmine.createSpyObj('BeneficiariesListService', ['formattedBeneficiaryList']);
        beneficiariesListService.formattedBeneficiaryList.and.returnValue(mock.resolve());

        scheduledPaymentsService = jasmine.createSpyObj('ScheduledPaymentsService', ['amend']);
        scheduledPaymentsService.amend.and.returnValue(mock.resolve({success: true}));

        card = jasmine.createSpyObj('Card', ['current']);
        card.current.and.returnValue(mock.resolve({}));
    }));

    var initializeController = function () {
        controller('ModifyScheduledPaymentConfirmController', {
            $scope: scope,
            $location: location,
            Flow: flow,
            ViewModel: viewModel,
            BeneficiariesListService: beneficiariesListService,
            Card: card,
            ApplicationParameters: applicationParameters,
            ScheduledPaymentsService: scheduledPaymentsService
        });
        scope.$digest();
    };

    describe('controller initial', function () {
        var scheduledPayment = {futureTransaction: {futureDatedInstruction: {repeatInterval: 'Daily'}}};
        var paymentDetail = new PaymentDetail({repeatInterval: 'Daily'});
        beforeEach(function () {
            var model = {
                scheduledPayment: scheduledPayment,
                amount: 100,
                paymentDetail: paymentDetail,
                beneficiary: 'beneficiary'
            };
            viewModel.current(model);
            viewModel.modifying();
            initializeController();
        });

        it('should get scheduled payment from view model', function () {
            expect(scope.scheduledPayment).toEqual(scheduledPayment);
        });

        it('should get amount from view model', function () {
            expect(scope.amount).toEqual(100);
        });

        it('should get payment detail from view model', function () {
            expect(scope.paymentDetail).toEqual(paymentDetail);
        });

        it('should get beneficiary from view model', function () {
            expect(scope.beneficiary).toEqual("beneficiary");
        });

    });

    describe('payment date label', function () {
        beforeEach(function () {
            initializeController();
        });

        it('should be \'First payment date\' if is recurring payment', function () {
            scope.isRecurringPayment = true;
            expect(scope.getPaymentDateLabel()).toBe('First payment date');
        });

        it('should be \'Payment date\' if is not recurring payment', function () {
            scope.isRecurringPayment = false;
            expect(scope.getPaymentDateLabel()).toBe('Payment date');
        });
    });

    describe('repeat payment description', function () {
        it('should be constructed with interval information', function () {
            initializeController();
            scope.intervalName = 'week';
            scope.repeatNumber = '5';
            expect(scope.getRepeatPaymentDescription()).toBe('Every week for 5 weeks');
        });
    });


    describe('latest timestamp from server', function () {
        it('should set from application parameter', function () {
            applicationParameters.pushVariable('latestTimestampFromServer', moment('12 March 2014'));
            initializeController();
            expect(scope.latestTimestampFromServer.format('DD-MM-YYYY')).toBe('12-03-2014');
        });
    });


    describe('modify', function () {
        beforeEach(function () {
            initializeController();
        });

        it('should modify view model with scope values', function () {
            scope.scheduledPayment = 'scheduledPayment';
            scope.paymentDetail = 'paymentDetail';
            scope.beneficiary = 'beneficiary';
            scope.amount = 'amount';

            spyOn(viewModel, 'modifying');
            scope.modify();

            expect(viewModel.modifying).toHaveBeenCalled();
        });

        it('should flow has been returned to previous step', function () {
            scope.modify();
            expect(flow.previous).toHaveBeenCalled();
        });

        it('should change location path to modify page', function () {
            scope.modify();
            expect(location.path).toHaveBeenCalledWith('/payment/scheduled/modify');
            expect(path.replace).toHaveBeenCalled();
        });
    });

    describe('confirm modify', function () {
        var scheduledPayment = {
            futureTransaction: {
                futureDatedId: '3612248739724',
                futureDatedInstruction: {repeatInterval: 'Daily'}
            }
        };
        var paymentDetail = new PaymentDetail({repeatInterval: 'Daily'});

        beforeEach(function () {
            var model = {
                scheduledPayment: scheduledPayment,
                amount: 100,
                paymentDetail: paymentDetail,
                beneficiary: 'beneficiary'
            };
            viewModel.current(model);
            viewModel.modifying();
            initializeController();
        });

        describe('upon failure', function () {
            it('should amend with http 500 error status', function () {
                spyOn(viewModel, 'error');
                scheduledPaymentsService.amend.and.returnValue(mock.reject({success: false}, 500));
                scope.confirm();
                scope.$digest();
                expect(scheduledPaymentsService.amend).toHaveBeenCalled();
                expect(viewModel.error).toHaveBeenCalledWith({message: 'Could not schedule'});
                expect(flow.previous).toHaveBeenCalled();
                expect(location.path).toHaveBeenCalledWith('/payment/scheduled/modify');
                expect(path.replace).toHaveBeenCalled();
            });

            it('amend scheduled payment with http 401 error status', function () {
                spyOn(viewModel, 'error');
                scheduledPaymentsService.amend.and.returnValue(mock.reject({message: 'some message'}, 401));
                scope.confirm();
                scope.$digest();
                expect(scheduledPaymentsService.amend).toHaveBeenCalled();
                expect(viewModel.error).toHaveBeenCalledWith({message: 'Could not schedule some message'});
                expect(flow.previous).toHaveBeenCalled();
                expect(location.path).toHaveBeenCalledWith('/payment/scheduled/modify');
                expect(path.replace).toHaveBeenCalled();
            });
        });

        describe('upon success', function () {
            it('should call the scheduled payment service', function () {
                scope.confirm();
                expect(scheduledPaymentsService.amend).toHaveBeenCalled();
            });

            it('should return to the list of scheduled payments by going history -1 with modified future dated id in view model', function () {
                spyOn(window.history, 'go');
                spyOn(viewModel, 'current');
                scope.confirm();
                scope.$digest();
                expect(window.history.go).toHaveBeenCalledWith(-1);
                expect(viewModel.current).toHaveBeenCalledWith({
                    modifiedFutureDatedId: '3612248739724'
                });
            });
        });
    });
});