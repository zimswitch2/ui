describe('Payment History Controller', function () {

    beforeEach(module('ngMessages', 'refresh.payment'));

    describe('routes', function () {
        var route;

        beforeEach(inject(function ($route) {
            route = $route;
        }));

        describe('when a user wants to see the payment history', function () {
            it('should use the correct controller', function () {
                expect(route.routes['/payment/history'].controller).toEqual('PaymentHistoryController');
            });

            it('should use the correct template', function () {
                expect(route.routes['/payment/history'].templateUrl).toEqual('features/payment/partials/paymentHistory.html');
            });
        });

        describe('Controller', function () {

            var paymentService, $controller, controller, applicationParameters, mock, scope, accountsService, Card;
            var currentCard = {number: 'Some returned value'};
            var historyList = [
                {
                    "account": {
                        "type": "CURRENT",
                        "name": "ELITE",
                        "number": "70456941"
                    },
                    "recipient": {
                        "name": "0234151677          ",
                        "accountNumber": "0000000009738614"
                    },
                    "yourReference": "000000000000171035  ",
                    "recipientReference": "127700764644690278       ",
                    "amount": 2000,
                    "date": "2016-03-23T14:54:28.000+0000"
                }];

            var historyResponse = {
                paymentHistoryItems: historyList,
                nextPaymentHistoryPageDetails: {
                    referenceNumber: 'refNumber',
                    atmdbtsqName: 'whatwhat'
                }
            };

            var accounts = [
                {formattedNumber: '12345', number: 'account number 1'},
                {formattedNumber: '67890', number: 'account number 2'},
                {formattedNumber: '12345', number: 'account number 1', accountType: 'UNKNOWN'},
                {formattedNumber: '12345', number: 'account number 1', accountType: 'CREDIT_CARD'}
            ];

            beforeEach(inject(function ($rootScope, _$controller_, ApplicationParameters, _mock_) {
                mock = _mock_;

                paymentService = jasmine.createSpyObj('PaymentService', ['getHistory']);
                paymentService.getHistory.and.returnValue(mock.resolve(historyResponse));

                accountsService = jasmine.createSpyObj('AccountsService', ['list']);
                accountsService.list.and.returnValue(mock.resolve({accounts: accounts}));

                Card = jasmine.createSpyObj('Card', ['current']);
                Card.current.and.returnValue(currentCard);

                $controller = _$controller_;
                applicationParameters = ApplicationParameters;

                scope = $rootScope.$new();
            }));

            function initializeController() {
                controller = $controller('PaymentHistoryController', {
                    $scope: scope,
                    PaymentService: paymentService,
                    AccountsService: accountsService,
                    Card: Card
                });

                scope.$digest();
            }

            describe('when initializing', function () {
                beforeEach(function () {
                    applicationParameters.pushVariable('latestTimestampFromServer', moment('12 May 2016'));
                    paymentService.getHistory.and.returnValue(mock.resolve(historyResponse));
                });

                it('should default the end date to the latest date from the server', function () {
                    initializeController();
                    expect(controller.dateTo).toEqual('12 May 2016');
                });

                it('should default the start date to 30 days before the latest date from the server', function () {
                    initializeController();
                    expect(controller.dateFrom).toEqual('12 April 2016');
                });

                it('should call the payment service with the date from and date to and the account number', function () {
                    initializeController();
                    expect(paymentService.getHistory).toHaveBeenCalledWith('2016-04-12T00:00', '2016-05-12T23:59', 'account number 1', null, null);
                });

                it('should set the items returned by the payment service as the history list', function () {
                    initializeController();
                    expect(controller.historyList).toEqual(historyList);
                });

                it('should set the next page details', function () {
                    initializeController();
                    expect(controller.nextPaymentHistoryPageDetails).toEqual({
                        referenceNumber: 'refNumber',
                        atmdbtsqName: 'whatwhat'
                    });
                });

                it('should set the month name on the history list items', function () {
                    initializeController();
                    expect(controller.historyList[0].monthName).toEqual('Mar');
                });

                it('should set the day of payment on the history list items', function () {
                    initializeController();
                    expect(controller.historyList[0].dayOfPayment).toEqual('23');
                });

                it('should set the current date as the latest timestamp from the server', function () {
                    initializeController();
                    expect(controller.currentDate).toEqual('12 May 2016');
                });

                it('should set the sort order to the reverse sort order', function () {
                    initializeController();
                    expect(controller.isReverseSortOrder).toEqual(true);
                });

                it('should call account service list with the card and call getTransactions setting the first load to false', function () {
                    initializeController();
                    expect(accountsService.list).toHaveBeenCalledWith(currentCard);
                });

                it('should populate scope.accounts with the retrieved accounts', function () {
                    initializeController();
                    expect(controller.accounts).toEqual([accounts[0], accounts[1], accounts[3]]);
                });

                it('should set the selected account to the first account', function () {
                    initializeController();


                    expect(controller.selectedAccount).toEqual(accounts[0]);
                });
            });

            describe('when checking the number of days selected', function () {
                beforeEach(function () {
                    applicationParameters.pushVariable('latestTimestampFromServer', moment('12 May 2016'));
                    initializeController();
                });

                it('should return true if the difference between the start day and end day is the number of days specified', function () {

                    controller.dateFrom = moment('12 Apr 2016').format('D MMMM YYYY');
                    controller.dateTo = moment('12 May 2016').format('D MMMM YYYY');

                    expect(controller.isNumberOfDaysSelected(30)).toBeTruthy();
                });

                it('should return false if the difference between the start day and end day is not the number of days specified', function () {
                    controller.dateFrom = moment('12 Apr 2016').format('D MMMM YYYY');
                    controller.dateTo = moment('12 May 2016').format('D MMMM YYYY');

                    expect(controller.isNumberOfDaysSelected(44)).toEqual(false);
                });
            });

            describe('when getting payments for the last specified number of days', function () {
                beforeEach(function () {
                    applicationParameters.pushVariable('latestTimestampFromServer', moment('12 May 2016'));

                    initializeController();

                    controller.selectedAccount = {formattedNumber: '12345', number: 'account number 1'};
                });

                it('should set the end date to the latest timestamp from the server', function () {
                    controller.dateTo = moment('17 Jun 2016').format('D MMMM YYYY');

                    controller.getPaymentsForTheLast(30);

                    expect(controller.dateTo).toEqual('12 May 2016');
                });

                it('should set the start date to the latest timestamp from the server minus the specified number of days', function () {
                    controller.getPaymentsForTheLast(35);
                    expect(controller.dateFrom).toEqual('7 April 2016');
                });

                it('should call the payment service with the date from and date to', function () {
                    controller.getPaymentsForTheLast(35);
                    expect(paymentService.getHistory).toHaveBeenCalledWith('2016-04-07T00:00', '2016-05-12T23:59', 'account number 1', null, null);
                });

                it('should reload the history list', function () {
                    controller.getPaymentsForTheLast(35);
                    scope.$digest();
                    expect(controller.historyList.length).toEqual(1);
                });
            });

            describe('when updating the from date', function () {
                beforeEach(function () {
                    applicationParameters.pushVariable('latestTimestampFromServer', moment('12 May 2016'));

                    initializeController();

                    controller.selectedAccount = {formattedNumber: '12345', number: 'account number 1'};
                });

                it('should set the from date on the controller', function () {
                    controller.updateFromDate(moment('14 May 2016'));
                    expect(controller.dateFrom).toEqual('14 May 2016');
                });

                it('should call the payment service with the date from and date to', function () {
                    controller.dateTo = '8 November 2016';
                    controller.updateFromDate(moment('14 May 2016'));
                    expect(paymentService.getHistory).toHaveBeenCalledWith('2016-05-14T00:00', '2016-11-08T23:59', 'account number 1', null, null);
                });

                it('should reload the history list', function () {
                    controller.dateTo = '8 November 2016';
                    controller.updateFromDate(moment('14 May 2016'));
                    scope.$digest();
                    expect(controller.historyList.length).toEqual(1);
                });
            });

            describe('when loading the history list', function() {
                beforeEach(function () {
                    applicationParameters.pushVariable('latestTimestampFromServer', moment('12 May 2016'));
                    initializeController();
                    controller.selectedAccount = {formattedNumber: '12345', number: 'account number 1'};
                });

                it('should call the payment service with the date from and date to', function () {
                    controller.loadHistoryList();
                    expect(paymentService.getHistory).toHaveBeenCalledWith('2016-04-12T00:00', '2016-05-12T23:59', 'account number 1', null, null);
                });

                it('should reload the history list', function () {
                    controller.loadHistoryList();
                    scope.$digest();
                    expect(controller.historyList.length).toEqual(1);
                });
            });

            describe('when updating the to date', function () {
                beforeEach(function () {
                    applicationParameters.pushVariable('latestTimestampFromServer', moment('12 May 2016'));
                    paymentService.getHistory.and.returnValue(mock.resolve(historyList));

                    initializeController();

                    controller.selectedAccount = {formattedNumber: '12345', number: 'account number 1'};
                });

                it('should set the from date on the controller', function () {
                    controller.updateToDate(moment('14 May 2016'));
                    expect(controller.dateTo).toEqual('14 May 2016');
                });

                it('should call the payment service with the date from and date to', function () {
                    controller.dateFrom = '8 November 2015';
                    controller.updateToDate(moment('14 May 2016'));
                    expect(paymentService.getHistory).toHaveBeenCalledWith('2015-11-08T00:00', '2016-05-14T23:59', 'account number 1', null, null);
                });
            });

            describe('when getting the earliest selectable date', function () {
                it('should return a date that is 180 days before the DateTo', function () {
                    applicationParameters.pushVariable('latestTimestampFromServer', moment('12 May 2016'));
                    paymentService.getHistory.and.returnValue(mock.resolve(historyResponse));
                    initializeController();

                    controller.dateTo = '16 June 2016';
                    expect(controller.earliestSelectableDate()).toEqual('19 December 2015');
                });
            });

            describe('when switching the sort order', function () {
                it('should set the sort order to the opposite sort order', function () {
                    initializeController();
                    controller.isReverseSortOrder = false;

                    controller.switchSortOrder();

                    expect(controller.isReverseSortOrder).toEqual(true);
                });
            });

            describe('when loading more payments', function () {
                beforeEach(function () {
                    applicationParameters.pushVariable('latestTimestampFromServer', moment('12 May 2016'));
                    paymentService.getHistory.and.returnValue(mock.resolve(historyResponse));

                    initializeController();

                    controller.selectedAccount = {formattedNumber: '12345', number: 'account number 1'};
                });

                it('should call the payment service with the date from and date to, and the next page details', function () {
                    controller.loadMorePayments();
                    expect(paymentService.getHistory.calls.mostRecent().args).toEqual(['2016-04-12T00:00', '2016-05-12T23:59', 'account number 1', 'refNumber', 'whatwhat']);
                });

                it('should set loading paginated to true when starting', function() {
                    controller.loadMorePayments();
                    expect(controller.loadingPaginated).toBeTruthy();
                });

                it('should add the new details to the list', function () {
                    controller.loadMorePayments();
                    scope.$digest();
                    expect(controller.historyList.length).toEqual(2);
                });

                it('should set loading paginated to false when completed', function() {
                    controller.loadMorePayments();
                    scope.$digest();
                    expect(controller.loadingPaginated).toBeFalsy();
                });
            });
        });
    });
});