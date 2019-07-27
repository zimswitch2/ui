if(feature.accountSharing) {
    describe('Require Permissions directive', function () {
        'use strict';
        var permissionsService;
        var element;
        var invokeDirective;

        beforeEach(module('refresh.permissions'));

        beforeEach(inject(function ($compile, $rootScope, PermissionsService) {
            permissionsService = PermissionsService;
            spyOn(PermissionsService, ['checkPermission']);
            invokeDirective = function () {
                var scope = $rootScope.$new();
                element = angular.element('<div><div require-permission="testPermission">Secret text</div></div>');
                $compile(element)(scope);
                scope.$digest();
            };
        }));

        describe('Require-permission directive when permission check succeeds', function () {

            beforeEach(function () {
                permissionsService.checkPermission.and.returnValue(true);
                invokeDirective();
            });

            it('should call the permission service with the correct parameter', function () {
                expect(permissionsService.checkPermission).toHaveBeenCalledWith('testPermission');
            });

            it('should show us the secret text', function () {
                expect(element.find('div').text()).toEqual('Secret text');
            });

        });

        describe('Require-permission directive when permission check fails', function () {

            beforeEach(function () {
                permissionsService.checkPermission.and.returnValue(false);
                invokeDirective();
            });

            it('should call the permission service with the failure parameter', function () {
                expect(permissionsService.checkPermission).toHaveBeenCalledWith('testPermission');
            });

            it('should not contain inner div', function () {
                expect(element.text()).not.toContain('Secret text');
            });
        });
    });
}