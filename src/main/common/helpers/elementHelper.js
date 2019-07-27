'use strict';
(function (app) {
    app.factory('ElementHelper', function () {
        return {
            isVisible: function (element) {
                return element.is(":visible");
            },
            getWidth: function (element) {
                return element.width();
            },
            getHeight: function (element) {
                return element.height();
            }
        };
    });
})(angular.module('refresh.elementHelper', []));
