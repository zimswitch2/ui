describe('Account Sharing Add User Setup Permissions', function() {
    'use strict';
    beforeEach(module('refresh.accountSharing.addUser'));

    describe("routes", function() {
        var route;
        beforeEach(inject(function($route) {
            route = $route;
        }));

        describe("when setting up permissions for a new user", function() {
            it("should use the correct template", function() {
                var accountSharingUserDetailsRoute = route.routes['/account-sharing/user/permissions'];
                expect(accountSharingUserDetailsRoute.templateUrl).toEqual('features/accountSharing/manageOperator/addOperator/permissions/partials/addUserPermissions.html');
            });

            it('should use the correct controller', function() {
                var accountSharingUserDetailsRoute = route.routes['/account-sharing/user/permissions'];
                expect(accountSharingUserDetailsRoute.controller).toEqual('PermissionsController');
            });
        });
    });

    describe("PermissionsController", function() {
        var mock, rootScope, controller;
        var goHomeSpy, historyBackSpy, locationPathSpy, pathSpy;
        var flow, card, addUserService, cancelDialogService, accountService, operatorService;

        var accounts = [{
            accountType: 'CURRENT_ACCOUNT',
            accountNumber: '000-000-000'
        }];

        var roles = [{
            "name": "view",
            "description": "View Only - can view all transactions on the entity. This role would typically be assigned to the accountant or the auditor."
        }, {
            "name": "capturer",
            "description": "Capture - Payments, Beneficiaries, transactions. By default, the capturer can view the items that they have captured."
        }, {
            "name": "authoriser",
            "description": "Authorise - Authorise all transactions as defined in the workflow. This role cannot capture/release. By default, the authoriser can view the items that they have authorised."
        }, {
            "name": "releaser",
            "description": "Release - Release/carry out the 'post' function of all transactions (OTP and non-OTP)."
        }, {
            "name": "full access",
            "description": "Full access Role"
        }];

        beforeEach(inject(function($controller, $window, $rootScope, Flow, _mock_, HomeService, $location) {
            mock = _mock_;
            rootScope = $rootScope;
            addUserService = jasmine.createSpyObj('AddUserService', ['user', 'reset', 'accountRoles', 'createPermissions']);
            card = jasmine.createSpyObj('Card', ['current']);
            accountService = jasmine.createSpyObj('AccountService', ['list', 'accountTypeName']);
            operatorService = jasmine.createSpyObj('OperatorService', ['roles']);
            goHomeSpy = spyOn(HomeService, 'goHome');
            pathSpy = jasmine.createSpyObj('pathSpy', ['replace']);
            locationPathSpy = spyOn($location, 'path').and.returnValue(pathSpy);


            card.current.and.returnValue({
                number: '12356789012345'
            });

            accountService.list.and.returnValue(mock.resolve({
                accounts: accounts
            }));

            accountService.accountTypeName.and.returnValue('someTestAccountName');

            operatorService.roles.and.returnValue(mock.resolve(roles));

            flow = Flow;
            flow.create(['testStep1', 'testStep2'], 'testHeaderName');
            historyBackSpy = spyOn($window.history, 'back');
        }));

        function getController(promise, skipDigest) {
            var controller;
            if (!promise) {
                promise = mock.resolve();
            }

            inject(function($controller, _mock_) {
                cancelDialogService = jasmine.createSpyObj('CancelDialogService', ['createDialog']);
                cancelDialogService.createDialog.and.returnValue(promise);

                controller = $controller('PermissionsController', {
                    Flow: flow,
                    Card: card,
                    AddUserService: addUserService,
                    CancelDialogService: cancelDialogService,
                    AccountsService: accountService,
                    OperatorService: operatorService,
                });

                if (!skipDigest) {
                    processPromises();
                }
            });

            return controller;
        }

        function processPromises() {
            rootScope.$digest();
        }

        describe('flow', function() {
            it('should have the controller headername set to the flow headername', function() {
                var controller = getController();
                expect(controller.headerName).toEqual(flow.getHeaderName());
            });
        });

        describe('user object binding', function() {
            it('should get the user object instance from the addUserService', function() {
                var controller = getController();
                expect(addUserService.user).toHaveBeenCalled();
            });
        });

        describe('account list', function() {
            it('should fetch the account list for the current card', function() {
                var controller = getController();
                expect(accountService.list).toHaveBeenCalledWith(card.current());
            });
        });

        describe('account type name', function() {
            it('should return the accountTypeName for the account', function() {
                var controller = getController();

                var expectedAccounts = [{
                    accountType: 'CURRENT_ACCOUNT',
                    accountTypeName: 'someTestAccountName',
                    accountNumber: '000-000-000',
                }];

                expect(controller.accounts).toEqual(expectedAccounts);
                expect(accountService.accountTypeName).toHaveBeenCalledWith('CURRENT_ACCOUNT');
            });
        });

        describe('roles', function() {
            it('should fetch the roles for the current user', function() {
                var controller = getController();
                expect(controller.roles).toEqual(roles);
            });

            it('should be required when any selected account roles is undefined', function() {
                var controller = getController();
                controller.accounts = [{
                    number: "000-000-000"
                }, {
                    number: "000-000-001"
                }];

                controller.accountRoles = {
                    "000-000-000": undefined,
                    "000-000-001": "Some-Role"
                };

                expect(controller.allAccountsHaveNoRole()).toBeTruthy();
            });

            it('should be required when any selected account roles is undefined', function() {
                var controller = getController();
                controller.accounts = [{
                    number: "000-000-000"
                }, {
                    number: "000-000-001"
                }];

                controller.accountRoles = {
                    "000-000-000": "None"
                };

                expect(controller.allAccountsHaveNoRole()).toBeTruthy();
            });

            it('should be required when all the selected account roles are none', function() {
                var controller = getController();
                controller.accounts = [{
                    number: "000-000-000"
                }, {
                    number: "000-000-001"
                }];

                controller.accountRoles = {
                    "000-000-000": "None",
                    "000-000-001": "None"
                };

                expect(controller.allAccountsHaveNoRole()).toBeTruthy();
            });

            it('should not be required when at least one selected account roles is not none', function() {
                var controller = getController();
                controller.accounts = [{
                    number: "000-000-000"
                }, {
                    number: "000-000-001"
                }];

                controller.accountRoles = {
                    "000-000-000": "Some-Role",
                    "000-000-001": "None"
                };

                expect(controller.allAccountsHaveNoRole()).toBeFalsy();
            });

            it('should not be required when all selected account roles are not none', function() {
                var controller = getController();
                controller.accounts = [{
                    number: "000-000-000"
                }, {
                    number: "000-000-001"
                }];

                controller.accountRoles = {
                    "000-000-000": "Some-Role",
                    "000-000-001": "A-Different-Role"
                };

                expect(controller.allAccountsHaveNoRole()).toBeFalsy();
            });
        });

        describe('name and description formatting', function() {
            it('should capitalize the name', function() {
                var controller = getController();
                expect(controller.name('john')).toEqual('John');
            });

            it('should split the description on the first hypen, and trim it', function() {
                var controller = getController();
                expect(controller.description('test - somedata    ')).toEqual('somedata');
            });

            it('should split the description on the first hypen, return the only part if theres no seperator and trim it', function() {
                var controller = getController();
                expect(controller.description('  somedata    ')).toEqual('somedata');
            });

            it('should split the description, on the first hypen and trim it', function() {
                var controller = getController();
                expect(controller.description('test - test123 - test    ')).toEqual('test123 - test');
            });

            it('should split the description, on the first hypen and trim it', function() {
                var controller = getController();
                expect(controller.description('test - test123 - test    -')).toEqual('test123 - test    -');
            });

            it('should return just the string when its only a hypen', function() {
                var controller = getController();
                expect(controller.description('-')).toEqual('-');
            });
        });

        describe('navigation', function() {
            describe('back', function() {
                it('should navigate back to where the user came from when cancelling', function() {
                    var controller = getController();
                    controller.back();
                    expect(historyBackSpy).toHaveBeenCalled();
                });
            });

            describe('next', function() {
                it('should set location to the confirm user page', function() {
                    var controller = getController();
                    controller.next();
                    expect(locationPathSpy).toHaveBeenCalledWith('/account-sharing/user/confirm');
                });

                it('should replace the new path', function() {
                    var controller = getController();
                    controller.next();
                    expect(pathSpy.replace).toHaveBeenCalled();
                });

                it('should create permissions in the add user service', function() {
                    var controller = getController();
                    controller.next();
                    expect(addUserService.createPermissions).toHaveBeenCalledWith(controller.accounts, controller.roles, controller.accountRoles);
                });
            });

            describe('cancel', function() {
                it('should reset the user object when the dialog is confirmed', function() {
                    var controller = getController(mock.resolve(), true);
                    controller.cancel();
                    processPromises();
                    expect(addUserService.reset).toHaveBeenCalled();
                });

                it('should go home when the dialog is confirmed', function() {
                    var controller = getController(mock.resolve(), true);
                    controller.cancel();
                    processPromises();
                    expect(goHomeSpy).toHaveBeenCalled();
                });
            });


            describe('small style accordian', function() {
                it('should open a new tab', function() {
                    var controller = getController();
                    controller.openTab('aTab');
                    expect(controller.isOpenTab('aTab')).toBeTruthy();
                });

                it('should close an opened tab if asked to open it again', function() {
                    var controller = getController();
                    controller.openTab('aTab');
                    controller.openTab('aTab');
                    expect(controller.isOpenTab('aTab')).toBeFalsy();
                });
            });

            describe('account roles', function(){
                it('should be initialised', function(){
                    var entryMode = {
                        "mode" :  "editOperator"
                    };
                    addUserService.entryMode = entryMode;
                    getController(mock.resolve(), true);
                    expect(addUserService.createPermissions).toHaveBeenCalled();
                });
            });
        });
    });
});
