(function () {
    'use strict';

    angular
        .module('refresh.accountSharing.inviteOperator', [
            'refresh.invitationMenu',
            'ngRoute',
            'refresh.flow',
            'refresh.configuration',
            'refresh.lookups',
            'refresh.validators.idNumber',
            'refresh.mcaHttp',
            'refresh.authenticationService']);

})();