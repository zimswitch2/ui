describe('account preferences', function () {
    'use strict';

    beforeEach(module('refresh.profileAndSettings.editPreferences',
        'refresh.dtmanalytics'));

    describe('routes', function () {
        var route;

        beforeEach(inject(function ($route) {
            route = $route;
        }));

        describe('when landing on the edit accounts preferences view', function () {
            it('should use the correct controller ', function () {
                expect(route.routes['/edit-account-preferences/:accountNumber'].controller).toEqual('EditAccountPreferencesController');
            });

            it('should use the correct template ', function () {
                expect(route.routes['/edit-account-preferences/:accountNumber'].templateUrl).toEqual('features/profileAndSettings/partials/editAccountPreferences.html');
            });
        });
    });


    describe('EditAccountPreferencesController', function () {
        var scope, controller, statementService, _mock, accountPreferencesService, digitalId, profilesAndSettingsMenu,
            location, flow, applicationParameters,
            DtmAnalyticsService;

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
                "formattedNumber": "1234-1234-1234-1234",
                "availableBalance": {"amount": 10000.0},
                name: "CREDIT_CARD",
                number: "123456783"
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
                number: "8952356783"
            }
        ];
        var emailStatementPreference = {
            formalStatementPreferences: [
                {
                    bpId: '246810121',
                    account: accounts[1],
                    emailAddrActive: 'T',
                    emailAddrValidated: 'T',
                    emailAddress: 'someEmail@email.com',
                    initialEmailAddress: 'someOld@email.com',
                    password: 'password',
                    suppressInd: 'F'
                },

                {
                    bpId: '123456789',
                    account: firstAccount,
                    emailAddrActive: 'T',
                    emailAddrValidated: 'T',
                    emailAddress: 'someEmail@email.com',
                    initialEmailAddress: 'someOld@email.com',
                    password: 'password',
                    suppressInd: 'F'
                }
            ]
        };
        var emailFormalStatementPreference = {
            account: {
                number: accounts[1].number,
                name: 'name'
            },
            emailAddress: 'some@email.com',
            accountDetails: 'CURRENT 12-34-567-890-0'
        };

        var postalFormalStatementPreference = {
            account: {
                number: "number",
                name: 'name'
            },
            accountDetails: 'CURRENT 12-34-567-890-0'
        };


        function getFormalStatementMock(statementPreference) {
            statementService.formalStatementPreference.and.returnValue(_mock.resolve(statementPreference));
        }

        function initializeController(accountNumber, formalStatementPreference) {
            var routeParams = {accountNumber: accountNumber};
            var preference = formalStatementPreference || emailFormalStatementPreference;
            accountPreferencesService.getStatementPreference.and.returnValue(preference);
            controller('EditAccountPreferencesController',
                {
                    $scope: scope,
                    StatementService: statementService,
                    ProfilesAndSettingsMenu: profilesAndSettingsMenu,
                    DigitalId: digitalId,
                    AccountPreferencesService: accountPreferencesService,
                    $location: location,
                    Flow: flow,
                    $routeParams: routeParams,
                    ApplicationParameters: applicationParameters
                }
            );
            scope.$digest();
        }

        beforeEach(inject(function ($controller, $rootScope, mock, _DtmAnalyticsService_) {
            scope = $rootScope.$new();
            controller = $controller;
            location = jasmine.createSpyObj('location', ['path']);
            _mock = mock;
            statementService = jasmine.createSpyObj('StatementService', ['formalStatementPreference', 'editFormalStatementPreference']);
            profilesAndSettingsMenu = jasmine.createSpyObj('ProfilesAndSettingsMenu', ['getMenu']);
            applicationParameters = jasmine.createSpyObj('ApplicationParameters', ['pushVariable']);
            getFormalStatementMock(emailStatementPreference);
            accountPreferencesService = jasmine.createSpyObj('AccountPreferencesService', ['getStatementPreference', 'clear', 'getAccountNumbersWithPreferences']);
            digitalId = jasmine.createSpyObj('DigitalId', ['current']);
            digitalId.current.and.returnValue({username: 'digital@email.com'});
            accountPreferencesService.getAccountNumbersWithPreferences.and.returnValue([accounts[0].number,accounts[1].number]);
            flow = jasmine.createSpyObj('Flow', ['create', 'next', 'previous']);

            DtmAnalyticsService = _DtmAnalyticsService_;
            spyOn(DtmAnalyticsService, 'recordFormSubmissionCompletion').and.returnValue(function() {});

        }));

        it('should set the menuItems list ', function () {
            initializeController(firstAccount.number);
            expect(profilesAndSettingsMenu.getMenu).toHaveBeenCalled();
        });

        it('should call the AccountPreferencesService service to set the formal statement preferences', function () {
            initializeController(firstAccount.number);
            expect(accountPreferencesService.getStatementPreference).toHaveBeenCalled();
        });

        it('should continue with the modification when the account is legible for modification', function () {
            accountPreferencesService.getAccountNumbersWithPreferences.and.returnValue(['Musk of Zoro', firstAccount.number]);
            initializeController(firstAccount.number);
            expect(accountPreferencesService.getAccountNumbersWithPreferences).toHaveBeenCalled();
            expect(location.path).not.toHaveBeenCalled();
        });

        it('should redirect to account preferences when an account number is not legible for modification', function () {
            accountPreferencesService.getAccountNumbersWithPreferences.and.returnValue(['Some account number']);
            initializeController(firstAccount.number);
            expect(accountPreferencesService.getAccountNumbersWithPreferences).toHaveBeenCalled();
            expect(location.path).toHaveBeenCalledWith('/account-preferences/'+ firstAccount.number);
        });

        it('should set the account details', function () {
            initializeController(firstAccount.number);
            expect(scope.accountDetails).toEqual('CURRENT 12-34-567-890-0');
        });

        it('should set the delivery method to postal if no email address exists ', function () {
            initializeController(firstAccount.number, postalFormalStatementPreference);
            expect(scope.deliveryMethod).toEqual('postal');
        });

        it('should set the delivery method to email if email address exists ', function () {
            initializeController(firstAccount.number);
            expect(scope.deliveryMethod).toEqual('email');
        });

        it('should set the current email address when the email address exists and the delivery method is email', function () {
            initializeController(firstAccount.number);
            expect(scope.emailDelivery).toBe('Email address (some@email.com)');
        });


        it('should set the delivery address to email if email address exists ', function () {
            initializeController(firstAccount.number);
            expect(scope.statementPreferences.emailAddress).toEqual('some@email.com');
        });

        it('should create instance of flow', function () {
            initializeController(firstAccount.number);
            expect(flow.create).toHaveBeenCalledWith(['Formal Statement Delivery', 'Enter OTP'], 'Formal Statement Delivery', '/account-preferences/' + firstAccount.number);
        });

        it('should hide the text box if the delivery method is postal and show it if its email', function () {

            initializeController(firstAccount.number);
            scope.deliveryMethod = 'postal';
            expect(scope.isDisabled()).toBeTruthy();
            scope.deliveryMethod = 'email';
            expect(scope.isDisabled()).toBeFalsy();
        });

        describe('cancel', function () {

            it('should clean out the AccountPreferenceService', function () {
                initializeController(accounts[1].number);
                scope.cancel();
                expect(accountPreferencesService.clear).toHaveBeenCalled();
            });

            it('should go back to the accounts preferences page', function () {
                initializeController(accounts[1].number);
                scope.cancel();
                expect(location.path).toHaveBeenCalledWith('/account-preferences/' + accounts[1].number);
            });

            it('should cancel the form submit so abandonment can be recorded', function() {
               spyOn(DtmAnalyticsService, 'cancelFormSubmissionRecord').and.returnValue(function() {});
            });


        });

        describe('save', function () {

            it('should save the account preference and go back to account-preferences', function () {
                statementService.editFormalStatementPreference.and.returnValue(_mock.resolve({test: 1}));
                initializeController(accounts[1].number);
                scope.save();
                scope.$digest();
                expect(statementService.editFormalStatementPreference).toHaveBeenCalled();
                expect(location.path).toHaveBeenCalledWith('/account-preferences/' + accounts[1].number);
                expect(flow.next).toHaveBeenCalled();
                expect(applicationParameters.pushVariable).toHaveBeenCalledWith('isSuccessful', true);

                 expect(DtmAnalyticsService.recordFormSubmissionCompletion).toHaveBeenCalled();
            });


            it('should redirect to account preference with an error message', function () {
                statementService.editFormalStatementPreference.and.returnValue(_mock.reject({message: 'An error has occurred'}));
                initializeController(accounts[1].number);
                scope.save();
                scope.$digest();
                expect(statementService.editFormalStatementPreference).toHaveBeenCalled();
                expect(flow.previous).toHaveBeenCalled();
                expect(applicationParameters.pushVariable).toHaveBeenCalledWith('isSuccessful', false);
                expect(applicationParameters.pushVariable).toHaveBeenCalledWith('errorMessage', 'An error has occurred');
                expect(location.path).toHaveBeenCalledWith('/account-preferences/' + accounts[1].number);

                 expect(DtmAnalyticsService.recordFormSubmissionCompletion).toHaveBeenCalled();
            });
        });

    });

});
