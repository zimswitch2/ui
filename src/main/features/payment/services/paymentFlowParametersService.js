(function (app) {
    'use strict';

    app.service('PaymentFlowParametersService', function () {
        var globalVariables = {};
        return {
            setPaymentFlowParameter: function (key, value) {
                globalVariables[key] = value;
            },
            getPaymentFlowParameter: function (key) {
                return globalVariables[key];
            }
        };
    });
})
(angular.module('refresh.paymentFlowParametersService', ['refresh.mcaHttp']));


