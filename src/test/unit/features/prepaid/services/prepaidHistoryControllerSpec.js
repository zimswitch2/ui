describe('Prepaid History Controller', function () {
    'use strict';

    beforeEach(module('refresh.prepaid.history.controller', function ($provide) {
        $provide.value('User', {
            userProfile: {
                currentDashboard: {
                    card: '12345'
                }
            }
        });
    }));

    describe('routes', function () {
        var route;

        beforeEach(inject(function ($route) {
            route = $route;
        }));

        describe('when prepaid history is viewed', function () {
            it('should use the correct controller ', function () {
                expect(route.routes['/prepaid/history'].controller).toEqual('PrepaidHistoryController');
            });

            it('should use the correct template ', function () {
                expect(route.routes['/prepaid/history'].templateUrl).toEqual('features/prepaid/partials/prepaidHistory.html');
            });
        });
    });

    describe('PrepaidHistoryController', function () {

        var scope, window, rootScope, prepaidHistoryService, mock, applicationParameterService, $controller, controller;

        var initializeController = function() {
            controller = $controller('PrepaidHistoryController', {
                $scope: scope,
                PrepaidHistoryService: prepaidHistoryService
            });
        };

        var prepaidTransaction1 = {
            "account": {
                "formattedNumber": "null",
                "keyValueMetadata": [],
                "name": "null",
                "number": "0000000061301841",
                "serialNumber": "null"
            },
            "amount": {
                "amount": 10,
                "currency": "ZAR"
            },
            "invoiceNumber": "SD181909",
            "pin": "12345678901234567890  ",
            "prepaidProviderType": "Vodacom",
            "rechargeType": "Airtime",
            "rechargeDate": "2013-12-05T22:00:00.000+0000",
            "rechargeNumber": "0821231234",
            "status": "Successful"
        };
        var prepaidTransaction2 = {
            "account": {
                "formattedNumber": "null",
                "keyValueMetadata": [],
                "name": "null",
                "number": "0000000061301841",
                "serialNumber": "null"
            },
            "amount": {
                "amount": 10,
                "currency": "ZAR"
            },
            "invoiceNumber": "SD181919",
            "pin": "12345678901234567892  ",
            "prepaidProviderType": "MTN",
            "voucherType": "Airtime",
            "rechargeDate": "2014-12-05T22:00:00.000+0000",
            "rechargeNumber": "0831231234",
            "status": "Successful"
        };
        var prepaidTransaction3 = {
            "account": {
                "formattedNumber": "null",
                "keyValueMetadata": [],
                "name": "null",
                "number": "0000000061301841",
                "serialNumber": "null"
            },
            "amount": {
                "amount": 10,
                "currency": "ZAR"
            },
            "invoiceNumber": "SD181919",
            "pin": "12345678901234567892  ",
            "prepaidProviderType": "CELL C",
            "voucherType": "",
            "rechargeDate": "2014-12-02T22:00:00.000+0000",
            "rechargeNumber": "0841231234",
            "status": "Unsuccessful"
        };

        beforeEach(inject(function($rootScope, _$controller_, $window, _mock_, ApplicationParameters) {
            rootScope = $rootScope;
            $controller = _$controller_;
            scope = $rootScope.$new();
            window = $window;
            mock = _mock_;
            prepaidHistoryService = jasmine.createSpyObj('prepaidHistoryService', ['history']);
            prepaidHistoryService.history.and.returnValue(mock.resolve([prepaidTransaction1, prepaidTransaction2, prepaidTransaction3]));
            applicationParameterService = ApplicationParameters;
            applicationParameterService.pushVariable('profile', {authToken: 'abcde'});
            applicationParameterService.pushVariable('latestTimestampFromServer', moment('12 May 2016'));
        }));

        describe('when initializing', function() {
            it('should default the end date to the latest date from the server', function () {
                initializeController();
                expect(controller.dateTo).toEqual('12 May 2016');
            });

            it('should default the start date to 30 days before the latest date from the server', function () {
                initializeController();
                expect(controller.dateFrom).toEqual('12 April 2016');
            });

            it('should call the prepaid service with the date from and date to', function() {
                initializeController();
                expect(prepaidHistoryService.history).toHaveBeenCalledWith('2016-04-12', '2016-05-12');
            });

            describe('when there are no transactions', function () {

                beforeEach(function () {
                    prepaidHistoryService.history.and.returnValue(mock.reject({
                        message: 'No prepaid purchases in this period',
                        id: '3100'
                    }));
                    initializeController();
                    scope.$digest();
                });

                it('should have no transactions in information message', function () {
                    expect(controller.informationMessage).toEqual('No prepaid purchases in this period');
                });

                it('should set printInvoiceNumber to undefined', function () {
                    expect(controller.printInvoiceNumber).toBeUndefined();
                });
            });

            describe('when there are service errors', function () {
                beforeEach(function () {
                    prepaidHistoryService.history.and.returnValue(mock.reject({message: 'An error has occured'}));
                    initializeController();
                    scope.$digest();
                });

                it('should display generic error message', function () {
                    scope.$digest();
                    expect(controller.errorMessage).toEqual('This service is currently unavailable. Please try again later, while we investigate');
                });
            });

            describe('when there are transactions', function () {

                beforeEach(function () {
                    prepaidHistoryService.history.and.returnValue(mock.resolve([prepaidTransaction1, prepaidTransaction2, prepaidTransaction3]));
                    initializeController();
                    scope.$digest();
                });

                it('should have information message as undefined', function () {
                    expect(controller.informationMessage).toBeUndefined();
                });

                it('should have a list of transactions', function () {
                    expect(controller.transactions.length).toBeGreaterThan(0);
                });

                it('should have mapped transactions', function () {
                    expect(controller.transactions[0]).toEqual(prepaidTransaction1);
                });
            });
        });

        describe('when printing', function() {

            var windowSpy;

            beforeEach(function () {
                windowSpy = spyOn(window, 'print');
                initializeController();
                scope.$digest();
            });

            describe('when printing the history list', function () {
                beforeEach(inject(function ($timeout) {
                    controller.print();
                    $timeout.flush();
                }));

                it('should set the printInvoiceNumber to undefined', function () {
                    expect(controller.printInvoiceNumber).toBe(undefined);
                });

                it('should set printHasInvoiceTransactionType to true for a transaction with a value for rechargeType',
                    function () {
                        expect(controller.printHasInvoiceTransactionType).toBeTruthy();
                    });

                it('should call window.print', function () {
                    expect(windowSpy).toHaveBeenCalled();
                });
            });

            describe('when printing an individual receipt', function () {
                it('should set the selectedTransaction to the given line item', function () {
                    windowSpy.and.callFake(function () {
                        expect(controller.selectedTransaction).toBe(prepaidTransaction1);
                    });
                    controller.print('SD181909');
                });

                it('should set printHasInvoiceTransactionType to true for a transaction with a value for rechargeType',
                    function () {
                        controller.print('SD181909');
                        expect(controller.printHasInvoiceTransactionType).toBeTruthy();
                    });

                it('should set printHasInvoiceTransactionType to false for a transaction without a value for rechargeType',
                    function () {
                        controller.print('SD181919');
                        expect(controller.printHasInvoiceTransactionType).toBeFalsy();
                    });

                it('should call window.print', inject(function ($timeout) {
                    controller.print('SD181909');
                    $timeout.flush();
                    expect(windowSpy).toHaveBeenCalled();
                }));
            });
        });

        describe('when getting prepaid for the last specified number of days', function () {
            beforeEach(function () {
                applicationParameterService.pushVariable('latestTimestampFromServer', moment('12 May 2016'));
                initializeController();
            });

            it('should set the end date to the latest timestamp from the server', function () {
                controller.dateTo = moment('17 Jun 2016').format('D MMMM YYYY');

                controller.getPrepaidForTheLast(30);

                expect(controller.dateTo).toEqual('12 May 2016');
            });

            it('should set the start date to the latest timestamp from the server minus the specified number of days', function () {
                controller.getPrepaidForTheLast(35);
                expect(controller.dateFrom).toEqual('7 April 2016');
            });

            it('should call the prepaid history service with the date from and date to', function () {
                controller.getPrepaidForTheLast(35);
                expect(prepaidHistoryService.history).toHaveBeenCalledWith('2016-04-07', '2016-05-12');
            });

            it('should reload the history list', function () {
                controller.getPrepaidForTheLast(35);
                scope.$digest();
                expect(controller.transactions.length).toEqual(3);
            });
        });
    });
});
