/*global sinon:false */

describe('ViewPaymentNotificationHistory', function () {
    beforeEach(module('refresh.payment-notification-history', 'refresh.test', 'refresh.configuration', 'refresh.navigation',
        'refresh.fixture', 'refresh.login'));
    var expectedPaymentConfirmationResponse = {
        "paymentConfirmationItems": [
            {
                "beneficiary": {
                    "accountNumber": null,
                    "bank": {
                        "branch": {
                            "code": 2442,
                            "name": null
                        },
                        "code": null,
                        "name": null
                    },
                    "beneficiaryType": "COMPANY",
                    "recentPayment": [
                        {
                            "amount": {
                                "amount": 12,
                                "currency": "ZAR"
                            },
                            "date": "2014-06-24T22:00:00.000+0000"
                        }
                    ],
                    "customerReference": "TEST",
                    "favourite": null,
                    "name": "911 TRUCK RENTALS",
                    "paymentConfirmation": {
                        "address": "Www@qwy.co.za",
                        "confirmationType": "Email",
                        "recipientName": "Wen",
                        "sendFutureDated": null
                    },
                    "recipientGroup": {
                        "name": "",
                        "oldName": "",
                        "orderIndex": 0
                    },
                    "recipientId": 901,
                    "recipientReference": "TEST"
                },
                "confirmationStatus": "S",
                "transactionNumber": 148054
            },
            {
                "beneficiary": {
                    "accountNumber": null,
                    "bank": {
                        "branch": {
                            "code": 27,
                            "name": null
                        },
                        "code": null,
                        "name": null
                    },
                    "beneficiaryType": "COMPANY",
                    "recentPayment": [
                        {
                            "amount": {
                                "amount": 1,
                                "currency": "ZAR"
                            },
                            "date": "2014-05-24T22:00:00.000+0000"
                        }
                    ],
                    "customerReference": "TEST",
                    "favourite": null,
                    "name": "WAYNE WAS HERE",
                    "paymentConfirmation": {
                        "address": "0787477220",
                        "confirmationType": "Fax",
                        "recipientName": "wayne was here",
                        "sendFutureDated": null
                    },
                    "recipientGroup": {
                        "name": "",
                        "oldName": "",
                        "orderIndex": 0
                    },
                    "recipientId": 901,
                    "recipientReference": "SDHJFGD"
                },
                "confirmationStatus": "S",
                "transactionNumber": 148051
            }
        ]
    };

    var expectedFormattedPaymentConfirmationResponse = {
        "paymentConfirmationItems": [
            {
                "paymentDate": '2014-06-24T22:00:00.000+0000',
                "amount": 12,
                "beneficiaryName": "911 TRUCK RENTALS",
                "beneficiaryReference": "TEST",
                "paymentConfirmationMethod": "Email",
                "recipientName": "Wen",
                "sentTo": "Www@qwy.co.za",
                "originalHistory": {
                    "beneficiary": {
                        "accountNumber": null,
                        "bank": {
                            "branch": {
                                "code": 2442,
                                "name": null
                            },
                            "code": null,
                            "name": null
                        },
                        "beneficiaryType": "COMPANY",
                        "recentPayment": [
                            {
                                "amount": {
                                    "amount": 12,
                                    "currency": "ZAR"
                                },
                                "date": "2014-06-24T22:00:00.000+0000"
                            }
                        ],
                        "customerReference": "TEST",
                        "favourite": null,
                        "name": "911 TRUCK RENTALS",
                        "paymentConfirmation": {
                            "address": "Www@qwy.co.za",
                            "confirmationType": "Email",
                            "recipientName": "Wen",
                            "sendFutureDated": null
                        },
                        "recipientGroup": {
                            "name": "",
                            "oldName": "",
                            "orderIndex": 0
                        },
                        "recipientId": 901,
                        "recipientReference": "TEST"
                    },
                    "confirmationStatus": "S",
                    "transactionNumber": 148054
                }
            },
            {
                "paymentDate": '2014-05-24T22:00:00.000+0000',
                "amount": 1,
                "beneficiaryName": "WAYNE WAS HERE",
                "beneficiaryReference": "SDHJFGD",
                "paymentConfirmationMethod": "Fax",
                "recipientName": "wayne was here",
                "sentTo": "0787477220",
                "originalHistory": {
                    "beneficiary": {
                        "accountNumber": null,
                        "bank": {
                            "branch": {
                                "code": 27,
                                "name": null
                            },
                            "code": null,
                            "name": null
                        },
                        "beneficiaryType": "COMPANY",
                        "recentPayment": [
                            {
                                "amount": {
                                    "amount": 1,
                                    "currency": "ZAR"
                                },
                                "date": "2014-05-24T22:00:00.000+0000"
                            }
                        ],
                        "customerReference": "TEST",
                        "favourite": null,
                        "name": "WAYNE WAS HERE",
                        "paymentConfirmation": {
                            "address": "0787477220",
                            "confirmationType": "Fax",
                            "recipientName": "wayne was here",
                            "sendFutureDated": null
                        },
                        "recipientGroup": {
                            "name": "",
                            "oldName": "",
                            "orderIndex": 0
                        },
                        "recipientId": 901,
                        "recipientReference": "SDHJFGD"
                    },
                    "confirmationStatus": "S",
                    "transactionNumber": 148051
                }
            }
        ]
    };

    describe('payment notification filter', function () {
        using([
            {field: 'paymentDate', query: 'ay', matchingText: "2014-05-24T22:00:00.000+0000"},
            {field: 'amount', query: '12', matchingText: 12},
            {field: 'beneficiaryName', query: '911', matchingText: "911 TRUCK RENTALS"},
            {field: 'beneficiaryReference', query: 'ST', matchingText: "TEST"},
            {field: 'paymentConfirmationMethod', query: 'Emai', matchingText: "Email"},
            {field: 'recipientName', query: 'We', matchingText: "Wen"},
            {field: 'sentTo', query: '.za', matchingText: "Www@qwy.co.za"}
        ], function (example) {
            it('should filter payments for a given search criteria: ' + JSON.stringify(example), inject(
                function (paymentNotificationFilter) {
                    var matched = paymentNotificationFilter(expectedFormattedPaymentConfirmationResponse.paymentConfirmationItems,
                        example.query);
                    expect(matched.length).toEqual(1);
                    expect(matched[0][example.field]).toEqual(example.matchingText);
                }));
        });

        it('should match all when search criteria is undefined', inject(function (paymentNotificationFilter) {
            var matched = paymentNotificationFilter(expectedFormattedPaymentConfirmationResponse.paymentConfirmationItems,
                undefined);
            expect(matched).toEqual(expectedFormattedPaymentConfirmationResponse.paymentConfirmationItems);
        }));
    });

    describe('routes', function () {
        var route;

        beforeEach(inject(function ($route) {
            route = $route;
        }));

        describe('when viewing payment confirmation history', function () {
            it('should use the correct controller', function () {
                expect(route.routes['/payment-notification/history/:formattedNumber?'].controller).toEqual('ViewPaymentNotificationHistoryController');
            });

            it('should use the correct template', function () {
                expect(route.routes['/payment-notification/history/:formattedNumber?'].templateUrl).toEqual('features/payment/partials/paymentNotificationHistory.html');
            });
        });
    });

    describe('when initialized', function () {
        var scope, routeParams, mock, accountsService, viewPaymentNotificationHistoryService, card, location;
        var accounts = [
            {
                "accountFeature": [
                    {
                        "feature": "PAYMENTFROM",
                        "value": true
                    }
                ],
                "formattedNumber": "12-34-567-890-0",
                "availableBalance": {"amount": 9000.0},
                name: "CURRENT",
                number: "12345678900"
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
                name: "CREDIT_CARD",
                number: "1234123412341234"
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
                name: "HOME_LOAN",
                number: "1234123412341234"
            }
        ];

        describe('valid account number with pay from feature with more than 100 payment history items', function () {
            beforeEach(inject(function ($rootScope, $controller, $routeParams, _mock_) {
                routeParams = $routeParams;
                scope = $rootScope.$new();
                mock = _mock_;
                accountsService = jasmine.createSpyObj('accountsService', ['list', 'validFromPaymentAccounts']);
                viewPaymentNotificationHistoryService =
                    jasmine.createSpyObj('viewPaymentNotificationHistoryService', ['viewPaymentNotificationHistory']);
                card = jasmine.createSpyObj('card', ['current']);
                card.current.and.returnValue({number: '122332'});
                location = jasmine.createSpyObj('location', ['path']);
                var validAccount = {number: "12345678900"};

                accountsService.list.and.returnValue(mock.resolve({"accounts": accounts}));
                accountsService.validFromPaymentAccounts.and.returnValue([accounts[0], accounts[1]]);
                viewPaymentNotificationHistoryService.viewPaymentNotificationHistory.and.returnValue(mock.resolve({warningMessage: 'Displaying your 100 most recent notifications'}));

                routeParams.formattedNumber = '12-34-567-890-0';

                $controller('ViewPaymentNotificationHistoryController', {
                    $scope: scope,
                    $routeParams: routeParams,
                    AccountsService: accountsService,
                    ViewPaymentNotificationHistoryService: viewPaymentNotificationHistoryService,
                    Card: card,
                    $location: location
                });

                scope.$digest();
            }));

            it('should display a warning message', function () {
                expect(scope.warningMessage).toEqual('Displaying your 100 most recent notifications');
            });

        });

        describe('valid account number with pay from feature', function () {
            beforeEach(inject(function ($rootScope, $controller, $routeParams, _mock_) {
                routeParams = $routeParams;
                scope = $rootScope.$new();
                mock = _mock_;
                accountsService = jasmine.createSpyObj('accountsService', ['list', 'validFromPaymentAccounts']);
                viewPaymentNotificationHistoryService =
                    jasmine.createSpyObj('viewPaymentNotificationHistoryService', ['viewPaymentNotificationHistory']);
                card = jasmine.createSpyObj('card', ['current']);
                card.current.and.returnValue({number: '122332'});
                location = jasmine.createSpyObj('location', ['path']);
                var validAccount = {number: "12345678900", formattedNumber: '12-34-567-890-0'};

                accountsService.list.and.returnValue(mock.resolve({"accounts": accounts}));
                accountsService.validFromPaymentAccounts.and.returnValue([accounts[0], accounts[1]]);
                viewPaymentNotificationHistoryService.viewPaymentNotificationHistory.and.returnValue(mock.resolve(expectedPaymentConfirmationResponse));

                routeParams.formattedNumber = validAccount.formattedNumber;

                $controller('ViewPaymentNotificationHistoryController', {
                    $scope: scope,
                    $routeParams: routeParams,
                    AccountsService: accountsService,
                    ViewPaymentNotificationHistoryService: viewPaymentNotificationHistoryService,
                    Card: card,
                    $location: location
                });

                scope.$digest();
            }));

            it('should only list accounts with the pay from feature', function () {
                expect(scope.payFromAccounts.length).toEqual(2);
            });

            it('should retrieve a formatted data set for the payment confirmation history', function () {
                expect(viewPaymentNotificationHistoryService.viewPaymentNotificationHistory).toHaveBeenCalled();
                expect(scope.paymentNotificationHistory).toEqual(expectedFormattedPaymentConfirmationResponse.paymentConfirmationItems);
            });

            it('should change account being viewed upon changing select box', function () {
                var pathMock = jasmine.createSpyObj('object', ['replace']);
                location.path.and.returnValue(pathMock);
                scope.changeAccountTo('12345678900-0');
                expect(location.path).toHaveBeenCalledWith('/payment-notification/history/12345678900-0');
                expect(pathMock.replace).toHaveBeenCalled();
            });

            it('should clear selectedHistory in scope', function () {
                scope.selectedHistory = 'something';
                scope.clearSelection();
                expect(scope.selectedHistory).toBeUndefined();
            });
        });

        describe('filtering when list of payments is undefined', function () {

            var scope, mock, viewPaymentNotificationHistoryService;

            beforeEach(inject(function ($rootScope, $controller, _mock_) {
                scope = $rootScope.$new();
                mock = _mock_;
                viewPaymentNotificationHistoryService =
                    jasmine.createSpyObj('viewPaymentNotificationHistoryService', ['viewPaymentNotificationHistory']);
                viewPaymentNotificationHistoryService.viewPaymentNotificationHistory.and.returnValue(mock.resolve(undefined));

                $controller('ViewPaymentNotificationHistoryController', {
                    $scope: scope,
                    ViewPaymentNotificationHistoryService: viewPaymentNotificationHistoryService
                });
            }));

            it('should not set list of payment confirmation history', function () {
                expect(scope.paymentNotificationHistory).toBeUndefined();
            });
        });

        describe('when an error occurs', function () {
            var controller;

            beforeEach(inject(function ($rootScope, $controller, $routeParams, _mock_) {
                routeParams = $routeParams;
                scope = $rootScope.$new();
                mock = _mock_;
                accountsService = jasmine.createSpyObj('accountsService', ['list', 'validFromPaymentAccounts']);
                viewPaymentNotificationHistoryService =
                    jasmine.createSpyObj('viewPaymentNotificationHistoryService', ['viewPaymentNotificationHistory']);
                card = jasmine.createSpyObj('card', ['current']);
                card.current.and.returnValue({number: '122332'});
                location = jasmine.createSpyObj('location', ['path']);

                accountsService.list.and.returnValue(mock.resolve({"accounts": accounts}));
                accountsService.validFromPaymentAccounts.and.returnValue([accounts[0], accounts[1]]);
                viewPaymentNotificationHistoryService.viewPaymentNotificationHistory.and.returnValue(mock.reject({message: 'Oops'}));

                routeParams.formattedNumber = '12-34-567-890-0';
                controller = $controller;
            }));

            function initController() {
                controller('ViewPaymentNotificationHistoryController', {
                    $scope: scope,
                    $routeParams: routeParams,
                    AccountsService: accountsService,
                    ViewPaymentNotificationHistoryService: viewPaymentNotificationHistoryService,
                    Card: card,
                    $location: location
                });
            }

            it('should handle a service error', function () {
                initController();
                scope.$digest();
                expect(scope.errorMessage).toEqual('Oops');
            });

            it('should handle an unexpected error', function () {
                viewPaymentNotificationHistoryService.viewPaymentNotificationHistory.and.returnValue(mock.reject(new TypeError("unexpected error occurred")));
                initController();
                scope.$digest();
                expect(scope.errorMessage).toEqual('This service is currently unavailable. Please try again later, while we investigate');
            });

        });

        describe('with invalid account number', function () {

            beforeEach(inject(function ($rootScope, $controller, $routeParams, _mock_) {
                routeParams = $routeParams;
                scope = $rootScope.$new();
                mock = _mock_;
                accountsService = jasmine.createSpyObj('accountsService', ['list', 'validFromPaymentAccounts']);
                viewPaymentNotificationHistoryService =
                    jasmine.createSpyObj('viewPaymentNotificationHistoryService', ['viewPaymentNotificationHistory']);
                card = jasmine.createSpyObj('card', ['current']);
                card.current.and.returnValue({number: '122332'});
                location = jasmine.createSpyObj('location', ['path']);
                var validAccount = {number: "12345678900", formattedNumber: "12345678900-0"};

                accountsService.list.and.returnValue(mock.resolve({"accounts": accounts}));
                accountsService.validFromPaymentAccounts.and.returnValue([accounts[0], accounts[1]]);
                viewPaymentNotificationHistoryService.viewPaymentNotificationHistory.and.returnValue(mock.resolve(expectedPaymentConfirmationResponse));

                routeParams.formattedNumber = 0;

                $controller('ViewPaymentNotificationHistoryController', {
                    $scope: scope,
                    $routeParams: routeParams,
                    AccountsService: accountsService,
                    ViewPaymentNotificationHistoryService: viewPaymentNotificationHistoryService,
                    Card: card
                });

                scope.$digest();
            }));

            it('default to first account', inject(function ($location) {
                expect($location.path()).toEqual('/payment-notification/history/12-34-567-890-0');
            }));

        });

        describe('with no account number', function () {

            beforeEach(inject(function ($rootScope, $controller, $routeParams, _mock_) {
                routeParams = $routeParams;
                scope = $rootScope.$new();
                mock = _mock_;
                accountsService = jasmine.createSpyObj('accountsService', ['list', 'validFromPaymentAccounts']);
                viewPaymentNotificationHistoryService =
                    jasmine.createSpyObj('viewPaymentNotificationHistoryService', ['viewPaymentNotificationHistory']);
                card = jasmine.createSpyObj('card', ['current']);
                card.current.and.returnValue({number: '122332'});
                location = jasmine.createSpyObj('location', ['path']);
                var validAccount = {number: "12345678900", formattedNumber: "12345678900-0"};

                accountsService.list.and.returnValue(mock.resolve({"accounts": accounts}));
                accountsService.validFromPaymentAccounts.and.returnValue([accounts[0], accounts[1]]);
                viewPaymentNotificationHistoryService.viewPaymentNotificationHistory.and.returnValue(mock.resolve(expectedPaymentConfirmationResponse));

                routeParams.formattedNumber = '';

                $controller('ViewPaymentNotificationHistoryController', {
                    $scope: scope,
                    $routeParams: routeParams,
                    AccountsService: accountsService,
                    ViewPaymentNotificationHistoryService: viewPaymentNotificationHistoryService,
                    Card: card
                });

                scope.$digest();
            }));

            it('default to first account', inject(function ($location) {
                expect($location.path()).toEqual('/payment-notification/history/12-34-567-890-0');
            }));

        });

    });

    describe('when initialized', function () {
        var scope, routeParams, mock, accountsService, viewPaymentNotificationHistoryService, card, location, resendConfirmationService;
        var accounts = [
            {
                "accountFeature": [
                    {
                        "feature": "PAYMENTFROM",
                        "value": true
                    }
                ],
                "formattedNumber": "12-34-567-890-0",
                "availableBalance": {"amount": 9000.0},
                name: "CURRENT",
                number: "12345678900"
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
                name: "CREDIT_CARD",
                number: "1234123412341234"
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
                name: "HOME_LOAN",
                number: "1234123412341234"
            }
        ];
        describe('Resend confirmation', function () {
            beforeEach(inject(function ($rootScope, $controller, $routeParams, _mock_, NotificationCostService) {
                routeParams = $routeParams;
                scope = $rootScope.$new();
                mock = _mock_;
                accountsService = jasmine.createSpyObj('accountsService', ['list', 'validFromPaymentAccounts']);
                viewPaymentNotificationHistoryService =
                    jasmine.createSpyObj('viewPaymentNotificationHistoryService', ['viewPaymentNotificationHistory']);
                resendConfirmationService = jasmine.createSpyObj('resendConfirmationService', ['resendConfirmation']);
                card = jasmine.createSpyObj('card', ['current']);
                card.current.and.returnValue({number: '122332'});
                location = jasmine.createSpyObj('location', ['path']);
                var validAccount = {number: "12345678900", formattedNumber: '12-34-567-890-0'};

                accountsService.list.and.returnValue(mock.resolve({"accounts": accounts}));
                accountsService.validFromPaymentAccounts.and.returnValue([accounts[0], accounts[1]]);
                viewPaymentNotificationHistoryService.viewPaymentNotificationHistory.and.returnValue(mock.resolve(expectedPaymentConfirmationResponse));
                resendConfirmationService.resendConfirmation.and.returnValue(mock.resolve({message: 'Pass', success: true}));

                routeParams.formattedNumber = validAccount.formattedNumber;

                $controller('ViewPaymentNotificationHistoryController', {
                    $scope: scope,
                    $routeParams: routeParams,
                    AccountsService: accountsService,
                    ViewPaymentNotificationHistoryService: viewPaymentNotificationHistoryService,
                    ResendConfirmationService: resendConfirmationService,
                    Card: card,
                    $location: location,
                    NotificationCostService: NotificationCostService
                });

                scope.$digest();
            }));

            it('should mark resend notification', function () {
                var paymentNotification = expectedFormattedPaymentConfirmationResponse.paymentConfirmationItems[0];
                scope.markForResend(paymentNotification);
                expect(scope.selectedHistory).toEqual(paymentNotification.originalHistory);
            });

            it('should indicate the current notification is ready be a send', function () {
                var paymentNotification = expectedFormattedPaymentConfirmationResponse.paymentConfirmationItems[0];
                scope.selectedHistory = paymentNotification.originalHistory;
                expect(scope.isAboutToSend(paymentNotification)).toBeTruthy();
            });

            it('should not indicate the current notification is ready be a send', function () {
                var paymentNotification = expectedFormattedPaymentConfirmationResponse.paymentConfirmationItems[0];
                expect(scope.isAboutToSend(paymentNotification)).toBeFalsy();
            });

            it('should resend confirmation', function () {
                scope.resend(expectedFormattedPaymentConfirmationResponse.paymentConfirmationItems[0]);
                scope.$digest();
                expect(resendConfirmationService.resendConfirmation).toHaveBeenCalledWith(card.current(),
                    expectedPaymentConfirmationResponse.paymentConfirmationItems[0]);
                expect(scope.successMessage).toEqual('Notification resent to Wen');
            });

            it('should not send confirmation', function () {
                resendConfirmationService.resendConfirmation.and.returnValue(mock.resolve({message: 'Error', success: false}));
                scope.resend(expectedFormattedPaymentConfirmationResponse.paymentConfirmationItems[0]);
                scope.$digest();
                expect(scope.errorMessage).toEqual('Error');
            });

            it("should not resend the notification payment when the promise is rejected from the service call", function () {
                resendConfirmationService.resendConfirmation.and.returnValue(mock.reject({
                    success: false,
                    message: 'Could not resend notification payment'
                }));

                var paymentNotification = scope.paymentNotificationHistory[0];
                scope.resend(paymentNotification).catch(function (response) {
                    expect(response.success).toBeFalsy();
                });
                scope.resend(paymentNotification);
                scope.$digest();

                expect(scope.paymentNotificationHistory.length).toBe(2);
                expect(resendConfirmationService.resendConfirmation).toHaveBeenCalled();
            });

            it('should contain cost in action message', function () {
                expect(scope.actionMessage('Email')).toEqual('Resend payment notification? Note that you will be charged a fee of <span class="rand-amount">R 0.70</span> for this Email');
            });
        });
    });
});
