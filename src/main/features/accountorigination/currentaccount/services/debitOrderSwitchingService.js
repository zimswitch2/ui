(function () {
    'use strict';
    var app = angular.module('refresh.accountOrigination.currentAccount.services.debitOrderSwitchingService', ['refresh.security.user']);

    app.service('DebitOrderSwitchingService', function (ServiceEndpoint, $q, User) {



        var acceptDebitOrderSwitching = function(accountNumber){

            var request = _.merge(User.principal(), { accountNumber: accountNumber} );
            return ServiceEndpoint.acceptDebitOrderSwitching.makeRequest(request).then(function(response){
                if(response.headers('x-sbg-response-type') === 'ERROR' || _.isEmpty(response.data) ||response.data !== 'SUCCESS'){
                    return $q.reject(response);
                }

                return response.data;
            });

        };
        return {
            acceptDebitOrderSwitching: acceptDebitOrderSwitching
        };
    });
})();
