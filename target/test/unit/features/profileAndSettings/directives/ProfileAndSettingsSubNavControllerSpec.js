describe('profileAndSettingsSubNav', function () {
    'use strict';
    var location;
    var firstAccount = {
        "accountFeature": [
            {
                "feature": "PAYMENTFROM",
                "value": true
            }
        ],
        accountType: 'CURRENT',
        formattedNumber: "12-34-567-890-0",
        availableBalance: {amount: 9000.0},
        name: "CURRENT",
        number: 'accountBeingUsed'
    };
    var accounts = [
        firstAccount,
        {
            "accountFeature": [
                {
                    "feature": "PAYMENTFROM",
                    "value": true
                }
            ],
            accountType: 'CREDIT_CARD',
            "formattedNumber": "1234-1234-1234-1234",
            "availableBalance": {"amount": 10000.0},
            name: "CREDIT_CARD"
        },
        {
            "accountFeature": [
                {
                    "feature": "PAYMENTFROM",
                    "value": false
                }
            ],
            accountType: 'HOME_LOAN',
            "formattedNumber": "1234-1234-1234-1234",
            "availableBalance": {"amount": 10000.0},
            name: "HOME_LOAN"
        }, {
            "accountFeature": [
                {
                    "feature": "PAYMENTFROM",
                    "value": false
                }
            ],
            accountType: 'SAVING',
            "formattedNumber": "1234-1234-1234-1111",
            "availableBalance": {"amount": 10001.0},
            name: "SAVING"
        }
    ];
    var cardProfile = {dailyWithdrawalLimit: {amount: 1000}};
    beforeEach(module('refresh.profileAndSettings.profileAndSettingsSubNav'));

    describe('controller', function () {

        var scope, expectedItems, accountsService, card, controller;

        function initialController() {
            controller('ProfileAndSettingsSubNavController', {
                $scope: scope,
                $location: location,
                AccountsService: accountsService,
                Card: card
            });
            scope.$digest();
        }

        beforeEach(inject(function ($rootScope, $controller, mock) {
            scope = $rootScope.$new();
            accountsService = jasmine.createSpyObj('AccountsService', ['list']);
            accountsService.list.and.returnValue(mock.resolve({accounts: accounts, cardProfile: cardProfile}));
            card = jasmine.createSpyObj('Card', ['current']);
            location = jasmine.createSpyObj('$location', ['path']);
            controller = $controller;
            initialController();
        }));

        it('should contain a list of sub navigation items', function () {
            initialController();
            expectedItems = [
                {
                    url: '#/dashboards',
                    text: 'My dashboards'
                },
                {
                    url: '#/monthly-payment-limit',
                    text: 'Monthly payment limit'
                }
            ];

            var items = scope.getItems('myProfileMenuItems');
            expect(items.length > 0).toBeTruthy();
            expect(items).toEqual(expectedItems);
        });

        it('should return the current location', function () {

            var currentLocationPath = 'a/path';
            var menuItem = {url: currentLocationPath};

            location.path.and.returnValue(currentLocationPath);
            var result = scope.isCurrentLocation(menuItem);

            expect(location.path).toHaveBeenCalled();
            expect(result).toBeTruthy();

            currentLocationPath = 'another/path';

            location.path.and.returnValue(currentLocationPath);
            result = scope.isCurrentLocation(menuItem);
            expect(location.path).toHaveBeenCalled();
            expect(result).toBeFalsy();

        });

        it('should get a list of current/credit/homeLoan accounts', function () {
            expect(card.current).toHaveBeenCalled();
            var validAccounts = scope.getItems('accounts');
            expect(validAccounts.length).toBe(2);
            var firstAccount = validAccounts[0];
            expect(firstAccount.url).toEqual('#/account-preferences/' + firstAccount.number);
            expect(firstAccount.trackKey).toEqual('Profile.Product preference.Formal statement.View');
            validAccounts.forEach(function (item) {
                expect(item.text).not.toEqual('1234-1234-1234-1111');
            });
        });
    });

});