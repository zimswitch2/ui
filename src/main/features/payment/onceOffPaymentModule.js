(function(app) {
    'use strict';

})
(angular.module('refresh.onceOffPayment',
    [
        'ngRoute',
        'refresh.accounts',
        'refresh.paymentService',
        'refresh.flow',
        'refresh.mcaHttp',
        'refresh.metadata',
        'refresh.typeahead',
        'refresh.beneficiaries',
        'refresh.payments.limits',
        'refresh.validators.limits',
        'refresh.branchLazyLoadingService',
        'refresh.filters',
        'refresh.parameters'
    ]) );
