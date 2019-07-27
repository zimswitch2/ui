var personalFinanceManagementFeature = false;
if (feature.personalFinanceManagement) {
    personalFinanceManagementFeature = true;
}

(function (app) {
    'use strict';

    var SBSA_BANKING = 'SBSA_BANKING';
    var SBSA_SAP = 'SBSA_SAP';
    var SED = 'SED';

    function User(CardService, Card, DigitalId, Principal, Cacher, $q, DtmAnalyticsService) {
        return {
            userProfile: {},

            build: function (rawUserData) {
                var username = rawUserData.digitalId.username;
                var preferredName = rawUserData.preferredName || 'User';
                var defaultProfileId = rawUserData.defaultProfileId;

                DigitalId.authenticate(username, preferredName);

                var dashboards = [];
                var bpIdSystemPrincipal;

                var channelProfiles = rawUserData.channelProfile ? [rawUserData.channelProfile] :
                    rawUserData.channelProfiles;

                _.each(channelProfiles, function (channelProfile) {
                    var cardSystemPrincipal = _.find(channelProfile.systemPrincipalIdentifiers, {systemPrincipalKey: SBSA_BANKING});
                    var cardSystemPrincipalSed = _.find(channelProfile.systemPrincipalIdentifiers, {systemPrincipalKey: SED});

                    if (cardSystemPrincipal) {
                        dashboards.push(new Dashboard({
                            dashboardName: channelProfile.profileName,
                            profileId: channelProfile.profileId,
                            systemPrincipalId: cardSystemPrincipal.systemPrincipalId,
                            systemPrincipalKey: SBSA_BANKING,
                            profileType: channelProfile.profileStyle
                        }));
                    }

                    if (cardSystemPrincipalSed) {
                        dashboards.push(new Dashboard({
                            dashboardName: channelProfile.profileName,
                            profileId: channelProfile.profileId,
                            systemPrincipalId: cardSystemPrincipalSed.systemPrincipalId,
                            systemPrincipalKey: SED,
                            profileType: channelProfile.profileStyle
                        }));
                    }

                    bpIdSystemPrincipal = _.find(channelProfile.systemPrincipalIdentifiers, {systemPrincipalKey: SBSA_SAP});
                });

                dashboards = _.uniq(dashboards, false, 'profileId');

                dashboards = _.sortBy(dashboards, function (dashboard) {
                    return dashboard.profileId !== defaultProfileId;
                });

                this.userProfile = {
                    username: username,
                    preferredName: preferredName,
                    defaultProfileId: defaultProfileId,
                    dashboards: dashboards
                };

                if (bpIdSystemPrincipal) {
                    this.setBpIdSystemPrincipalIdentifier(bpIdSystemPrincipal);
                }

                if (_.isEmpty(dashboards)) {
                    return $q.when();
                } else {
                    return this.addCardDetailsToDashboards(dashboards);
                }
            },

            hasDashboards: function () {
                return !_.isEmpty(this.userProfile.dashboards);
            },

            hasBasicCustomerInformation: function () {
                return this.hasDashboards() || this.userProfile.bpIdSystemPrincipalIdentifier;
            },

            setBpIdSystemPrincipalIdentifier: function(systemPrincipalIdentifier) {
                this.userProfile.bpIdSystemPrincipalIdentifier = systemPrincipalIdentifier;
            },

            switchToDashboard: function (dashboard) {
                Cacher.shortLived.flush();
                this.userProfile.currentDashboard = dashboard;
                if(personalFinanceManagementFeature) {
                    Card.setCurrent(dashboard.card,dashboard.personalFinanceManagementId);
                } else {
                    Card.setCurrent(dashboard.card);
                    DtmAnalyticsService.setCustomerSAPBPID(dashboard.customerSAPBPID);
                    }
            },

            defaultDashboard: function () {
                return this.findDashboardByProfileId(this.userProfile.defaultProfileId) ||
                    this.userProfile.dashboards[0];
            },

            hasBlockedCard: function () {
                return _.some(this.userProfile.dashboards, function (dashboard) {
                    return dashboard.isBlocked();
                });
            },

            findDashboardByProfileId: function (profileId) {
                return _.find(this.userProfile.dashboards, {profileId: profileId});
            },

            addCardDetailsToDashboards: function (dashboards) {
                if(personalFinanceManagementFeature) {
                    return CardService.fetchCards(dashboards).then(function (cards) {
                        _.each(dashboards, function (dashboard) {
                            dashboard.setCard(_.find(cards, {systemPrincipalId: dashboard.systemPrincipalId}));
                        });
                    });
                } else {
                    var principals = _.map(dashboards, function (dashboard) {
                        return {
                            systemPrincipalId: dashboard.systemPrincipalId,
                            systemPrincipalKey: dashboard.systemPrincipalKey
                        };
                    });

                    principals = _.uniq(principals, false, 'systemPrincipalId');

                    return CardService.fetchCards(principals).then(function (cards) {
                        _.each(dashboards, function (dashboard) {
                            dashboard.setCard(_.find(cards, {systemPrincipalId: dashboard.systemPrincipalId}));
                        });
                    });
                }
            },
            principalForCurrentDashboard: function () {
                var dashboard = this.userProfile.currentDashboard;
                return Principal.newInstance(dashboard.systemPrincipalId, dashboard.systemPrincipalKey);
            },

            bpIdPrincipalForNewToBankCustomer: function () {
                return Principal.newInstance(this.userProfile.bpIdSystemPrincipalIdentifier.systemPrincipalId, SBSA_SAP);
            },

            principal: function () {
                if (this.hasDashboards()) {
                    return this.principalForCurrentDashboard();
                }
                return this.bpIdPrincipalForNewToBankCustomer();
            },

            isCurrentDashboardSEDPrincipal: function() {
                return this.principal().systemPrincipalIdentifier.systemPrincipalKey === SED;
            },
            isCurrentDashboardCardHolder :function(){
               return this.userProfile.currentDashboard.isCardHolder;
            },
            isSEDOperator: function() {
               return this.isCurrentDashboardSEDPrincipal() && !this.isCurrentDashboardCardHolder();
            },

            addDashboard: function (dashboard) {
                var cardSystemPrincipal = _.find(dashboard.systemPrincipalIdentifiers, {systemPrincipalKey: SBSA_BANKING});

                if (!cardSystemPrincipal) {
                    cardSystemPrincipal = _.find(dashboard.systemPrincipalIdentifiers, { systemPrincipalKey: SED });
                }

                var newDashboad = new Dashboard({
                    dashboardName: dashboard.profileName,
                    profileId: dashboard.profileId,
                    systemPrincipalId: cardSystemPrincipal.systemPrincipalId,
                    systemPrincipalKey: SBSA_BANKING
                });
                newDashboad.setCard({cardNumber: dashboard.card, maskedCardNumber: dashboard.card, statusCode: '0000'});
                this.userProfile.dashboards.push(newDashboad);
            },

            checkAllHotCardedCards: function(){
                for(var i=0; i < this.userProfile.dashboards.length; i++){
                    if(!this.userProfile.dashboards[i].isHotCarded()){
                        return false;
                    }
                }
                return true;
            },

            deleteCachedDashboard: function (profileId) {
                _.remove(this.userProfile.dashboards, this.findDashboardByProfileId(profileId));

            }
        };
    }

    app.factory('User', User);
})(angular.module('refresh.security.user', ['refresh.card', 'refresh.digitalId', 'refresh.metadata', 'refresh.principal', 'refresh.dtmanalytics']));
