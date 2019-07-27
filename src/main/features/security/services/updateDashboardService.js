(function () {
    'use strict';

    var module = angular.module('refresh.updateDashboard.service', ['refresh.configuration']);

    module.factory('UpdateDashboardService', function (ServiceEndpoint, UpdateDashboardData) {
        return {
            updateDashboardName: function (updateDashboardData) {
                return ServiceEndpoint.updateDashboard.makeRequest(UpdateDashboardData.newInstance(updateDashboardData))
                    .then(function (response) {
                        if (response.headers('x-sbg-response-type') !== "ERROR") {
                            return {
                                success: true,
                                data: response.data
                            };
                        } else {
                            return {
                                success: false,
                                message: response.headers('x-sbg-response-message')
                            };
                        }
                    }, function () {
                        return {
                            success: false,
                            message: 'Dashboard name could not be saved. Check your network connection.'
                        };
                    });
            }
        };
    });

    module.factory('UpdateDashboardData', function () {
        return {
            newInstance: function (updateDashboardData) {
                return {
                    "channelProfile": {
                        "image": updateDashboardData.channelProfile.image,
                        "tileViews": updateDashboardData.channelProfile.tileViews,
                        "profileId": updateDashboardData.channelProfile.profileId,
                        "profileName": updateDashboardData.channelProfile.profileName,
                        "profileStyle": updateDashboardData.channelProfile.profileStyle,
                        "systemPrincipalIdentifiers": updateDashboardData.channelProfile.systemPrincipalIdentifiers
                    }
                };
            }
        };
    });

}());