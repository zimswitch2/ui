(function() {
    'use strict';

    angular
        .module('refresh.accountSharing.addUser', [
            'ngRoute',
            'refresh.configuration',
            'refresh.flow',
            'refresh.lookups',
            'refresh.common.homeService',
            'refresh.validators.idNumber',
            'refresh.accountSharing.userDetails',
            'refresh.accountSharing.userPermissions',
        ]);
})();
