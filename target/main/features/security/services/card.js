var personalFinanceManagementFeature = false;


(function (app) {
    'use strict';

    app.factory('CardService', function (ApplicationParameters, Principal, ServiceEndpoint) {

        return {
            fetchCards: personalFinanceManagementFeature ? function (dashboards) {
                var request = {
                    signInChannelProfiles: _.map(dashboards, function (dashboard) {
                        return {
                            profileId: dashboard.profileId,
                            systemPrincipalIdentifiers: dashboard.systemPrincipalId ? [{
                                systemPrincipalId: dashboard.systemPrincipalId,
                                systemPrincipalKey: dashboard.systemPrincipalKey
                            }] : []
                        };
                    })
                };

                return ServiceEndpoint.cards.makeRequest(request)
                    .then(function (response) {
                        return response.data.cards;
                    });
            } : function (principals) {
                var request = {
                    systemPrincipalIdentifiers: principals
                };

                return ServiceEndpoint.cards.makeRequest(request)
                    .then(function (response) {
                        return response.data.cards;
                    });
            }
        };
    });

    app.factory('Card', function () {
        var _cardNumber = null, _personalFinanceManagementId = null;

        return {
            setCurrent: function (cardNumber, personalFinanceManagementId) {
                _cardNumber = cardNumber;
                if(personalFinanceManagementFeature) {
                    _personalFinanceManagementId = personalFinanceManagementId;
                }
            },

            anySelected: function () {
                return _cardNumber !== undefined && _cardNumber !== null;
            },
            current: function () {
                if(personalFinanceManagementFeature) {
                    return angular.copy({
                        "countryCode": "ZA",
                        "number": _cardNumber,
                        "personalFinanceManagementId": _personalFinanceManagementId,
                        "type": "0"
                    });
                } else {
                    return angular.copy({
                        "countryCode": "ZA",
                        "number": _cardNumber,
                        "type": "0"
                    });
                }
            }
        };
    });
})(angular.module('refresh.card', ['refresh.parameters', 'refresh.principal', 'refresh.configuration', 'ngRoute']));
