'use strict';

(function (app) {
    app.factory('GroupsService', function ($q, BeneficiariesListService, ServiceEndpoint, Cacher, DtmAnalyticsService) {
        return {
            list: function (card) {
                var deferred = $q.defer();
                if (card.number) {
                    deferred.resolve(Cacher.shortLived.fetch('viewBeneficiaryGroup', {card: card}));
                } else {
                    var errorMessage = 'Can not retrieve beneficiary groups because the card number is not specified';
                    DtmAnalyticsService.sendError(errorMessage);
                    deferred.reject(errorMessage);
                }
                return deferred.promise;
            },
            listWithMembers: function (card) {
                var deferred = $q.defer();
                $q.all([
                    this.list(card),
                    BeneficiariesListService.formattedBeneficiaryList(card)
                ])
                .then(function (data) {
                    if (data[0] && data[0].data && data[0].data.groups) {
                        var beneficiaryList = data[1];
                        var beneficiaryGroups = _.map(data[0].data.groups, function (group) {
                            group.beneficiaries = _.where(beneficiaryList, {recipientGroupName: group.name});
                            return group;
                        });
                        deferred.resolve({beneficiaryList: beneficiaryList, beneficiaryGroups: beneficiaryGroups});
                    }
                    else {
                        return deferred.reject(data[0]);
                    }
                }, function (error) {
                    deferred.reject(error);
                });

                return deferred.promise;
            },
            clear: function () {
                Cacher.shortLived.flushEndpoint('viewBeneficiaryGroup');
            },
            add: function (groupName, card) {
                this.clear();
                var deferred = $q.defer();
                var request = {card: card,
                    groups: [
                        {'name': groupName,
                            'oldName': null,
                            'orderIndex': 1}
                    ]};
                ServiceEndpoint.addBeneficiaryGroup.makeRequest(request)
                    .then(function (response) {
                        if (response.headers('x-sbg-response-code') === "0000") {
                            deferred.resolve(response);
                        } else if (response.headers('x-sbg-response-type') === "ERROR" && response.headers('x-sbg-response-code') === "2700") {
                            deferred.reject({message: 'You already have a beneficiary group with this name.'});
                        } else if (response.headers('x-sbg-response-type') === "ERROR" && response.headers('x-sbg-response-code') === "2702") {
                            deferred.reject({message: 'Group cannot be added as you are already at your maximum number of 30 groups.'});
                        } else {
                            deferred.reject({message: response.headers('x-sbg-response-message')});
                        }
                    }, function (error) {
                        deferred.reject({message: 'An error has occurred'});
                    });
                return deferred.promise;
            },
            deleteGroup: function (group, card) {
                BeneficiariesListService.clear();
                this.clear();
                return ServiceEndpoint.deleteBeneficiaryGroups.makeRequest({groups: [ {name: group.name} ], card: card});
            },
            rename: function (newName, oldName, card) {
                BeneficiariesListService.clear();
                this.clear();
                var deferred = $q.defer();
                var request = {card: card,
                    groups: [
                        {'name': newName,
                            'oldName': oldName,
                            'orderIndex': 1}
                    ]};
                ServiceEndpoint.renameBeneficiaryGroup.makeRequest(request).then(function (response) {
                    if (response.headers('x-sbg-response-code') === "0000") {
                        deferred.resolve(response);
                    }
                    else if (response.headers('x-sbg-response-type') === "ERROR" && response.headers('x-sbg-response-code') === "2700") {
                        deferred.reject({message: 'You already have a beneficiary group with this name.'});
                    }
                    else if (response.headers('x-sbg-response-type') === "ERROR" && response.headers('x-sbg-response-code') === "2702") {
                        deferred.reject({message: 'Group cannot be added as you are already at your maximum number of 30 groups.'});
                    }
                    else {
                        deferred.reject({message: (response.headers('x-sbg-response-message') || 'An error has occurred')});
                    }
                }, function (error) {
                    deferred.reject({message: 'An error has occurred'});
                });
                return deferred.promise;
            }
        };
    });
})(angular.module('refresh.beneficiaries.groupsService', ['refresh.beneficiaries.groups', 'refresh.metadata', 'refresh.cache', 'refresh.configuration']));
