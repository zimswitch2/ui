describe('account preferences', function () {
    'use strict';

    beforeEach(module('refresh.profileAndSettings.preferences'));

    describe('routes', function () {
        var route;

        beforeEach(inject(function ($route) {
            route = $route;
        }));

        describe('when landing on the accounts preferences view', function () {
            it('should use the correct controller ', function () {
                expect(route.routes['/account-preferences/:accountNumber'].controller).toEqual('AccountPreferencesController');
            });

            it('should use the correct template ', function () {
                expect(route.routes['/account-preferences/:accountNumber'].templateUrl).toEqual('features/profileAndSettings/partials/accountPreferences.html');
            });
        });
    });

    describe('AccountPreferencesController', function () {
        var scope, controller, accountsService, card, statementService, _mock, profilesAndSettingsMenu, location,
            accountPreferencesService, _accountLabelFilter, applicationParameters;

        var cardExample = {number: '123456789'};

        var firstAccount = {
            "accountFeature": [
                {
                    "feature": "PAYMENTFROM",
                    "value": true
                }
            ],
            "formattedNumber": "12-34-567-890-0",
            "availableBalance": {"amount": 9000.0},
            name: "CURRENT",
            productName: "CURRENT",
            number: 'accountBeingUsed',
            accountType: 'CURRENT'

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
                "formattedNumber": "1234-1234-1234-1234",
                "availableBalance": {"amount": 10000.0},
                name: "CREDIT_CARD",
                number: "123456783",
                productName: "CREDIT CARD",
                accountType: 'CREDIT_CARD'
            },
            {
                "accountFeature": [
                    {
                        "feature": "PAYMENTFROM",
                        "value": false
                    }
                ],
                "formattedNumber": "1234-1234-1234-1234",
                "availableBalance": {"amount": 10000.0},
                name: "HOME_LOAN",
                number: "8952356783",
                accountType: 'SAVINGS'
            }
        ];
        var emailStatementPreference = {
            formalStatementPreferences: [
                {
                    bpId: '246810121',
                    account: accounts[1],
                    emailAddrActive: 'true',
                    emailAddrValidated: 'true',
                    emailAddress: 'someEmail@email.com',
                    initialEmailAddress: 'someOld@email.com',
                    password: 'password',
                    suppressInd: 'F'
                },

                {
                    bpId: '123456789',
                    account: firstAccount,
                    emailAddrActive: 'true',
                    emailAddrValidated: 'true',
                    emailAddress: 'someEmail@email.com',
                    initialEmailAddress: 'someOld@email.com',
                    password: 'password',
                    suppressInd: 'F'
                }
            ]
        };
        var postalStatementPreference = {
            formalStatementPreferences: [
                {
                    bpId: '246810121',
                    account: accounts[1],
                    password: 'password',
                    suppressInd: 'F'
                }
            ]
        };

        var formalStatementPreferenceEmpty = {
            formalStatementPreferences: []
        };

        var selectedFormalStatement = {
            bpId: '246810121', account: accounts[1],
            emailAddrActive: 'true', emailAddrValidated: 'true', emailAddress: 'someEmail@email.com',
            initialEmailAddress: 'someOld@email.com', password: 'password', suppressInd: 'F'
        };

        function getFormalStatementMock(statementPreference) {
            statementService.formalStatementPreference.and.returnValue(_mock.resolve(statementPreference));
        }

        function initializeController(accountNumber) {
            var routeParams = {accountNumber: accountNumber};
            controller('AccountPreferencesController', {
                $scope: scope,
                $routeParams: routeParams,
                AccountsService: accountsService,
                Card: card,
                StatementService: statementService,
                ProfilesAndSettingsMenu: profilesAndSettingsMenu,
                $location: location,
                AccountPreferencesService: accountPreferencesService,
                ApplicationParameters: applicationParameters
            });

            scope.$digest();
        }

        beforeEach(inject(function ($controller, $rootScope, mock, accountLabelFilter) {
            scope = $rootScope.$new();
            controller = $controller;
            accountsService = jasmine.createSpyObj('AccountsService', ['list']);
            _mock = mock;
                    accountsService.list.and.returnValue(_mock.resolve({accounts: accounts}));
            card = jasmine.createSpyObj('Card', ['current']);
            statementService = jasmine.createSpyObj('StatementService', ['formalStatementPreference']);
            getFormalStatementMock(emailStatementPreference);
            location = jasmine.createSpyObj('location', ['path']);
            profilesAndSettingsMenu = jasmine.createSpyObj('ProfilesAndSettingsMenu', ['getMenu']);
            profilesAndSettingsMenu.getMenu.and.returnValue([
                {}
            ]);
            accountPreferencesService = jasmine.createSpyObj('AccountPreferencesService', ['addStatementPreference',
                'setAccountNumbersWithPreferences']);
            _accountLabelFilter = accountLabelFilter;
            applicationParameters = jasmine.createSpyObj('ApplicationParameters', ['popVariable']);
        }));

        it('should set the menuItems list ', function () {
            initializeController(firstAccount.number);
            expect(scope.menuItems.length > 0).toBeTruthy();
        });

        it('should filter accounts to only include accounts whose preferences are allowed to be modified', function () {
            initializeController('8952356783');
            expect(accountsService.list).toHaveBeenCalled();
            expect(scope.accountDetails).not.toBe('');
        });

        it('the accountDetails should be set only when the account is allowed to be modified', function () {
            accountsService.list.and.returnValue(_mock.resolve({accounts:[{accountType:'SAVINGS'}]}));
            initializeController(firstAccount.number);
            expect(scope.accountDetails).toBe('');
        });

        it('statementPreferences should not be set when the account is not allowed to be modified', function () {
            accountsService.list.and.returnValue(_mock.resolve({accounts:accounts}));
            initializeController(accounts[2].number);
            expect(statementService.formalStatementPreference).not.toHaveBeenCalled();
            expect(scope.statementPreferences).toBeUndefined();
        });

        it('statementPreferences should be set only when the account is allowed to be modified', function () {
            accountsService.list.and.returnValue(_mock.resolve({accounts:accounts}));
            initializeController(accounts[0].number);
            expect(statementService.formalStatementPreference).toHaveBeenCalled();
        });

        it('should set the account details on the scope', function () {
            initializeController(firstAccount.number);
            var expectedAccountDetails = _accountLabelFilter(firstAccount);
            expect(scope.accountDetails).toEqual(expectedAccountDetails);
            expect(scope.accountNumber).toEqual(firstAccount.number);
        });


        it('should call the statement service to get the formal preferences', function () {
            initializeController(firstAccount.number);
            expect(statementService.formalStatementPreference).toHaveBeenCalled();
        });

        it('should set the scopes delivery method to the users email if the user profile has it set email', function () {
            initializeController(firstAccount.number);
            expect(scope.deliveryMethod).toEqual('Email address (' + emailStatementPreference.formalStatementPreferences[1].emailAddress + ')');
        });

        it('should set the scopes delivery method to postal address if the user profile has it set postal', function () {
            getFormalStatementMock(postalStatementPreference);
            initializeController(accounts[1].number);
            expect(scope.deliveryMethod).toEqual('Postal Address');
        });

        it('should show the empty notification if there is no preferences', function () {
            getFormalStatementMock(formalStatementPreferenceEmpty);
            initializeController(accounts[1].number);
            expect(scope.errorMessage).toBeUndefined();
            expect(scope.hasInfo).toBeTruthy();
        });

        it('should set error on scope if service has error', function () {
            statementService.formalStatementPreference.and.returnValue(_mock.reject({message: 'this is an error'}));
            initializeController(accounts[0].number);
            expect(scope.errorMessage).toBeDefined();
        });

        it('should set account details on error', function () {
            statementService.formalStatementPreference.and.returnValue(_mock.reject({message: 'No account preference'}));
            card.current.and.returnValue(cardExample);
            initializeController(accounts[1].number);
            expect(scope.accountDetails).toEqual('CREDIT CARD - 1234-1234-1234-1234');
        });

        it('should call the profilesAndSettingsMenu service to set the menu', function () {
            initializeController(accounts[1].number);
            expect(profilesAndSettingsMenu.getMenu).toHaveBeenCalled();
        });

        describe('for is successful', function () {

            it('when true it should set $scope.isSuccessful to true', function () {
                applicationParameters.popVariable.and.returnValue(true);
                initializeController();
                expect(scope.isSuccessful).toBe(true);
            });

            it('should not set the error message when error message is not available', function () {
                applicationParameters.popVariable.and.returnValue(undefined);
                initializeController();
                expect(scope.errorMessage).toBeUndefined();
            });

        });

        describe('when not successful', function () {

            [false, null, undefined].forEach(function (nonTrueValue) {
                it('when value is ' + nonTrueValue + ' it should set $scope.isSuccessful to false', function () {
                    applicationParameters.popVariable.and.returnValue(nonTrueValue);
                    initializeController();
                    expect(scope.isSuccessful).toBeFalsy();
                });
            });

            it('should set the error message when error message is available', function () {
                applicationParameters.popVariable.and.returnValue('An error has occurred');
                initializeController();
                expect(scope.errorMessage).toEqual('An error has occurred');
            });

        });

        describe('modify', function () {
            it('should set the statement preference when editing', function () {
                card.current.and.returnValue(cardExample);
                initializeController(accounts[1].number);
                scope.modify();
                selectedFormalStatement['accountDetails'] = scope.accountDetails;
                selectedFormalStatement['card'] = cardExample;
                expect(accountPreferencesService.addStatementPreference).toHaveBeenCalledWith(selectedFormalStatement);
            });

            it('should set the account numbers with preferences',function(){
                initializeController(accounts[1].number);
                scope.modify();
                expect(accountPreferencesService.setAccountNumbersWithPreferences).toHaveBeenCalledWith([accounts[0].number, accounts[1].number]);
            });

            it('should change location when editing', function () {
                initializeController(accounts[1].number);
                scope.modify();
                expect(location.path).toHaveBeenCalledWith('/edit-account-preferences/' + accounts[1].number);
            });

        });


    });
});
