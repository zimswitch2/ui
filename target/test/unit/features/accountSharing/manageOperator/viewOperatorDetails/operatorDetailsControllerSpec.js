describe('Account Sharing View Operator', function() {
    'use strict';
    beforeEach(module('refresh.accountSharing.operatorDetails'));

    describe("routes", function() {
        var route;
        beforeEach(inject(function($route) {
            route = $route;
        }));

        describe("when viewing an operator", function() {
            it("should use the correct template", function() {
                var accountSharingUserDetailsRoute = route.routes['/account-sharing/users/:id'];
                expect(accountSharingUserDetailsRoute.templateUrl).toEqual('features/accountSharing/manageOperator/viewOperatorDetails/operatorDetails.html');
            });

            it('should use the correct controller', function() {
                var accountSharingUserDetailsRoute = route.routes['/account-sharing/users/:id'];
                expect(accountSharingUserDetailsRoute.controller).toEqual('OperatorDetailsController');
            });
        });
    });

    describe("OperatorDetailsController", function() {
        var mock, rootScope, controller, operatorService, routeParams, location;

        var operatorResponse = {
            "id": 10
        };

        beforeEach(inject(function($controller, $rootScope, _mock_) {
            mock = _mock_;
            rootScope = $rootScope;
            routeParams = {
                id: "10"
            };

            operatorService = jasmine.createSpyObj('OperatorService', ['getOperator', 'deleteOperator', 'activateOperator', 'deactivateOperator']);
            operatorService.getOperator.and.returnValue(mock.resolve(operatorResponse));
            operatorService.deleteOperator.and.returnValue(mock.resolve({}));
            operatorService.activateOperator.and.returnValue(mock.resolve());
            operatorService.deactivateOperator.and.returnValue(mock.resolve());

            location = jasmine.createSpyObj('location', ['path']);
        }));

        function getController() {
            var controller;

            inject(function($controller, _mock_) {
                controller = $controller('OperatorDetailsController', {
                    OperatorService: operatorService,
                    $routeParams: routeParams,
                    $location: location
                });

                rootScope.$digest();
            });

            return controller;
        }

        describe('operator and permissions', function() {
            it('should fetch the operators for the current user id', function() {
                var controller = getController();
                expect(operatorService.getOperator).toHaveBeenCalledWith(10);
            });

            it('should fetch the operator', function() {
                var controller = getController();
                var expectedOperator = operatorResponse;

                expect(controller.operator).toEqual(expectedOperator);
            });
        });

        describe('active status', function() {
            it('should return true for an active operator', function() {
                var controller = getController();
                controller.operator.active = true;

                expect(controller.active()).toBeTruthy();
            });

            it('should return true for an active operator', function() {
                var controller = getController();
                controller.operator.active = false;

                expect(controller.active()).toBeFalsy();
            });
        });

        describe('edit user details', function() {
            it('should navigate to the details page for the user', function() {
                var controller = getController();
                controller.editUserDetails();

                expect(location.path).toHaveBeenCalledWith('/account-sharing/users/10/details');
            });
        });

        describe('back button', function() {
            it('should navigate back to the account sharing users list', function() {
                var controller = getController();

                controller.back();
                expect(location.path).toHaveBeenCalledWith('/account-sharing/operators/');
            });
        });

        describe('edit user permissions', function() {
            it('should navigate to the permissions page for the user', function() {
                var controller = getController();
                controller.editPermissions();

                expect(location.path).toHaveBeenCalledWith('/account-sharing/users/10/permissions');
            });
        });

        describe('invoke delete',function(){
            it('show set showDelete to true', function(){
                var controller = getController();
                controller.showDelete = false;
                controller.delete();
                expect(controller.showDelete).toBeTruthy();
            });
        });

        describe('cancel delete', function(){
            it('should set showDelete to false', function(){
                var controller = getController();
                controller.showDelete = true;
                controller.cancelDelete();
                expect(controller.showDelete).toBeFalsy();
            });
        });

        describe('confirm delete',function(){

            var controller;

            beforeEach(function() {

                controller = getController();
                controller.showDelete  = true;
                controller.confirmDelete();
                rootScope.$digest();
            });

            it('should set showActivate to false', function(){
                expect(controller.showDelete).toBeFalsy();
            });
        });

        describe('error on delete',function(){

            beforeEach(function() {

                operatorService.deleteOperator.and.returnValue(mock.reject({ message: 'error message'}));

                controller = getController();
                controller.showDelete  = true;
                controller.confirmDelete();
                rootScope.$digest();
            });

            it('should set the error message', function(){
                expect(controller.errorMessage).toEqual('error message');
            });

            it('should set showDelete to false', function(){
                expect(controller.showDelete).toBeFalsy();
            });
        });

        describe('operator activate', function(){
            it('should set showActivate to true',function(){
                var controller = getController();
                controller.showActivate = false;
                controller.activate();
                expect(controller.showActivate).toBeTruthy();
            });
        });

        describe('cancel activate', function(){
            it('should set showActivate to false', function(){
                var controller = getController();
                controller.showActivate = true;
                controller.cancelActivate();
                expect(controller.showActivate).toBeFalsy();
            });
        });

        describe('confirm activate', function(){
            var controller;
            beforeEach(function(){
                controller = getController();
                controller.showActivate = true;
                controller.confirmActivate();
                rootScope.$digest();
            });

            it('should set showActive to false', function(){
                expect(controller.showActivate).toBeFalsy();
            });
        });

       describe('error on activate',function(){

            beforeEach(function() {

                operatorService.activateOperator.and.returnValue(mock.reject({ message: 'error message'}));

                controller = getController();
                controller.showActivate  = true;
                controller.confirmActivate();
                rootScope.$digest();
            });

            it('should set the error message', function(){
                expect(controller.errorMessage).toEqual('error message');
            });

            it('should set showActivate to false', function(){
                expect(controller.showActivate).toBeFalsy();
            });
        });

        describe('invoke deactivate', function(){
            it('show set showDeactive to true', function(){
                var controller = getController();
                controller.showDeactivate = false;
                controller.deactivate();
                expect(controller.showDeactivate).toBeTruthy();
            });
        });

        describe('cancel deactivate', function(){
            it('should set showDeactivate to false', function(){
                var controller = getController();
                controller.showDeactivate = true;
                controller.cancelDeactivate();
                expect(controller.showDeactivate).toBeFalsy();
            });
        });

        describe('confirm deactivate', function(){
            var controller;
            beforeEach(function(){
                controller = getController();
                controller.showDeactivate = true;
                controller.confirmDeactivate();
                rootScope.$digest();
            });

            it('should setDeactive to false', function(){
                expect(controller.showDeactivate).toBeFalsy();
            });
        });

        describe('error on deactivate',function(){

            beforeEach(function() {

                operatorService.deactivateOperator.and.returnValue(mock.reject({ message: 'error message'}));

                controller = getController();
                controller.showDeactivate  = true;
                controller.confirmDeactivate();
                rootScope.$digest();
            });

            it('should set the error message', function(){
                expect(controller.errorMessage).toEqual('error message');
            });

            it('should set showActivate to false', function(){
                expect(controller.showDeactivate).toBeFalsy();
            });
        });

        describe('on successful operator delete', function(){
            it('should navigate to the account sharing page', function(){
                var controller = getController();
                controller.confirmDelete();
                rootScope.$digest();

                expect(location.path).toHaveBeenCalledWith('/account-sharing/operators');
            });
        });

        describe('on successful deactivate', function(){
            it('should navigate to the user detail page',function(){

                var controller = getController();
                controller.confirmDeactivate();
                rootScope.$digest();

                expect(location.path).toHaveBeenCalledWith('/account-sharing/users/10');
            });

            it('should show operator status as inactive',function(){
                var controller = getController();
                controller.operator.active = true;
                controller.confirmDeactivate();
                rootScope.$digest();

                expect(controller.active()).toBeFalsy();
            });
        });

        describe('on successful activate', function(){
            it('should navigate to the user detail page',function(){

                var controller = getController();
                controller.confirmActivate();
                rootScope.$digest();

                expect(location.path).toHaveBeenCalledWith('/account-sharing/users/10');
            });

            it('should show operator status as active',function(){
                var controller = getController();
                controller.operator.active = false;
                controller.confirmActivate();
                rootScope.$digest();

                expect(controller.active()).toBeTruthy();
            });
        });
    });
});
