(function () {
    'use strict';

    var app = angular.module('refresh.accountOrigination.common.directives.cancelConfirmation', ['refresh.accountOrigination.domain.customer']);

    app.service('CancelConfirmationService', function ($routeParams, $location, CustomerInformationData) {
        var _navigate, _showModal, _form;

        var reset = function () {
            _showModal = false;
            CustomerInformationData.revert();
        };

        return {
            cancelEdit: function (navigate) {
                if (_form && _form.$pristine) {
                    reset();
                    navigate();
                } else {
                    _showModal = true;
                    _navigate = navigate;
                }
            },
            hide: function () {
                _showModal = false;
                _navigate = undefined;
            },
            confirmCancel: function () {
                _form = undefined;
                reset();

                if (_navigate) {
                    _navigate();
                } else {
                    $location.url('/apply/' + $routeParams.product + '/' + $routeParams.section).replace();
                }
            },
            setEditForm: function (form) {
                _form = form;
            },
            shouldShowModal: function () {
                return _showModal === true;
            }
        };
    });

    app.controller('CancelConfirmationController', function ($scope, CancelConfirmationService) {
        $scope.showModal = CancelConfirmationService.shouldShowModal;

        if($scope.editForm) {
            CancelConfirmationService.setEditForm($scope.editForm);
        }

        $scope.back = function () {
            CancelConfirmationService.hide();
        };

        $scope.confirm = function () {
            CancelConfirmationService.confirmCancel();
        };
    });

    app.directive('cancelConfirmation', function () {
        return {
            restrict: 'E',
            templateUrl: 'features/accountorigination/common/directives/partials/cancelConfirmation.html',
            controller: 'CancelConfirmationController',
            scope: {
                editForm: '='
            }
        };
    });
})();