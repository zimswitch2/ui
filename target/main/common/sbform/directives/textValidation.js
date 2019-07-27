(function (app) {
    'use strict';

    app.directive('textValidation', function () {
        return {
            restrict: 'A',
            require: ['^form'],
            compile: function (element, attrs) {
                /* jshint ignore:start */
                // attrs.ngPattern = "/^[A-Za-z0-9\\:\\;\\/ \\\\\\,\\-\\(\\)\\.\\&\\@\\*\\#\\?' ]*$/";
                attrs.ngPattern =  '"[A-Za-z0-9\\\\:\\\\;\\\\/\\\\\\\\\\\\,\\\\-\\\\(\\\\)\\\\.\\\\&\\\\@\\\\*\\\\#\\\\?\\\' ]*"';

                /* jshint ignore:end */
            }
        };
    });
})(angular.module('refresh.textValidation', []));
