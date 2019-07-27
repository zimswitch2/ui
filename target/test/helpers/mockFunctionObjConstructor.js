(function () {
    'use strict';
    var module = angular.module('test.mockFunctionObjConstructor', []);
    module.factory('MockFunctionObjConstructor', function () {
        return function () {
            var callCount = 0,
                argumentList = [];

            var mockedFunc = function () {

                argumentList = Array.prototype.slice.call(arguments);

                callCount = callCount + 1;
            };
            return {
                getCallCount: function () {
                    return callCount;
                },
                getMockedFunc: function () {
                    return mockedFunc;
                },
                getArguments: function () {
                    return argumentList;
                }
            };
        };
    });
})();
