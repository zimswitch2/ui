(function() {
    'use strict';

    angular
        .module('refresh.accountSharing.operatorDetails')
        .controller('OperatorDetailsController', function(OperatorService, $routeParams, $location) {
            var vm = this;
            var userId = Number($routeParams.id);
            vm.showDelete = false;
            vm.showDeactivate = false;
            vm.showActivate = false;

            OperatorService.getOperator(userId).then(function(operator) {
                vm.operator = operator;
            });

            vm.active = function() {
                return vm.operator.active;
            };

            vm.editUserDetails = function () {
                $location.path('/account-sharing/users/' + $routeParams.id + '/details');
            };

            vm.back = function () {
                $location.path('/account-sharing/operators/');
            };

            vm.editPermissions = function () {
                $location.path('/account-sharing/users/' + $routeParams.id + '/permissions');
            };

            vm.activate = function() {
                vm.showActivate = true;
            };

            vm.confirmDelete = function() {
                OperatorService.deleteOperator(vm.operator.id).then(function(response){
                    vm.showDelete = false;
                    $location.path('/account-sharing/operators');
                }).catch(function(error){
                    vm.showDelete = false;
                    vm.errorMessage = error.message;
                });
            };

            vm.cancelDelete = function() {
                vm.showDelete = false;
            };

            vm.confirmActivate = function(){
                OperatorService.activateOperator(vm.operator.id).then(function(response){
                    vm.showActivate = false;
                    vm.operator.active = true;
                    $location.path('/account-sharing/users/' + $routeParams.id);
                }).catch(function(error){
                    vm.showActivate = false;
                    vm.errorMessage = error.message;
                });
            };

            vm.cancelActivate = function(){
                vm.showActivate = false;
            };

            vm.deactivate = function(){
                vm.showDeactivate = true;
            };

            vm.confirmDeactivate = function(){
                OperatorService.deactivateOperator(vm.operator.id).then(function(){
                    vm.showDeactivate = false;
                    vm.operator.active = false;
                    $location.path('/account-sharing/users/' + $routeParams.id);
                }).catch(function(error){
                    vm.showDeactivate = false;
                    vm.errorMessage = error.message;
                });
            };

            vm.cancelDeactivate = function(){
                vm.showDeactivate = false;
            };

            vm.delete = function() {
                vm.showDelete = true;
            };
        });
})();
