(function () {
    'use strict';
    var module = angular.module('flow.flowConstructor', []);
    module.factory('FlowConstructor', function () {
        return function (spec) {
            var _private = {},
                _flow = {};

            _private.startFunc = spec.start;

            _flow.start = function () {
                if (_private.startFunc) {
                    _private.startFunc.apply(this, arguments);
                } else {
                    throw new Error(_flow.getName() + ': Start function not defined, flow will do nothing');
                }
            };

            _flow.getName = function () {
                return spec.name;
            };

            _flow.addPromiseResolutionScenarios = function (promiseResolutionScenarioList) {
                promiseResolutionScenarioList.forEach(function (promiseResolutionScenario) {
                    _private[promiseResolutionScenario + 'FuncList'] = [];
                    _flow[promiseResolutionScenario] = function (func) {
                        _private[promiseResolutionScenario + 'FuncList'].push(func);
                        return _flow;
                    };
                });
            };

            _flow.resolve = function (promiseResolutionScenario, argumentsList) {
                _private[promiseResolutionScenario + 'FuncList'].forEach(function (func) {
                    if (Array.isArray(argumentsList)) {
                        func.apply(this, argumentsList);
                    } else {
                        func.call(this, argumentsList);
                    }
                });
            };

            return _flow;
        };
    });
})();