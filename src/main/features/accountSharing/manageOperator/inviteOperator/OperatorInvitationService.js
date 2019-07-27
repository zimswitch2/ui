(function () {
    'use strict';
    angular
        .module('refresh.accountSharing.inviteOperator')
        .service('OperatorInvitationService', function (ServiceEndpoint, ServiceError, AccountsService, OperatorService, Card, $q) {
            var serv = this;
            var invitation = {};

            serv.setInvitationDetails = function (details) {
                invitation = details;
            };

            serv.getDetails = function () {
                return invitation;
            };

            serv.reset = function () {
                return invitation = {};
            };

            serv.searchInvite = function(invite) {
                return ServiceEndpoint
                    .searchOperatorInvite
                    .makeRequest(invite)
                    .then(function (response) {
                        if (response.headers('x-sbg-response-code') === '9001' && !response.data.searchInviteResponse) {

                            return $q.reject(ServiceError.newInstance(response.headers('x-sbg-response-message'), {}));

                        } else if (response.headers('x-sbg-response-code') === '9999') {
                            return $q.reject(ServiceError.newInstance(response.headers('x-sbg-response-message'), {}));
                        } else if (!response.data.searchInviteResponse) {
                            return $q.reject(ServiceError.newInstance("Invitation not found", {}));
                        }
                        return response.data;
                    },
                    function (response) {


                        return $q.reject(ServiceError.newInstance('An error has occurred', {}));
                    });
            };

            serv.getInvitationDetails = function (invite) {

                var searchInviteResponseDataPromise = serv.searchInvite(invite);

                var rolesPromise = OperatorService.roles();
                var accountsPromise = AccountsService.list(Card.current());

                return $q.all({
                    searchInviteResponseData: searchInviteResponseDataPromise,
                    roles: rolesPromise,
                    accountsResponse: accountsPromise
                }).then(function(results){
                    var invitationDetails = _.clone(results.searchInviteResponseData.searchInviteResponse);
                    invitationDetails.permissions = _.map(invitationDetails.permissions, function(perm){
                        return {
                            role: _.clone(_.find(results.roles, {
                                id: perm.role.id
                            })),
                            accountReference: _.cloneDeep(_.find(results.accountsResponse.accounts, {
                                number: perm.accountReference.number
                            }))
                        };
                    });

                    return invitationDetails;
                });
            };
            serv.acceptInvite = function (invite) {
                return ServiceEndpoint
                    .acceptInvitation
                    .makeRequest(invite)
                    .then(function (response) {
                            return  response.data;
                        },
                        function(response){
                            return $q.reject(ServiceError.newInstance('An error has occurred'));
                        });
            };
            serv.declineInvite = function (invite) {
                return ServiceEndpoint
                    .declineInvitation
                    .makeRequest(invite)
                    .then(function (response) {
                        return  response.data;
                },
                function(response){
                    return $q.reject(ServiceError.newInstance('An error has occurred'));
                });
            };
            serv.deleteInvite = function (invite) {
                return ServiceEndpoint
                    .deleteInvitation
                    .makeRequest(invite)
                    .then(function (response) {
                            return  response.data;
                        },
                        function(response){
                            return $q.reject(ServiceError.newInstance('An error has occurred'));
                        });
            };
        });
})();
