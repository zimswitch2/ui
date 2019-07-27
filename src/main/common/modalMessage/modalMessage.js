(function () {
    'use strict';
    var app = angular.module('refresh.modalMessage', []);

    app.directive('modalMessage', function (ModalMessage) {
        return {
            restrict: 'E',
            templateUrl: 'common/modalMessage/partials/modalMessage.html',
            scope: { },
            link: function ($scope) {
                $scope.modal = ModalMessage.modalInstance();
                $scope.modal.isShown = false;
                $scope.close = function () {
                    ModalMessage.hideModal();
                };
            }
        };
    });

    app.factory('ModalMessage', function () {
        var _modal = {
            isShown: false,
            title: "Title",
            message: "Message Content",
            whenClosed: function () {}
        };

        return {
            modalInstance: function () {
                return _modal;
            },
            showModal: function(modal) {
                modal.isShown = true;
                _.extend(_modal, modal);
            },
            hideModal: function() {
                _modal.isShown = false;
                _modal.whenClosed();
            }
        };
    });
})();
