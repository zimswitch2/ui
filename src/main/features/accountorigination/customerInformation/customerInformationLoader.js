(function () {
    'use strict';

    var app = angular.module('refresh.accountOrigination.domain.customerInformationLoader', ['refresh.accountOrigination.domain.customer', 'refresh.accountOrigination.customerService','refresh.notifications.service']);

    app.factory('CustomerInformationLoader', function ($q, CustomerService, CustomerInformationData) {
        return {
            load: function(){
                return CustomerService.getCustomer().then(function(customerRecord){
                    CustomerInformationData.initialize(customerRecord);
                });
            }
        };
    });
})();