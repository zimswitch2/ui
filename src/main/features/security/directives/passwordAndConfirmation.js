(function (app) {
    'use strict';

    app.directive('passwordAndConfirmation', [function () {
        return {
            link: function (scope, element, attributes) {
                validationLink(scope, element, attributes);
            },
            restrict: 'E',
            templateUrl: 'features/registration/partials/password.html'
        };
    }]);

    var validationLink = function (scope, element, attributes) {
        scope.NewPasswordLabel = attributes.passwordlabel || 'Password';
        scope.ConfirmationLabel = attributes.passwordconfirmationlabel || 'Confirm password';
    };
})(angular.module('refresh.passwordAndConfirmation', []));
