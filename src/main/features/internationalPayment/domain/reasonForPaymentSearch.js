(function () {

    var module = angular.module('refresh.internationalPayment.domain.reasonForPaymentSearch', []);

    module.factory('ReasonForPaymentSearch', function () {
         var search = { searchText: ''};

        return {
            get: function() {
                return search;
            },
            clear: function() {
                search.searchText = '';
            }
        };
    });
})();
