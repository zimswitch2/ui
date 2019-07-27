(function() {
    'use strict';
    angular
        .module('refresh.accountSharing.operator')
        .factory('OperatorService', function(AccountsService, ServiceEndpoint, ServiceError, $q, User, Card, Cacher) {

            var roles = function() {
                return Cacher.perennial
                    .fetch('getRolesForContext', User.principal())
                    .then(function(response) {
                            return response.data.roles;
                        },
                        function(response) {
                            return $q.reject(ServiceError.newInstance('Error fetching permission list', {}));
                        });
            };

            //TODO: Add caching for operators fetch
            var getOperators = function() {
                var operatorsPromise = ServiceEndpoint
                    .getOperatorsForBusiness
                    .makeRequest(User.principal())
                    .then(function(response) {
                            return response.data.operators;
                        },
                        function(response) {
                            return $q.reject(ServiceError.newInstance('An error has occurred', {}));
                        });

                var rolesPromise = roles();
                var accountsPromise = AccountsService.list(Card.current());


                return $q.all({
                    operators: operatorsPromise,
                    roles: rolesPromise,
                    accountsResponse: accountsPromise
                }).then(function(results) {
                    return _.map(results.operators, function(op) {
                        var o = _.cloneDeep(op);
                        o.permissions = _.map(o.permissions, function(perm) {
                            return {
                                role: _.clone(_.find(results.roles, {
                                    id: perm.role.id
                                })),
                                accountReference: _.cloneDeep(_.find(results.accountsResponse.accounts, {
                                    number: perm.accountReference.number
                                }))
                            };
                        });
                        return o;
                    });
                });
            };

            var getPendingOperators = function() {
                var pendingOperatorsPromise = ServiceEndpoint
                    .getPendingOperatorsForBusiness
                    .makeRequest(User.principal())
                    .then(function(response) {
                        return response.data.operators;
                    },
                    function(response) {
                        return $q.reject(ServiceError.newInstance('An error has occurred', {}));
                    });

                var rolesPromise = roles();
                var accountsPromise = AccountsService.list(Card.current());


                return $q.all({
                    operators: pendingOperatorsPromise,
                    roles: rolesPromise,
                    accountsResponse: accountsPromise
                }).then(function(results) {
                    return _.map(results.operators, function(op) {
                        var o = _.cloneDeep(op);
                        o.permissions = _.map(o.permissions, function(perm) {
                            return {
                                role: _.clone(_.find(results.roles, {
                                    id: perm.role.id
                                })),
                                accountReference: _.cloneDeep(_.find(results.accountsResponse.accounts, {
                                    number: perm.accountReference.number
                                }))
                            };
                        });
                        return o;
                    });
                });
            };

            var getOperator = function(id) {
                return getOperators().then(function(operators) {
                    return _.clone(_.find(operators, {
                        id: id
                    }));
                });
            };

            var getPendingOperator = function(idNumber, referenceNumber){
                return getPendingOperators().then(function(pendingOperators){
                    return _.cloneDeep(_.find(pendingOperators, function(pendingOperator){
                        return pendingOperator.userDetails.idNumber === idNumber;
                    }));
                });
            };

            var reInviteOperator = function(idNumber, referenceNumber) {
                var reInviteOperatorRequest = {};

                reInviteOperatorRequest.systemPrincipalIdentifier = User.principalForCurrentDashboard().systemPrincipalIdentifier;
                reInviteOperatorRequest.idNumber = idNumber;
                reInviteOperatorRequest.referenceNumber = referenceNumber;

                return ServiceEndpoint
                    .reInviteOperator
                    .makeRequest(reInviteOperatorRequest, {
                        omitServiceErrorNotification: true
                    })
                    .then(function(response) {
                        return response;
                    }).catch(function(response) {
                        if (response.headers('x-sbg-response-code') === '9005') {

                            return $q.reject(ServiceError.newInstance(response.headers('x-sbg-response-message'), {}));

                        } else if (response.headers('x-sbg-response-code') === '9999') {
                            return $q.reject(ServiceError.newInstance(response.headers('x-sbg-response-message'), {}));
                        }

                        return $q.reject(ServiceError.newInstance('An error occurred.', {}));
                    });
            };

            //TODO: Invalidate Cache on update
            var updateOperator = function(operator) {
                var updateRequest = _.merge({
                    systemPrincipalIdentifier: User.principalForCurrentDashboard().systemPrincipalIdentifier,
                    operatorId: operator.id
                }, operator.userDetails);
                return ServiceEndpoint.updateOperator.makeRequest(updateRequest).then(function(response) {
                    return response.data;
                });
            };

            var updateOperatorPermissions = function (operator) {
                var updatePermissionsRequest = {
                    systemPrincipalIdentifier: User.principalForCurrentDashboard().systemPrincipalIdentifier,
                    operatorId: operator.id,
                    permissions: operator.permissions
                };

                return ServiceEndpoint.updateOperatorPermissions.makeRequest(updatePermissionsRequest).then(function(response) {
                    return response.data;
                });
            };

            var operatorExists = function (idNumber) {
              return getOperators()
                  .then(function (operators) {
                    var exists = false;
                    _.each(operators, function (operator) {
                      if (operator.userDetails.idNumber === idNumber) {
                        exists = true;
                      }
                    });
                    return exists;
                  });
            };

            return {
                getOperators: getOperators,
                getOperator: getOperator,
                operatorExists: operatorExists,
                updateOperator: updateOperator,
                updateOperatorPermissions: updateOperatorPermissions,
                roles: roles,
                deleteOperator: function(operatorId) {
                    var deletionRequest = {};
                    deletionRequest.operatorId = operatorId;
                    deletionRequest.systemPrincipalIdentifier = User.principalForCurrentDashboard().systemPrincipalIdentifier;
                    return ServiceEndpoint
                        .deleteOperator
                        .makeRequest(deletionRequest, {
                            omitServiceErrorNotification: true
                        })
                        .then(function(response) {
                            return response;
                        }).catch(function(response) {
                            if (response.headers('x-sbg-response-code') === '9005') {

                                return $q.reject(ServiceError.newInstance(response.headers('x-sbg-response-message'), {}));

                            } else if (response.headers('x-sbg-response-code') === '9999') {
                                return $q.reject(ServiceError.newInstance(response.headers('x-sbg-response-message'), {}));
                            }

                            return $q.reject(ServiceError.newInstance('An error occurred.', {}));
                        });
                },
                deactivateOperator: function(operatorId) {
                    var deactivationRequest = {};
                    deactivationRequest.operatorId = operatorId;
                    deactivationRequest.systemPrincipalIdentifier = User.principalForCurrentDashboard().systemPrincipalIdentifier;
                    return ServiceEndpoint
                        .deactivateOperator
                        .makeRequest(deactivationRequest, {
                            omitServiceErrorNotification: true
                        })
                        .then(function(response) {
                            return response;
                        }).catch(function(response) {
                            if (response.headers('x-sbg-response-code') === '9005') {

                                return $q.reject(ServiceError.newInstance(response.headers('x-sbg-response-message'), {}));

                            } else if (response.headers('x-sbg-response-code') === '9999') {
                                return $q.reject(ServiceError.newInstance(response.headers('x-sbg-response-message'), {}));
                            }

                            return $q.reject(ServiceError.newInstance('An error occurred.', {}));
                        });
                },
                activateOperator: function(operatorId) {
                    var activationRequest = {};
                    activationRequest.operatorId = operatorId;
                    activationRequest.systemPrincipalIdentifier = User.principalForCurrentDashboard().systemPrincipalIdentifier;
                    return ServiceEndpoint
                        .activateOperator
                        .makeRequest(activationRequest, {
                            omitServiceErrorNotification: true
                        })
                        .then(function(response) {
                            return response;
                        }).catch(function(response) {
                            if (response.headers('x-sbg-response-code') === '9005') {

                                return $q.reject(ServiceError.newInstance(response.headers('x-sbg-response-message'), {}));

                            } else if (response.headers('x-sbg-response-code') === '9999') {
                                return $q.reject(ServiceError.newInstance(response.headers('x-sbg-response-message'), {}));
                            }

                            return $q.reject(ServiceError.newInstance('An error occurred.', {}));
                        });
                },
                getPendingOperators : getPendingOperators,
                getPendingOperator: getPendingOperator,
                reInviteOperator: reInviteOperator
            };
        });
})();
