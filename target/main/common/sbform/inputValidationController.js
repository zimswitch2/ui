(function (app) {
    'use strict';

    app.controller('inputValidation', function ($scope, $element) {
        $scope._findInputElement = function () {
            return $element.find('input').length ? $element.find('input') : $element.find('textarea');
        };

        $scope.exactLengthMessage = function () {
            var lengths = $scope.exactLength.split(',').join(" or ");
            return "Must be " + lengths + " numbers long";
        };

        $scope.shouldBeTrimmed = function () {
            var inputType = $scope._findInputElement().attr("type");
            return inputType !== "password";
        };
    });
})(angular.module('refresh.inputValidationController', []));
