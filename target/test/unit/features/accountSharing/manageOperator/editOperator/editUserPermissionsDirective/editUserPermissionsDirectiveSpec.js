describe('Account Sharing Edit User Permissions Directive', function () {
    'use strict';
    beforeEach(module('refresh.accountSharing.userDetails'));

    var directive,
        rootScope,
        scope,
        watchSpy;

    beforeEach(inject(function(editUserPermissionsDirective, $rootScope) {
        rootScope = $rootScope;
        directive = _.first(editUserPermissionsDirective);
        scope = $rootScope.$new();
        watchSpy = spyOn(scope, '$watch').and.callThrough();

    }));

    describe('properties', function() {
        it('should be restricted to elements', function() {
            expect(directive.restrict).toBe('E');
        });

        it('should have the view operator template url', function() {
            expect(directive.templateUrl).toBe('features/accountSharing/manageOperator/editOperator/permissions/editUserPermissionsDirective/editUserPermissions.html');
        });

        it('should have permissions bound var in scope', function() {
            expect(directive.scope.permissions).toBe('=');
        });

        it('should have roles bound var in scope', function() {
            expect(directive.scope.roles).toBe('=');
        });

        it('should have accounts bound var in scope', function() {
            expect(directive.scope.accounts).toBe('=');
        });

        it('should have userName bound var in scope', function() {
            expect(directive.scope.userName).toBe('=');
        });
    });

    describe('link', function () {
        var roles = [{
            id: 1,
            name: 'Role 1'
        }, {
            id: 2,
            name: 'Role 2'
        }];

        var accounts = [{
            number: '123'
        }, {
            number: '456'
        }];

        var permissions = [{
            accountReference: {
                number: '123'
            },
            role: {
                id: 1,
                name: 'Role 1'
            }
        }];

        describe('when permissions have not been bound', function () {
            beforeEach(function () {
                scope.roles = roles;
                scope.accounts = accounts;

                directive.link(scope);
            });

            it('should add watch for accountRoles', function () {
                expect(watchSpy).toHaveBeenCalledWith('accountRoles', jasmine.any(Function), true);
            });

            it('should add watch for permissions', function () {
                expect(watchSpy).toHaveBeenCalledWith('permissions', jasmine.any(Function), true);
            });

            it('should load permissions when permissions var is bound', function () {
                scope.$digest();

                scope.permissions = permissions;
                scope.$digest();

                expect(scope.accountRoles['123']).toEqual('Role 1');
            });

            describe('when changing roles', function () {
                beforeEach(function () {
                    scope.accountRoles['123'] = 'Role 2';
                    scope.accountRoles['456'] = 'Role 1';
                    scope.$digest();
                });

                it ('should reflect the correct number of permissions', function () {
                    expect(scope.permissions.length).toEqual(2);
                });

                it('should update the permissions set when accountRoles changes', function () {
                    expect(_.first(scope.permissions).role).toEqual({
                        id: 2,
                        name: 'Role 2'
                    });
                });

                it ('should exclude permissions when None is selected as role', function () {
                    scope.accountRoles['123'] = 'None';
                    scope.accountRoles['456'] = 'Role 1';
                    scope.$digest();

                    expect(scope.permissions.length).toEqual(1);
                    expect(_.first(scope.permissions).accountReference.number).toEqual('456');
                    expect(_.first(scope.permissions).role.name).toEqual('Role 1');
                });
            });
        });

        describe('when permissions have been bound', function () {
            beforeEach(function () {
                scope.permissions = permissions;
                scope.roles = roles;
                scope.accounts = accounts;

                directive.link(scope);
            });

            it('should add watch for permissions', function () {
                expect(watchSpy).not.toHaveBeenCalledWith('permissions', jasmine.any(Function), true);
            });

            it('should load permissions', function () {
                scope.$digest();

                expect(scope.accountRoles['123']).toEqual('Role 1');
            });
        });
    });

    describe('controller', function () {
        var controller;

        beforeEach(function () {
            controller = new directive.controller();
        });

        describe('name', function () {

            it('it should capitalise its input', function () {
                var result = controller.name('test');

                expect(result).toEqual('Test');
            });
        });
    });
});