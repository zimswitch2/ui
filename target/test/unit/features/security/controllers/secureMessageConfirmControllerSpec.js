describe('secure message confirm controller', function () {
    'use strict';
    var account = {
        "accountFeature": [
            {
                "feature": "BALANCE",
                "value": true
            },
            {
                "feature": "PAYMENTFROM",
                "value": true
            },
            {
                "feature": "STATEMENT",
                "value": true
            },
            {
                "feature": "TRANSFERFROM",
                "value": true
            },
            {
                "feature": "TRANSFERTO",
                "value": true
            },
            {
                "feature": "VOUCHER_PURCHASE",
                "value": true
            }
        ],
        "accountType": "CURRENT",
        "arrearStatus": false,
        "availableBalance": {
            "amount": 8756.41,
            "currency": "ZAR"
        },
        "branch": {
            "code": "27",
            "name": "BALLITO BRANCH      "
        },
        "card": {
            "countryCode": null,
            "number": "4451221116405778",
            "type": null
        },
        "creditLimit": null,
        "currentBalance": {
            "amount": 8756.41,
            "currency": "ZAR"
        },
        "customName": "",
        "disposalAccount": "",
        "errorIndicator": false,
        "goal": {
            "amount": {
                "amount": 0.00,
                "currency": "ZAR"
            },
            "name": ""
        },
        "holderName": null,
        "minimumPaymentDue": null,
        "nextInterestDue": {
            "amount": 0.00,
            "currency": "ZAR"
        },
        "noticeAmount": null,
        "overdraftAmount": {
            "amount": 0.00,
            "currency": "ZAR"
        },
        "overdraftBalance": {
            "amount": 0.00,
            "currency": "ZAR"
        },
        "primary": true,
        "productName": "ACCESSACC",
        "totalInterestEarned": null,
        "totalLoanAmount": null,
        "unclearedAmount": {
            "amount": 0.00,
            "currency": "ZAR"
        },
        "formattedNumber": "10-00-035-814-0",
        "keyValueMetadata": [
            {
                "key": "BDS_ACCOUNT_TYPE_CODE",
                "value": "000"
            },
            {
                "key": "BDS_ACCOUNT_TYPE",
                "value": "CURRENT"
            },
            {
                "key": "ACCOUNT_SUITE_ID",
                "value": "SP"
            },
            {
                "key": "ACCOUNT_STYLE",
                "value": "ACA"
            },
            {
                "key": "SOURCE_SYSTEM_ACCOUNT_TYPE_CODE",
                "value": "000"
            }
        ],
        "name": "Joe Smith",
        "number": "10000358140",
        "serialNumber": 0
    };

    beforeEach(module('refresh.secure.message.confirm'));

    var scope, mock, viewModel, flow, controller, location, secureMessageService, path, route;

    beforeEach(inject(function ($controller, $rootScope, $route, SecureMessageService, _mock_, ViewModel, Flow) {
        controller = $controller;
        scope = $rootScope.$new();
        flow = Flow;
        Flow.create(['Enter message', 'Confirm message', 'Enter OTP'], 'Secure Message');
        Flow.next();
        viewModel = ViewModel;
        mock = _mock_;
        secureMessageService = SecureMessageService;
        route = $route;

        path = jasmine.createSpyObj('path', ['replace']);
        location = jasmine.createSpyObj('$location', ['path']);
        location.path.and.returnValue(path);
    }));

    var initializeController = function () {
        controller('SecureMessageConfirmController', {
            $scope: scope,
            Flow: flow,
            ViewModel: viewModel,
            $location: location,
            SecureMessageService: secureMessageService
        });
        scope.$digest();
    };

    describe('current model', function () {
        it('should set secure message', function () {
            viewModel.current({secureMessage: {key: 'value'}});
            initializeController();
            expect(scope.secureMessage).toEqual({key: 'value'});
        });
    });

    describe('modify', function () {
        it('should prepare model for modify', function () {
            spyOn(viewModel, 'modifying');
            viewModel.current({key: 'keep this'});
            initializeController();
            scope.modify();
            expect(viewModel.modifying).toHaveBeenCalled();
            expect(viewModel.current()).toEqual({key: 'keep this'});
        });

        it('should change flow to previous', function () {
            spyOn(flow, 'previous');
            initializeController();
            scope.modify();
            expect(flow.previous).toHaveBeenCalled();
        });

        it('should navigate to detail page', function () {
            initializeController();
            scope.modify();
            expect(location.path).toHaveBeenCalledWith('/secure-message');
            expect(path.replace).toHaveBeenCalled();
        });
    });

    describe('confirm', function() {
        it('should confirm details', function () {
            spyOn(secureMessageService, 'sendSecureMessage');
            secureMessageService.sendSecureMessage.and.returnValue(mock.resolve());
            initializeController();
            scope.secureMessage = {
                account: account
            };
            scope.confirm();
            scope.$digest();
            expect(secureMessageService.sendSecureMessage).toHaveBeenCalled();
            expect(location.path).toHaveBeenCalledWith('/secure-message/results');
            expect(path.replace).toHaveBeenCalled();
        });

        it('should not confirm details', function () {
            spyOn(secureMessageService, 'sendSecureMessage');
            spyOn(viewModel, 'error');

            secureMessageService.sendSecureMessage.and.returnValue(mock.reject('Error'));
            initializeController();
            scope.secureMessage = {
                account: account
            };
            scope.confirm();
            scope.$digest();
            expect(secureMessageService.sendSecureMessage).toHaveBeenCalled();
            expect(viewModel.error).toHaveBeenCalledWith({message: 'Error'});
        });
    });

    describe('routing', function () {
        it('when secure message is present in the model should allow access', function () {
            viewModel.current({secureMessage: {}});
            var secureMessageRoute = route.routes['/secure-message/confirm'];
            expect(secureMessageRoute.controller).toEqual('SecureMessageConfirmController');
            expect(secureMessageRoute.allowedFrom[0].condition(viewModel)).toBeTruthy();
        });

        it('when no secure message is present in the model should not allow access', function () {
            viewModel.current({noSecureMessage: {}});
            var secureMessageRoute = route.routes['/secure-message/confirm'];
            expect(secureMessageRoute.controller).toEqual('SecureMessageConfirmController');
            expect(secureMessageRoute.allowedFrom[0].condition(viewModel)).toBeFalsy();
        });
    });
});
