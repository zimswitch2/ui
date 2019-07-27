(function() {
    'use strict';

    angular
        .module('refresh.accountSharing', [
            'refresh.accountSharing.addUser',
            'refresh.accountSharing.editUserDetails',
            'refresh.accountSharing.operator',
            'refresh.accountSharing.operatorDetails',
            'refresh.accountSharing.operatorList',
            'refresh.accountSharing.inviteOperator',
            'refresh.security.user',
            'refresh.accountSharing.operatorInvitationDetails',
            'refresh.accountSharing.beneficiaryPayments',
            'refresh.accountSharing.pendingPayments',
            'refresh.accountSharing.rejectedPayments'
        ]);
})();
