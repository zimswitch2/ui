(function () {
  'use strict';

  angular
      .module('refresh.accountSharing.addUser')
      .service('AddUserService', function (ServiceEndpoint, User, ServiceError, $q) {
        var serv = this;
        var user = {};
        var accountRoles = {};
        var permissions = [];
        var _invitation = {};
        var originUrl;
        var sendReferenceNumberDetails = {};

        var entryMode = {
            mode: "",
            desc: ""
        };
        var inviteIdentifier = {
            idNumber: "",
            referenceNumber: ""
        };
        serv.user = function () {
          return user;
        };

        serv.setUser = function(_user) {
            user = _user;
        };

        serv.setInviteIdentifier = function(_inviteIdentifier) {
            inviteIdentifier = _inviteIdentifier;
        };

        serv.reset = function () {
          user = {};
          accountRoles = {};
          permissions = [];
          sendReferenceNumberDetails = {};
          entryMode = {};
        };

        serv.accountRoles = function () {
          return accountRoles;
        };

        serv.setAccountRoles = function(permissions){
            _.forEach(permissions, function (p) {
                accountRoles[p.accountReference.number] = p.role.name;
            });
        };

        serv.addUser = function () {
          return ServiceEndpoint
              .addUser
              .makeRequest({
                systemPrincipalIdentifier: User.principalForCurrentDashboard().systemPrincipalIdentifier,
                userDetails: user,
                permissions: permissions
              })
              .then(function (result) {
                if (result.headers('x-sbg-response-code') === '9999' || result.headers('x-sbg-response-code') === '9001') {
                  return $q.reject(ServiceError.newInstance(result.headers('x-sbg-response-message'), {}));

                }
                return result.data;
              },
              function () {
                return $q.reject(ServiceError.newInstance('An error has occurred', {}));
              });

        };

      serv.editInvitation = function () {

          return ServiceEndpoint
              .editOperatorInvite
              .makeRequest({
                  systemPrincipalIdentifier: User.principalForCurrentDashboard().systemPrincipalIdentifier,
                  inviteIdentifier: inviteIdentifier,
                  userDetails: user,
                  permissions: permissions
              })
              .then(function (result) {
                  return result.data;
              },
              function () {
                  return $q.reject(ServiceError.newInstance('An error has occurred', {}));
              });

      };

        serv.permissions = function () {
          return permissions;
        };

        serv.invitation = function (invitation) {
          return _invitation = invitation || _invitation;
        };

        function account(originalAccount) {
          return {
            accountTypeName: originalAccount.accountTypeName,
            formattedNumber: originalAccount.formattedNumber,
            productName: originalAccount.productName,
            number: originalAccount.number
          };
        }

        function role(originalRole) {
          return {
            "id": originalRole.id,
            "name": originalRole.name,
            "description": originalRole.description
          };
        }

        serv.createPermissions = function (accounts, roles, accountRoles) {
          permissions = _(accounts)
              .filter(function (originalAccount) {
                return accountRoles[originalAccount.number] !== "None";
              })
              .map(function (originalAccount) {
                return {
                  accountReference: account(originalAccount),
                  role: role(_.find(roles, {
                    name: accountRoles[originalAccount.number]
                  }))
                };
              })
              .value();
        };

        serv.setFlowOrigin = function (url) {
          originUrl = _.clone(url);
        };

        serv.originUrl = function () {
          return originUrl;
        };

        serv.sendReferenceNumberDetails = function () {
          return sendReferenceNumberDetails;
        };

        serv.sendInviteReferenceNumber = function () {
          return ServiceEndpoint
              .sendInviteReferenceNumber
              .makeRequest({
                systemPrincipalIdentifier: User.principalForCurrentDashboard().systemPrincipalIdentifier,
                sendReferenceNumberDetails: sendReferenceNumberDetails
              })
              .then(function (result) {
                return result.data;
              });
        };
      });
})();
