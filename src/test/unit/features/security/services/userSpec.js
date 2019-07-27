describe('User', function () {
    'use strict';

    var cardService, card, profile, shortLived, DtmAnalyticsService;

    beforeEach(module('refresh.security.user'));

    beforeEach(module(function ($provide) {
        cardService = jasmine.createSpyObj('CardService', ['fetchCards']);
        $provide.value('CardService', cardService);

        card = jasmine.createSpyObj('Card', ['setCurrent']);
        $provide.value('Card', card);

        shortLived = jasmine.createSpyObj('shortLived', ['flush']);
        $provide.value('Cacher', {shortLived: shortLived});
    }));

    var scope, user, mock;

    beforeEach(inject(function ($rootScope, User, Fixture, _mock_, _DtmAnalyticsService_) {
        scope = $rootScope;
        user = User;
        mock = _mock_;
        DtmAnalyticsService = _DtmAnalyticsService_;
    }));

    describe("after capturing customer", function () {

        var systemPrincipalIdentifier = {
            systemPrincipalId: '12345',
            systemPrincipalKey: 'SBSA_SAP'
        };

        beforeEach(function () {
            user.build(rawNoDashboardsData.userProfile);
            scope.$digest();

            user.setBpIdSystemPrincipalIdentifier(systemPrincipalIdentifier);
        });

        it("should have customer", function () {
            expect(user.hasBasicCustomerInformation()).toBeTruthy();
        });

        it("should have set bpIdSystemPrincipalIdentifier", function () {
            expect(user.userProfile.bpIdSystemPrincipalIdentifier).toEqual(systemPrincipalIdentifier);
        });
    });

    describe('bpIdPrincipalForNewToBankCustomer', function () {
        it('should return principal for new to bank customer captured', function () {
            user.build(userProfileWithBpId.userProfile);
            expect(user.bpIdPrincipalForNewToBankCustomer()).toEqual({
                systemPrincipalIdentifier: {
                    systemPrincipalId: '9561',
                    systemPrincipalKey: 'SBSA_SAP'
                }
            });
        });
    });

    describe('with meniga services toggled on', function () {
        beforeEach(function () {
            personalFinanceManagementFeature = true;
        });

        describe('build', function () {
            it('should build a valid user profile from valid raw user profile data', function () {
                cardService.fetchCards.and.returnValue(mock.resolve(fourCardsResponse));
                expect(user.build(userProfileWithFourChannels.userProfile)).toBeResolved();

                scope.$digest();

                expect(cardService.fetchCards).toHaveBeenCalledWith(user.userProfile.dashboards);
                expect(user.userProfile).toEqual(formattedUserProfileWithCards);
            });

            it('should resolve when no SBSA channels exist', function () {
                expect(user.build(rawNoDashboardsData.userProfile)).toBeResolved();
                scope.$digest();

                expect(user.userProfile.dashboards).toEqual([]);
            });

            it('should not create any dashboards when user has bpId', function () {
                expect(user.build(userProfileWithBpId.userProfile)).toBeResolved();
                scope.$digest();

                expect(user.userProfile.dashboards).toEqual([]);
            });

            it('should contain bpIdSystemPrincipalIdentifier when user has bpId', function () {
                user.build(userProfileWithBpId.userProfile);
                scope.$digest();

                expect(user.userProfile.bpIdSystemPrincipalIdentifier).toEqual(jasmine.objectContaining({
                    systemPrincipalId: '9561',
                    systemPrincipalKey: 'SBSA_SAP'
                }));
            });

            it('should add the card number to multiple dashboards with the same system principal id', function () {
                cardService.fetchCards.and.returnValue(mock.resolve(oneUnblockedCardResponse));
                user.build({
                        bpId: false,
                        channelProfiles: [
                            {
                                profileId: '59758',
                                systemPrincipalIdentifiers: [
                                    {
                                        systemPrincipalId: '9561',
                                        systemPrincipalKey: 'SBSA_BANKING'
                                    }
                                ]
                            },
                            {
                                profileId: '43657',
                                systemPrincipalIdentifiers: [
                                    {
                                        systemPrincipalId: '9561',
                                        systemPrincipalKey: 'SBSA_BANKING'
                                    }
                                ]
                            }
                        ],
                        digitalId: {}
                    }
                );

                scope.$digest();
                var dashboards = user.userProfile.dashboards;

                expect(cardService.fetchCards).toHaveBeenCalledWith(user.userProfile.dashboards);

                expect(dashboards[0].card).toEqual('4451221116405778');
                expect(dashboards[1].card).toEqual('4451221116405778');
            });

            it('should card number to one dashboard', function () {
                cardService.fetchCards.and.returnValue(mock.resolve(oneUnblockedCardResponse));
                user.build({
                        bpId: false,
                        channelProfile: {
                            profileId: '43657',
                            systemPrincipalIdentifiers: [
                                {
                                    systemPrincipalId: '9561',
                                    systemPrincipalKey: 'SBSA_BANKING'
                                }
                            ]
                        },
                        digitalId: {}
                    }
                );

                scope.$digest();
                var dashboards = user.userProfile.dashboards;

                expect(cardService.fetchCards).toHaveBeenCalledWith(dashboards);

                expect(dashboards[0].card).toEqual('4451221116405778');
            });

            it('should send the default dashboard principal first when sending multiple principals', function () {
                cardService.fetchCards.and.returnValue(mock.resolve([
                    {
                        cardNumber: '4451221116412345',
                        personalFinanceManagementId: 9,
                        systemPrincipalId: '2',
                        statusCode: '0000'
                    },
                    {
                        cardNumber: '4451221116405778',
                        personalFinanceManagementId: 9,
                        systemPrincipalId: '1',
                        statusCode: '0000'
                    }
                ]));
                user.build({
                        bpId: false,
                        channelProfiles: [
                            {
                                profileName: 'First',
                                profileId: '59758',
                                systemPrincipalIdentifiers: [
                                    {
                                        systemPrincipalId: '1',
                                        systemPrincipalKey: 'SBSA_BANKING'
                                    }
                                ]
                            },
                            {
                                profileName: 'Second',
                                profileId: '43657',
                                systemPrincipalIdentifiers: [
                                    {
                                        systemPrincipalId: '2',
                                        systemPrincipalKey: 'SBSA_BANKING'
                                    }
                                ]
                            }
                        ],
                        defaultProfileId: '43657',
                        digitalId: {}
                    }
                );

                scope.$digest();
                var dashboards = user.userProfile.dashboards;

                expect(cardService.fetchCards).toHaveBeenCalledWith(dashboards);

                expect(dashboards).toEqual([
                    jasmine.objectContaining({
                        dashboardName: 'Second',
                        systemPrincipalId: '2',
                        systemPrincipalKey: 'SBSA_BANKING',
                        profileId: '43657',
                        card: '4451221116412345',
                        cardNumber: '4451221116412345'
                    }),
                    jasmine.objectContaining({
                        dashboardName: 'First',
                        systemPrincipalId: '1',
                        systemPrincipalKey: 'SBSA_BANKING',
                        profileId: '59758',
                        card: '4451221116405778',
                        cardNumber: '4451221116405778'
                    })
                ]);
            });

            it('should send the first dashboard principal first when sending multiple principals and default profile does not contain an SBSA_Banking principal',
                function () {
                    cardService.fetchCards.and.returnValue(mock.resolve([
                        {
                            cardNumber: '4451221116405778',
                            personalFinanceManagementId: 9,
                            systemPrincipalId: '1',
                            statusCode: '0000'
                        },
                        {
                            cardNumber: '4451221116412345',
                            personalFinanceManagementId: 9,
                            systemPrincipalId: '3',
                            statusCode: '0000'
                        },

                    ]));

                    user.build(userProfileWithNonSBSADefaultProfile);

                    scope.$digest();
                    var dashboards = user.userProfile.dashboards;

                    expect(cardService.fetchCards).toHaveBeenCalledWith(dashboards);
                    expect(dashboards).toEqual([
                        jasmine.objectContaining({
                            dashboardName: 'First',
                            systemPrincipalId: '1',
                            systemPrincipalKey: 'SBSA_BANKING',
                            profileId: '59758',
                            card: '4451221116405778',
                            cardNumber: '4451221116405778'
                        }),
                        jasmine.objectContaining({
                            dashboardName: 'Third',
                            systemPrincipalId: '3',
                            systemPrincipalKey: 'SBSA_BANKING',
                            profileId: '43634',
                            card: '4451221116412345',
                            cardNumber: '4451221116412345'
                        })
                    ]);
                });
        });

        describe('has dashboards', function () {
            it('should return true when there are dashboards available', function () {
                cardService.fetchCards.and.returnValue(mock.resolve(fourCardsResponse));
                user.build(userProfileWithFourChannels.userProfile);

                scope.$digest();

                expect(user.hasDashboards()).toBeTruthy();
            });

            it('should return false when there are no dashboards available', function () {
                cardService.fetchCards.and.returnValue(mock.resolve({}));
                user.build(rawNoDashboardsData.userProfile);

                scope.$digest();

                expect(user.hasDashboards()).toBeFalsy();
            });
        });

        describe('default dashboard', function () {
            it('should return the default dashboard with defaultId present', function () {
                cardService.fetchCards.and.returnValue(mock.resolve(fourCardsResponse));
                user.build(userProfileWithFourChannels.userProfile);

                scope.$digest();

                var myUser = user.userProfile;
                expect(user.defaultDashboard()).toEqual(_.find(myUser.dashboards, {profileId: myUser.defaultProfileId}));
            });

            it('should return the default dashboard without a defaultID', function () {
                cardService.fetchCards.and.returnValue(mock.resolve([
                    {
                        cardNumber: '4451221116405778',
                        personalFinanceManagementId: 9,
                        systemPrincipalId: '1',
                        statusCode: '0000'
                    },
                    {
                        cardNumber: '4451221116412345',
                        personalFinanceManagementId: 9,
                        systemPrincipalId: '3',
                        statusCode: '0000'
                    },

                ]));
                user.build(userProfileWithNonSBSADefaultProfile);

                scope.$digest();

                var myUser = user.userProfile;
                expect(user.defaultDashboard()).toEqual(_.find(myUser.dashboards, {profileId: '59758'}));
            });
        });

        describe('add card details to dashboards', function () {
            beforeEach(function () {
                cardService.fetchCards.and.returnValue(mock.resolve({}));
                user.build(rawNoDashboardsData.userProfile);
                scope.$digest();
            });

            it('should fetch the card and add it to the dashboard', function () {
                var dashboard = new Dashboard({
                    dashboardName: 'My Personal Dashboard',
                    systemPrincipalId: '9561',
                    systemPrincipalKey: 'SBSA_BANKING',
                    profileId: '43657'
                });
                user.userProfile.dashboards.push(dashboard);
                cardService.fetchCards.and.returnValue(mock.resolve(oneUnblockedCardResponse));
                user.addCardDetailsToDashboards([dashboard]);

                scope.$digest();

                var onePrincipal = {
                    systemPrincipalId: '9561',
                    systemPrincipalKey: 'SBSA_BANKING'
                };

                expect(cardService.fetchCards).toHaveBeenCalledWith([dashboard]);
                expect(user.findDashboardByProfileId('43657').card).toEqual('4451221116405778');
                expect(user.findDashboardByProfileId('43657').cardNumber).toEqual('4451221116405778');
            });

            it('should mask eighteen digit card number', function () {
                var dashboard = new Dashboard({
                    dashboardName: 'My Personal Dashboard',
                    systemPrincipalId: '9561',
                    systemPrincipalKey: 'SBSA_BANKING',
                    profileId: '43657'
                });
                user.userProfile.dashboards.push(dashboard);
                cardService.fetchCards.and.returnValue(mock.resolve(eighteenDigitCardResponse));
                user.addCardDetailsToDashboards([dashboard]);

                scope.$digest();

                expect(user.findDashboardByProfileId('43657').card).toEqual('445122111');
                expect(user.findDashboardByProfileId('43657').cardNumber).toEqual('******445122111***');
            });

            it('should fetch the card and add an error with message to the dashboard', function () {
                var dashboard = new Dashboard({
                    dashboardName: 'Activate OTP (7516)',
                    systemPrincipalId: '9561',
                    systemPrincipalKey: 'SBSA_BANKING',
                    profileId: '406'
                });
                user.userProfile.dashboards.push(dashboard);
                cardService.fetchCards.and.returnValue(mock.resolve(oneBlockedCardResponse));

                user.addCardDetailsToDashboards([dashboard]);

                scope.$digest();

                expect(user.findDashboardByProfileId('406').cardError.code).toEqual('7516');
                expect(user.findDashboardByProfileId('406').cardError.message).toEqual('Please register for your one-time password (OTP) service to activate your profile');
            });

            it('should fetch the card and add default the error message for an unknown error', function () {
                var dashboard = new Dashboard({
                    dashboardName: 'Activate OTP (7516)',
                    systemPrincipalId: '9561',
                    systemPrincipalKey: 'SBSA_BANKING',
                    profileId: '406'
                });
                user.userProfile.dashboards.push(dashboard);
                cardService.fetchCards.and.returnValue(mock.resolve(oneUnknownErrorCardResponse));

                user.addCardDetailsToDashboards([dashboard]);

                scope.$digest();

                expect(user.findDashboardByProfileId('406').cardError.code).toEqual('1111');
                expect(user.findDashboardByProfileId('406').cardError.message).toEqual('An error occurred, please try again later');
            });

            it('should clear the previous cardError when fetching the card and adding to the dashboard', function () {
                var dashboard = new Dashboard({
                    dashboardName: 'Activate OTP (7516)',
                    systemPrincipalId: '9561',
                    systemPrincipalKey: 'SBSA_BANKING',
                    profileId: '406',
                    cardError: {
                        code: '7515'
                    }
                });
                user.userProfile.dashboards.push(dashboard);
                cardService.fetchCards.and.returnValue(mock.resolve(oneUnblockedCardResponse));
                user.addCardDetailsToDashboards([dashboard]);

                scope.$digest();

                expect(user.findDashboardByProfileId('406').cardError).toBeUndefined();
            });

            it('should clear the card number when fetching the card and adding an error to the dashboard', function () {
                var dashboard = new Dashboard({
                    dashboardName: 'Activate OTP (7516)',
                    systemPrincipalId: '9561',
                    systemPrincipalKey: 'SBSA_BANKING',
                    profileId: '406',
                    card: '12345'
                });
                user.userProfile.dashboards.push(dashboard);
                cardService.fetchCards.and.returnValue(mock.resolve(oneBlockedCardResponse));
                user.addCardDetailsToDashboards([dashboard]);

                scope.$digest();

                expect(user.findDashboardByProfileId('406').cardNumber).toEqual('4451221116405778');
                expect(user.findDashboardByProfileId('406').card).toBeUndefined();
            });
        });

        describe('principal for current dashboard', function () {
            it('should return principal for current dashboard', function () {
                cardService.fetchCards.and.returnValue(mock.resolve(fourCardsResponse));
                user.build(userProfileWithFourChannels.userProfile);

                scope.$digest();

                user.switchToDashboard(user.userProfile.dashboards[1]);

                scope.$digest();

                expect(user.principalForCurrentDashboard()).toEqual({
                    systemPrincipalIdentifier: {
                        systemPrincipalId: '9561',
                        systemPrincipalKey: 'SBSA_BANKING'
                    }
                });
            });
        });

        describe('principal', function () {
            it('should return principal for current dashboard when dashboards are present', function () {
                cardService.fetchCards.and.returnValue(mock.resolve(fourCardsResponse));
                user.build(userProfileWithFourChannels.userProfile);
                scope.$digest();
                user.switchToDashboard(user.userProfile.dashboards[1]);

                expect(user.principal()).toEqual({
                    systemPrincipalIdentifier: {
                        systemPrincipalId: '9561',
                        systemPrincipalKey: 'SBSA_BANKING'
                    }
                });
            });

            it('should return principal for new to bank customer when have bpId', function () {
                user.build(userProfileWithBpId.userProfile);
                scope.$digest();

                expect(user.principal()).toEqual({
                    systemPrincipalIdentifier: {
                        systemPrincipalId: '9561',
                        systemPrincipalKey: 'SBSA_SAP'
                    }
                });
            });

            it('should know if  the current dashboard is for an SED principal', function () {
                cardService.fetchCards.and.returnValue(mock.resolve(sedCardResponse));
                user.build(userProfileWithSEDProfile);
                user.switchToDashboard(user.defaultDashboard());
                scope.$digest();

                expect(user.isCurrentDashboardSEDPrincipal()).toEqual(true);
            });

            it('should know if  the current dashboard is not for an SED principal', function () {
                cardService.fetchCards.and.returnValue(mock.resolve(sedCardResponse));
                user.build(userProfileWithFourChannels.userProfile);
                user.switchToDashboard(user.defaultDashboard());
                scope.$digest();

                expect(user.isCurrentDashboardSEDPrincipal()).toEqual(false);
            });
        });

        describe('SEDOperator', function() {

            it('should not know if the current user is an SED Operator', function () {
                cardService.fetchCards.and.returnValue(mock.resolve(sedCardForOperatorResponse));
                user.build(userProfileWithSEDProfile);
                user.switchToDashboard(user.defaultDashboard());
                scope.$digest();

                expect(user.isSEDOperator()).toEqual(true);
            });

            it('should not know that a card holder is NOT an SED Operator', function () {
                cardService.fetchCards.and.returnValue(mock.resolve(sedCardResponse));
                user.build(userProfileWithSEDProfile);
                user.switchToDashboard(user.defaultDashboard());
                scope.$digest();

                expect(user.isSEDOperator()).toEqual(false);
            });

            it('should not know that user is NOT an SED Operator if not on SED dashboard', function () {
                cardService.fetchCards.and.returnValue(mock.resolve(fourCardsResponse));
                user.build(userProfileWithFourChannels.userProfile);
                scope.$digest();
                user.switchToDashboard(user.userProfile.dashboards[1]);
                expect(user.isSEDOperator()).toEqual(false);
            });
        });

        describe("CardHolder", function () {

            it('should know if  the users is current dashboards cardHolder', function () {
                cardService.fetchCards.and.returnValue(mock.resolve(sedCardResponse));
                user.build(userProfileWithSEDProfile);
                user.switchToDashboard(user.defaultDashboard());
                scope.$digest();

                expect(user.isCurrentDashboardCardHolder()).toBeTruthy();
            });

        });
        describe('add dashboard', function () {
            it('should add new dashboard to current dashboards', function () {
                cardService.fetchCards.and.returnValue(mock.resolve(fourCardsResponse));
                user.build(userProfileWithFourChannels.userProfile);
                scope.$digest();
                var newDashboard = {
                    "channelProfile": {
                        "image": "",
                        "imageDate": null,
                        "profileId": "44532",
                        "profileName": "My Personal Dashboard",
                        "profileStyle": "PERSONAL",
                        "systemPrincipalIdentifiers": [
                            {
                                "systemPrincipalId": "246",
                                "systemPrincipalKey": "SBSA_BANKING"
                            }
                        ],
                        "tileViews": [],
                        "card": "12345678254215"
                    }
                };
                user.addDashboard(newDashboard.channelProfile);
                expect(user.userProfile.dashboards.length).toBe(5);
                expect(user.userProfile.dashboards[4].card).toBe('12345678254215');
            });

            it('should add new SED dashboard to current dashboards', function () {
                cardService.fetchCards.and.returnValue(mock.resolve(fourCardsResponse));
                user.build(userProfileWithFourChannels.userProfile);
                scope.$digest();
                var newDashboard = {
                    "channelProfile": {
                        "image": "",
                        "imageDate": null,
                        "profileId": "44532",
                        "profileName": "My Personal Dashboard",
                        "profileStyle": "PERSONAL",
                        "systemPrincipalIdentifiers": [
                            {
                                "systemPrincipalId": "246",
                                "systemPrincipalKey": "SED"
                            }
                        ],
                        "tileViews": [],
                        "card": "12345678254215"
                    }
                };
                user.addDashboard(newDashboard.channelProfile);
                expect(user.userProfile.dashboards.length).toBe(5);
                expect(user.userProfile.dashboards[4].card).toBe('12345678254215');
            });
        });

        describe('has customer', function () {
            it('should return true when have bpId', function () {
                user.build(userProfileWithBpId.userProfile);

                expect(user.hasBasicCustomerInformation()).toBeTruthy();
            });

            it('should return false when no systemPrincipalId', function () {
                user.build(rawNoDashboardsData.userProfile);

                expect(user.hasDashboards()).toBeFalsy();
            });

            it('should return true when has systemPrincipalId and dashboard', function () {
                cardService.fetchCards.and.returnValue(mock.resolve(fourCardsResponse));
                user.build(userProfileWithFourChannels.userProfile);

                expect(user.hasBasicCustomerInformation()).toBeTruthy();
            });
        });

        describe('switch to dashboard', function () {
            it('should set the currentDashboard to the switchToDashboard', function () {
                cardService.fetchCards.and.returnValue(mock.resolve(fourCardsResponse));
                user.build(userProfileWithFourChannels.userProfile);

                scope.$digest();

                var myUser = user.userProfile;
                user.switchToDashboard(myUser.dashboards[1]);

                expect(myUser.currentDashboard).toEqual(myUser.dashboards[1]);
                expect(card.setCurrent).toHaveBeenCalledWith(myUser.currentDashboard.card, myUser.currentDashboard.personalFinanceManagementId);
            });

            it('should clear all the dependant caches', function () {
                cardService.fetchCards.and.returnValue(mock.resolve(fourCardsResponse));
                user.build(userProfileWithFourChannels.userProfile);

                scope.$digest();

                var myUser = user.userProfile;
                user.switchToDashboard(_.find(myUser.dashboards, {profileId: '59758'}));
                expect(shortLived.flush).toHaveBeenCalled();
            });
        });

        describe('has blocked cards', function () {
            it('should return false if there are no blocked cards', function () {
                cardService.fetchCards.and.returnValue(mock.resolve(oneUnblockedCardResponse));
                user.build(userProfileWithOneUnblockedChannel.userProfile);

                scope.$digest();

                expect(user.hasBlockedCard()).toBeFalsy();
            });

            it('should return true if there are blocked cards', function () {
                cardService.fetchCards.and.returnValue(mock.resolve(fourCardsResponse));
                user.build(userProfileWithFourChannels.userProfile);

                scope.$digest();

                expect(user.hasBlockedCard()).toBeTruthy();
            });
        });

        describe('find dashboard by profile id', function () {
            it('should return the dashboard for a system principal id', function () {
                cardService.fetchCards.and.returnValue(mock.resolve(fourCardsResponse));
                user.build(userProfileWithFourChannels.userProfile);

                scope.$digest();

                expect(user.findDashboardByProfileId('43657')).toEqual(user.defaultDashboard());
            });
        });

        var oneUnblockedCardResponse = [
            {
                cardNumber: '4451221116405778',
                personalFinanceManagementId: 9,
                systemPrincipalId: '9561',
                statusCode: '0000'
            }
        ];
        var oneBlockedCardResponse = [
            {
                cardNumber: '4451221116405778',
                personalFinanceManagementId: 9,
                systemPrincipalId: '9561',
                statusCode: '7516'
            }
        ];
        var oneUnknownErrorCardResponse = [
            {
                cardNumber: '4451221116405778',
                personalFinanceManagementId: 9,
                systemPrincipalId: '9561',
                statusCode: '1111'
            }
        ];
        var eighteenDigitCardResponse = {
            card: {
                cardNumber: '445122111',
                personalFinanceManagementId: 9,
                systemPrincipalId: '9561',
                statusCode: '0000'
            }
        };
        var sedCardResponse = [
            {
                cardNumber: '4451221116405778',
                systemPrincipalId: '991122',
                statusCode: '0000',
                isCardHolder: 'true'
            }
        ];

        var sedCardForOperatorResponse = [
            {
                cardNumber: '4451221116405778',
                systemPrincipalId: '991122',
                statusCode: '0000'
            }
        ];
    });

    describe('with meniga services toggled off', function () {
        beforeEach(function () {
            personalFinanceManagementFeature = false;
        });

        afterEach(function () {
            personalFinanceManagementFeature = true;
        });

        describe('build', function () {
            it('should build a valid user profile from valid raw user profile data', function () {
                cardService.fetchCards.and.returnValue(mock.resolve(fourCardsResponse));
                expect(user.build(userProfileWithFourChannels.userProfile)).toBeResolved();

                scope.$digest();

                expect(cardService.fetchCards).toHaveBeenCalledWith(fourPrincipals);
                expect(user.userProfile).toEqual(formattedUserProfileWithCards);
            });

            it('should resolve when no SBSA channels exist', function () {
                expect(user.build(rawNoDashboardsData.userProfile)).toBeResolved();
                scope.$digest();

                expect(user.userProfile.dashboards).toEqual([]);
            });

            it('should not create any dashboards when user has bpId', function () {
                expect(user.build(userProfileWithBpId.userProfile)).toBeResolved();
                scope.$digest();

                expect(user.userProfile.dashboards).toEqual([]);
            });

            it('should contain bpIdSystemPrincipalIdentifier when user has bpId', function () {
                user.build(userProfileWithBpId.userProfile);
                scope.$digest();

                expect(user.userProfile.bpIdSystemPrincipalIdentifier).toEqual(jasmine.objectContaining({
                    systemPrincipalId: '9561',
                    systemPrincipalKey: 'SBSA_SAP'
                }));
            });

            it('should add the card number to multiple dashboards with the same system principal id', function () {
                cardService.fetchCards.and.returnValue(mock.resolve(oneUnblockedCardResponse));
                user.build({
                        bpId: false,
                        channelProfiles: [
                            {
                                profileId: '59758',
                                systemPrincipalIdentifiers: [
                                    {
                                        systemPrincipalId: '9561',
                                        systemPrincipalKey: 'SBSA_BANKING'
                                    }
                                ]
                            },
                            {
                                profileId: '43657',
                                systemPrincipalIdentifiers: [
                                    {
                                        systemPrincipalId: '9561',
                                        systemPrincipalKey: 'SBSA_BANKING'
                                    }
                                ]
                            }
                        ],
                        digitalId: {}
                    }
                );

                scope.$digest();
                var dashboards = user.userProfile.dashboards;

                expect(cardService.fetchCards).toHaveBeenCalledWith([{
                    systemPrincipalId: '9561',
                    systemPrincipalKey: 'SBSA_BANKING'
                }]);

                expect(dashboards[0].card).toEqual('4451221116405778');
                expect(dashboards[1].card).toEqual('4451221116405778');
            });

            it('should card number to one dashboard', function () {
                cardService.fetchCards.and.returnValue(mock.resolve(oneUnblockedCardResponse));
                user.build({
                        bpId: false,
                        channelProfile: {
                            profileId: '43657',
                            systemPrincipalIdentifiers: [
                                {
                                    systemPrincipalId: '9561',
                                    systemPrincipalKey: 'SBSA_BANKING'
                                }
                            ]
                        },
                        digitalId: {}
                    }
                );

                scope.$digest();
                var dashboards = user.userProfile.dashboards;

                expect(cardService.fetchCards).toHaveBeenCalledWith([{
                    systemPrincipalId: '9561',
                    systemPrincipalKey: 'SBSA_BANKING'
                }]);

                expect(dashboards[0].card).toEqual('4451221116405778');
            });

            it('should send the default dashboard principal first when sending multiple principals', function () {
                cardService.fetchCards.and.returnValue(mock.resolve([
                    {
                        cardNumber: '4451221116412345',
                        systemPrincipalId: '2',
                        statusCode: '0000'
                    },
                    {
                        cardNumber: '4451221116405778',
                        systemPrincipalId: '1',
                        statusCode: '0000'
                    }
                ]));
                user.build({
                        bpId: false,
                        channelProfiles: [
                            {
                                profileName: 'First',
                                profileId: '59758',
                                systemPrincipalIdentifiers: [
                                    {
                                        systemPrincipalId: '1',
                                        systemPrincipalKey: 'SBSA_BANKING'
                                    }
                                ]
                            },
                            {
                                profileName: 'Second',
                                profileId: '43657',
                                systemPrincipalIdentifiers: [
                                    {
                                        systemPrincipalId: '2',
                                        systemPrincipalKey: 'SBSA_BANKING'
                                    }
                                ]
                            }
                        ],
                        defaultProfileId: '43657',
                        digitalId: {}
                    }
                );

                scope.$digest();
                var dashboards = user.userProfile.dashboards;

                expect(cardService.fetchCards).toHaveBeenCalledWith([
                    {
                        systemPrincipalId: '2',
                        systemPrincipalKey: 'SBSA_BANKING'
                    },
                    {
                        systemPrincipalId: '1',
                        systemPrincipalKey: 'SBSA_BANKING'
                    }
                ]);

                expect(dashboards).toEqual([
                    jasmine.objectContaining({
                        dashboardName: 'Second',
                        systemPrincipalId: '2',
                        systemPrincipalKey: 'SBSA_BANKING',
                        profileId: '43657',
                        card: '4451221116412345',
                        cardNumber: '4451221116412345'
                    }),
                    jasmine.objectContaining({
                        dashboardName: 'First',
                        systemPrincipalId: '1',
                        systemPrincipalKey: 'SBSA_BANKING',
                        profileId: '59758',
                        card: '4451221116405778',
                        cardNumber: '4451221116405778'
                    })
                ]);
            });

            it('should send the first dashboard principal first when sending multiple principals and default profile does not contain an SBSA_Banking principal',
                function () {
                    cardService.fetchCards.and.returnValue(mock.resolve([
                        {
                            cardNumber: '4451221116405778',
                            systemPrincipalId: '1',
                            statusCode: '0000'
                        },
                        {
                            cardNumber: '4451221116412345',
                            systemPrincipalId: '3',
                            statusCode: '0000'
                        },

                    ]));

                    user.build(userProfileWithNonSBSADefaultProfile);

                    scope.$digest();
                    var dashboards = user.userProfile.dashboards;

                    expect(cardService.fetchCards).toHaveBeenCalledWith([
                        {
                            systemPrincipalId: '1',
                            systemPrincipalKey: 'SBSA_BANKING'
                        },
                        {
                            systemPrincipalId: '3',
                            systemPrincipalKey: 'SBSA_BANKING'
                        }
                    ]);
                    expect(dashboards).toEqual([
                        jasmine.objectContaining({
                            dashboardName: 'First',
                            systemPrincipalId: '1',
                            systemPrincipalKey: 'SBSA_BANKING',
                            profileId: '59758',
                            card: '4451221116405778',
                            cardNumber: '4451221116405778'
                        }),
                        jasmine.objectContaining({
                            dashboardName: 'Third',
                            systemPrincipalId: '3',
                            systemPrincipalKey: 'SBSA_BANKING',
                            profileId: '43634',
                            card: '4451221116412345',
                            cardNumber: '4451221116412345'
                        })
                    ]);
                });
            describe("for business cards", function () {
                it("should create a dashboard for SED", function () {
                    cardService.fetchCards.and.returnValue(mock.resolve(smallEnterpriseOnlineAccount));
                    user.build({
                            bpId: false,
                            channelProfiles: [
                                {
                                    profileId: '59758',
                                    systemPrincipalIdentifiers: [
                                        {
                                            systemPrincipalId: '123132',
                                            systemPrincipalKey: 'SED'
                                        }
                                    ]
                                }
                            ],
                            digitalId: {}
                        }
                    );

                    scope.$digest();
                    var dashboards = user.userProfile.dashboards;

                    expect(cardService.fetchCards).toHaveBeenCalledWith([{
                        systemPrincipalId: '123132',
                        systemPrincipalKey: 'SED'
                    }]);

                    expect(dashboards[0].card).toEqual('4451221116405779');
                });
            });

        });


        describe('has dashboards', function () {
            it('should return true when there are dashboards available', function () {
                cardService.fetchCards.and.returnValue(mock.resolve(fourCardsResponse));
                user.build(userProfileWithFourChannels.userProfile);

                scope.$digest();

                expect(user.hasDashboards()).toBeTruthy();
            });

            it('should return false when there are no dashboards available', function () {
                cardService.fetchCards.and.returnValue(mock.resolve({}));
                user.build(rawNoDashboardsData.userProfile);

                scope.$digest();

                expect(user.hasDashboards()).toBeFalsy();
            });
        });

        describe('default dashboard', function () {
            it('should return the default dashboard with defaultId present', function () {
                cardService.fetchCards.and.returnValue(mock.resolve(fourCardsResponse));
                user.build(userProfileWithFourChannels.userProfile);

                scope.$digest();

                var myUser = user.userProfile;
                expect(user.defaultDashboard()).toEqual(_.find(myUser.dashboards, {profileId: myUser.defaultProfileId}));
            });

            it('should return the default dashboard without a defaultID', function () {
                cardService.fetchCards.and.returnValue(mock.resolve([
                    {
                        cardNumber: '4451221116405778',
                        systemPrincipalId: '1',
                        statusCode: '0000'
                    },
                    {
                        cardNumber: '4451221116412345',
                        systemPrincipalId: '3',
                        statusCode: '0000'
                    },

                ]));
                user.build(userProfileWithNonSBSADefaultProfile);

                scope.$digest();

                var myUser = user.userProfile;
                expect(user.defaultDashboard()).toEqual(_.find(myUser.dashboards, {profileId: '59758'}));
            });
        });

        describe('add card details to dashboards', function () {
            beforeEach(function () {
                cardService.fetchCards.and.returnValue(mock.resolve({}));
                user.build(rawNoDashboardsData.userProfile);
                scope.$digest();
            });

            it('should fetch the card and add it to the dashboard', function () {
                var dashboard = new Dashboard({
                    dashboardName: 'My Personal Dashboard',
                    systemPrincipalId: '9561',
                    systemPrincipalKey: 'SBSA_BANKING',
                    profileId: '43657'
                });
                user.userProfile.dashboards.push(dashboard);
                cardService.fetchCards.and.returnValue(mock.resolve(oneUnblockedCardResponse));
                user.addCardDetailsToDashboards([dashboard]);

                scope.$digest();

                var onePrincipal = {
                    systemPrincipalId: '9561',
                    systemPrincipalKey: 'SBSA_BANKING'
                };

                expect(cardService.fetchCards).toHaveBeenCalledWith([onePrincipal]);
                expect(user.findDashboardByProfileId('43657').card).toEqual('4451221116405778');
                expect(user.findDashboardByProfileId('43657').cardNumber).toEqual('4451221116405778');
            });

            it('should mask eighteen digit card number', function () {
                var dashboard = new Dashboard({
                    dashboardName: 'My Personal Dashboard',
                    systemPrincipalId: '9561',
                    systemPrincipalKey: 'SBSA_BANKING',
                    profileId: '43657'
                });
                user.userProfile.dashboards.push(dashboard);
                cardService.fetchCards.and.returnValue(mock.resolve(eighteenDigitCardResponse));
                user.addCardDetailsToDashboards([dashboard]);

                scope.$digest();

                expect(user.findDashboardByProfileId('43657').card).toEqual('445122111');
                expect(user.findDashboardByProfileId('43657').cardNumber).toEqual('******445122111***');
            });

            it('should fetch the card and add an error with message to the dashboard', function () {
                var dashboard = new Dashboard({
                    dashboardName: 'Activate OTP (7516)',
                    systemPrincipalId: '9561',
                    systemPrincipalKey: 'SBSA_BANKING',
                    profileId: '406'
                });
                user.userProfile.dashboards.push(dashboard);
                cardService.fetchCards.and.returnValue(mock.resolve(oneBlockedCardResponse));

                user.addCardDetailsToDashboards([dashboard]);

                scope.$digest();

                expect(user.findDashboardByProfileId('406').cardError.code).toEqual('7516');
                expect(user.findDashboardByProfileId('406').cardError.message).toEqual('Please register for your one-time password (OTP) service to activate your profile');
            });

            it('should fetch the card and add default the error message for an unknown error', function () {
                var dashboard = new Dashboard({
                    dashboardName: 'Activate OTP (7516)',
                    systemPrincipalId: '9561',
                    systemPrincipalKey: 'SBSA_BANKING',
                    profileId: '406'
                });
                user.userProfile.dashboards.push(dashboard);
                cardService.fetchCards.and.returnValue(mock.resolve(oneUnknownErrorCardResponse));

                user.addCardDetailsToDashboards([dashboard]);

                scope.$digest();

                expect(user.findDashboardByProfileId('406').cardError.code).toEqual('1111');
                expect(user.findDashboardByProfileId('406').cardError.message).toEqual('An error occurred, please try again later');
            });

            it('should clear the previous cardError when fetching the card and adding to the dashboard', function () {
                var dashboard = new Dashboard({
                    dashboardName: 'Activate OTP (7516)',
                    systemPrincipalId: '9561',
                    systemPrincipalKey: 'SBSA_BANKING',
                    profileId: '406',
                    cardError: {
                        code: '7515'
                    }
                });
                user.userProfile.dashboards.push(dashboard);
                cardService.fetchCards.and.returnValue(mock.resolve(oneUnblockedCardResponse));
                user.addCardDetailsToDashboards([dashboard]);

                scope.$digest();

                expect(user.findDashboardByProfileId('406').cardError).toBeUndefined();
            });

            it('should clear the card number when fetching the card and adding an error to the dashboard', function () {
                var dashboard = new Dashboard({
                    dashboardName: 'Activate OTP (7516)',
                    systemPrincipalId: '9561',
                    systemPrincipalKey: 'SBSA_BANKING',
                    profileId: '406',
                    card: '12345'
                });
                user.userProfile.dashboards.push(dashboard);
                cardService.fetchCards.and.returnValue(mock.resolve(oneBlockedCardResponse));
                user.addCardDetailsToDashboards([dashboard]);

                scope.$digest();

                expect(user.findDashboardByProfileId('406').cardNumber).toEqual('4451221116405778');
                expect(user.findDashboardByProfileId('406').card).toBeUndefined();
            });
        });

        describe('principal for current dashboard', function () {
            it('should return principal for current dashboard', function () {
                cardService.fetchCards.and.returnValue(mock.resolve(fourCardsResponse));
                user.build(userProfileWithFourChannels.userProfile);

                scope.$digest();

                user.switchToDashboard(user.userProfile.dashboards[1]);

                scope.$digest();

                expect(user.principalForCurrentDashboard()).toEqual({
                    systemPrincipalIdentifier: {
                        systemPrincipalId: '9561',
                        systemPrincipalKey: 'SBSA_BANKING'
                    }
                });
            });
        });

        describe('principal', function () {
            it('should return principal for current dashboard when dashboards are present', function () {
                cardService.fetchCards.and.returnValue(mock.resolve(fourCardsResponse));
                user.build(userProfileWithFourChannels.userProfile);
                scope.$digest();
                user.switchToDashboard(user.userProfile.dashboards[1]);

                expect(user.principal()).toEqual({
                    systemPrincipalIdentifier: {
                        systemPrincipalId: '9561',
                        systemPrincipalKey: 'SBSA_BANKING'
                    }
                });
            });

            it('should return principal for new to bank customer when have bpId', function () {
                user.build(userProfileWithBpId.userProfile);
                scope.$digest();

                expect(user.principal()).toEqual({
                    systemPrincipalIdentifier: {
                        systemPrincipalId: '9561',
                        systemPrincipalKey: 'SBSA_SAP'
                    }
                });
            });
        });

        describe('add dashboard', function () {
            it('should add new dashboard to current dashboards', function () {
                cardService.fetchCards.and.returnValue(mock.resolve(fourCardsResponse));
                user.build(userProfileWithFourChannels.userProfile);
                scope.$digest();
                var newDashboard = {
                    "channelProfile": {
                        "image": "",
                        "imageDate": null,
                        "profileId": "44532",
                        "profileName": "My Personal Dashboard",
                        "profileStyle": "PERSONAL",
                        "systemPrincipalIdentifiers": [
                            {
                                "systemPrincipalId": "246",
                                "systemPrincipalKey": "SBSA_BANKING"
                            }
                        ],
                        "tileViews": [],
                        "card": "12345678254215"
                    }
                };
                user.addDashboard(newDashboard.channelProfile);
                expect(user.userProfile.dashboards.length).toBe(5);
                expect(user.userProfile.dashboards[4].card).toBe('12345678254215');
            });
        });

        describe('has customer', function () {
            it('should return true when have bpId', function () {
                user.build(userProfileWithBpId.userProfile);

                expect(user.hasBasicCustomerInformation()).toBeTruthy();
            });

            it('should return false when no systemPrincipalId', function () {
                user.build(rawNoDashboardsData.userProfile);

                expect(user.hasDashboards()).toBeFalsy();
            });

            it('should return true when has systemPrincipalId and dashboard', function () {
                cardService.fetchCards.and.returnValue(mock.resolve(fourCardsResponse));
                user.build(userProfileWithFourChannels.userProfile);

                expect(user.hasBasicCustomerInformation()).toBeTruthy();
            });
        });

        describe('switch to dashboard', function () {
            it('should set the currentDashboard to the switchToDashboard', function () {
                cardService.fetchCards.and.returnValue(mock.resolve(fourCardsResponse));
                user.build(userProfileWithFourChannels.userProfile);

                scope.$digest();

                var myUser = user.userProfile;
                user.switchToDashboard(myUser.dashboards[1]);

                expect(myUser.currentDashboard).toEqual(myUser.dashboards[1]);
                expect(card.setCurrent).toHaveBeenCalledWith(myUser.currentDashboard.card);
            });

            it('should clear all the dependant caches', function () {
                cardService.fetchCards.and.returnValue(mock.resolve(fourCardsResponse));
                user.build(userProfileWithFourChannels.userProfile);

                scope.$digest();

                var myUser = user.userProfile;
                user.switchToDashboard(_.find(myUser.dashboards, {profileId: '59758'}));
                expect(shortLived.flush).toHaveBeenCalled();
            });

            it('should call DtmAnalyticsService.setCustomerSAPBPID', function () {
                var dashboard = {
                    customerSAPBPID: 'mofo'
                };
                spyOn(DtmAnalyticsService, 'setCustomerSAPBPID');

                user.switchToDashboard(dashboard);

                expect(DtmAnalyticsService.setCustomerSAPBPID).toHaveBeenCalledWith(dashboard.customerSAPBPID);
            });
        });

        describe('has blocked cards', function () {
            it('should return false if there are no blocked cards', function () {
                cardService.fetchCards.and.returnValue(mock.resolve(oneUnblockedCardResponse));
                user.build(userProfileWithOneUnblockedChannel.userProfile);

                scope.$digest();

                expect(user.hasBlockedCard()).toBeFalsy();
            });

            it('should return true if there are blocked cards', function () {
                cardService.fetchCards.and.returnValue(mock.resolve(fourCardsResponse));
                user.build(userProfileWithFourChannels.userProfile);

                scope.$digest();

                expect(user.hasBlockedCard()).toBeTruthy();
            });
        });

        describe('find dashboard by profile id', function () {
            it('should return the dashboard for a system principal id', function () {
                cardService.fetchCards.and.returnValue(mock.resolve(fourCardsResponse));
                user.build(userProfileWithFourChannels.userProfile);

                scope.$digest();

                expect(user.findDashboardByProfileId('43657')).toEqual(user.defaultDashboard());
            });
        });


        describe('all cards hot carded', function () {
            it('should return true when all cards are hot carded', function () {
                var hotCardedChannels = {
                    userProfile: {
                        bpId: false,
                        channelProfiles: [
                            {

                                profileId: '59758',
                                profileName: 'Glynn',
                                profileStyle: 'PERSONAL',
                                systemPrincipalIdentifiers: [
                                    {
                                        locale: null,
                                        systemPrincipalId: '9561',
                                        systemPrincipalKey: 'SBSA_BANKING'
                                    }
                                ]
                            },
                            {
                                profileId: '43657',
                                profileName: 'My Personal Dashboard',
                                profileStyle: 'PERSONAL',
                                systemPrincipalIdentifiers: [
                                    {
                                        systemPrincipalId: '9562',
                                        systemPrincipalKey: 'SBSA_BANKING'
                                    }
                                ]
                            }
                        ],
                        channelSettings: [],
                        defaultProfileId: '43657',
                        digitalId: {
                            username: 'ibrefresh@standardbank.co.za'
                        },
                        lastLoggedIn: '2014-01-27T08:14:35.000+0000',
                        preferredName: 'Internet Banking User'
                    },
                    keyValueMetadata: [],
                    stepUp: null
                };
                var twoHotCardsResponse = [
                    {
                        cardNumber: '4351221116405778',
                        systemPrincipalId: '9561',
                        statusCode: '2004'
                    },
                    {
                        cardNumber: '431221116405778',
                        systemPrincipalId: '9562',
                        statusCode: '2004'
                    }
                ];

                cardService.fetchCards.and.returnValue(mock.resolve(twoHotCardsResponse));
                user.build(hotCardedChannels.userProfile);

                scope.$digest();
                expect(user.checkAllHotCardedCards()).toBeTruthy();
            });

            it('should return false when all cards are not hot carded', function () {
                cardService.fetchCards.and.returnValue(mock.resolve(fourCardsResponse));
                user.build(userProfileWithFourChannels.userProfile);

                scope.$digest();
                expect(user.checkAllHotCardedCards()).toBeFalsy();
            });
        });

        var fourCardsResponse = [
            {
                cardNumber: '4451221116405778',
                systemPrincipalId: '9561',
                statusCode: '0000'
            },
            {
                cardNumber: '4451221116405778',
                systemPrincipalId: '9562',
                statusCode: '0000'
            },
            {
                cardNumber: '4451221116405778',
                systemPrincipalId: '2004',
                statusCode: '2004'
            },
            {
                cardNumber: '4451221116405778',
                systemPrincipalId: '911',
                statusCode: '0000'
            }
        ];
        var oneUnblockedCardResponse = [
            {
                cardNumber: '4451221116405778',
                systemPrincipalId: '9561',
                statusCode: '0000'
            }
        ];

        var smallEnterpriseOnlineAccount = [
            {
                cardNumber: '4451221116405779',
                systemPrincipalId: '123132',
                statusCode: '0000'
            }
        ];
        var oneBlockedCardResponse = [
            {
                cardNumber: '4451221116405778',
                systemPrincipalId: '9561',
                statusCode: '7516'
            }
        ];
        var oneUnknownErrorCardResponse = [
            {
                cardNumber: '4451221116405778',
                systemPrincipalId: '9561',
                statusCode: '1111'
            }
        ];
        var fiveCardsResponse = [
            {
                cardNumber: '4451221116405778',
                systemPrincipalId: '9561',
                statusCode: '0000'
            },
            {
                cardNumber: '4451221116405778',
                systemPrincipalId: '9562',
                statusCode: '0000'
            },
            {
                cardNumber: '4451221116405778',
                systemPrincipalId: '2004',
                statusCode: '2004'
            },
            {
                cardNumber: '4451221116405778',
                systemPrincipalId: '911',
                statusCode: '0000'
            },
            {
                cardNumber: '4451221116405778',
                systemPrincipalId: '9563',
                statusCode: '0000'
            }
        ];
        var eighteenDigitCardResponse = {
            card: {
                cardNumber: '445122111',
                systemPrincipalId: '9561',
                statusCode: '0000'
            }
        };
    });

    describe('deleting a dashboard from the cache', function () {
        beforeEach(inject(function (User) {
            user = User;
        }));

        it('should have a function called deleteCachedDashoard', function () {

            expect(user.deleteCachedDashboard).toBeDefined();

        });

        it('should delete a dashboard with a given profile id from the cached dashboard list', function () {
            var profileIdToBeDeleted = 666;
            var dashboardToBeDeleted = {dashboardName: 'What?', profileId: profileIdToBeDeleted};
            user.userProfile = {dashboards: [dashboardToBeDeleted, {dashboardName: 'Zoro?', profileId: 123}]};

            var dashboardLength = user.userProfile.dashboards.length;

            expect(user.userProfile.dashboards.length).toEqual(2);

            user.deleteCachedDashboard(profileIdToBeDeleted);
            dashboardLength = user.userProfile.dashboards.length;

            expect(dashboardLength).toEqual(1);
            expect(user.userProfile.dashboards).not.toContain(dashboardToBeDeleted);
        });
    });

    var fourPrincipals = [
        {
            systemPrincipalId: '9562',
            systemPrincipalKey: 'SBSA_BANKING'
        },
        {
            systemPrincipalId: '9561',
            systemPrincipalKey: 'SBSA_BANKING'
        },
        {
            systemPrincipalId: '2004',
            systemPrincipalKey: 'SBSA_BANKING'
        },
        {
            systemPrincipalId: '911',
            systemPrincipalKey: 'SBSA_BANKING'
        }
    ];

    var rawNoDashboardsData = {
        userProfile: {
            bpId: false,
            channelProfiles: [
                {
                    profileId: '59758',
                    profileName: 'Glynn',
                    profileStyle: 'PERSONAL',
                    systemPrincipalIdentifiers: []
                }
            ],
            channelSettings: [],
            defaultProfileId: '43657',
            digitalId: {
                username: 'ibrefresh@standardbank.co.za'
            },
            lastLoggedIn: '2014-01-27T08:14:35.000+0000',
            preferredName: 'Internet Banking User'
        },
        keyValueMetadata: [],
        stepUp: null
    };
    var formattedUserProfileWithCards = {
        username: 'ibrefresh@standardbank.co.za',
        preferredName: 'Internet Banking User',
        defaultProfileId: '43657',
        dashboards: [
            jasmine.objectContaining({
                dashboardName: 'My Personal Dashboard',
                systemPrincipalId: '9562',
                systemPrincipalKey: 'SBSA_BANKING',
                profileId: '43657',
                card: '4451221116405778',
                cardNumber: '4451221116405778'
            }),
            jasmine.objectContaining({
                dashboardName: 'Glynn',
                systemPrincipalId: '9561',
                systemPrincipalKey: 'SBSA_BANKING',
                profileId: '59758',
                card: '4451221116405778',
                cardNumber: '4451221116405778'
            }),
            jasmine.objectContaining({
                dashboardName: 'Hot carded',
                systemPrincipalId: '2004',
                systemPrincipalKey: 'SBSA_BANKING',
                profileId: '98456',
                cardError: {
                    message: 'Your card has been deactivated for security reasons. Please call Customer Care on 0860 123 000 or visit your nearest branch',
                    code: '2004'
                },
                cardNumber: '4451221116405778'
            }),
            jasmine.objectContaining({
                dashboardName: 'Activate OTP (7515)',
                systemPrincipalId: '911',
                systemPrincipalKey: 'SBSA_BANKING',
                profileId: '406',
                card: '4451221116405778',
                cardNumber: '4451221116405778'
            })
        ]
    };
    var userProfileWithFourChannels = {
        userProfile: {
            bpId: false,
            channelProfiles: [
                {

                    profileId: '59758',
                    profileName: 'Glynn',
                    profileStyle: 'PERSONAL',
                    systemPrincipalIdentifiers: [
                        {
                            locale: null,
                            systemPrincipalId: '34193',
                            systemPrincipalKey: 'OST'
                        },
                        {
                            locale: null,
                            systemPrincipalId: '9561',
                            systemPrincipalKey: 'SBSA_BANKING'
                        }
                    ]
                },
                {
                    profileId: '43657',
                    profileName: 'My Personal Dashboard',
                    profileStyle: 'PERSONAL',
                    systemPrincipalIdentifiers: [
                        {
                            locale: null,
                            systemPrincipalId: '34193',
                            systemPrincipalKey: 'OST'
                        },
                        {
                            systemPrincipalId: '9562',
                            systemPrincipalKey: 'SBSA_BANKING'
                        }
                    ]
                },
                {
                    profileId: '98456',
                    profileName: 'Hot carded',
                    profileStyle: 'PERSONAL',
                    systemPrincipalIdentifiers: [
                        {
                            systemPrincipalId: '2004',
                            systemPrincipalKey: 'SBSA_BANKING'
                        }
                    ]
                },
                {
                    profileId: '406',
                    profileName: 'Activate OTP (7515)',
                    profileStyle: 'PERSONAL',
                    systemPrincipalIdentifiers: [
                        {
                            systemPrincipalId: '911',
                            systemPrincipalKey: 'SBSA_BANKING'
                        }
                    ]
                }
            ],
            channelSettings: [],
            defaultProfileId: '43657',
            digitalId: {
                username: 'ibrefresh@standardbank.co.za'
            },
            lastLoggedIn: '2014-01-27T08:14:35.000+0000',
            preferredName: 'Internet Banking User'
        },
        keyValueMetadata: [],
        stepUp: null
    };

    var userProfileWithBpId = {
        userProfile: {
            channelProfiles: [
                {

                    profileId: '59758',
                    profileName: 'Glynn',
                    profileStyle: 'PERSONAL',
                    systemPrincipalIdentifiers: [
                        {
                            locale: null,
                            systemPrincipalId: '9561',
                            systemPrincipalKey: 'SBSA_SAP'
                        }
                    ]
                }
            ],
            channelSettings: [],
            defaultProfileId: '43657',
            digitalId: {
                username: 'ibrefresh@standardbank.co.za'
            },
            lastLoggedIn: '2014-01-27T08:14:35.000+0000',
            preferredName: 'Internet Banking User'
        },
        keyValueMetadata: [],
        stepUp: null
    };

    var userProfileWithOneUnblockedChannel = {
        userProfile: {
            bpId: false,
            channelProfiles: [
                {
                    profileId: '59758',
                    profileName: 'Glynn',
                    profileStyle: 'PERSONAL',
                    systemPrincipalIdentifiers: [
                        {
                            locale: null,
                            systemPrincipalId: '34193',
                            systemPrincipalKey: 'OST'
                        },
                        {
                            locale: null,
                            systemPrincipalId: '9561',
                            systemPrincipalKey: 'SBSA_BANKING'
                        }
                    ]
                }
            ],
            channelSettings: [],
            defaultProfileId: '43657',
            digitalId: {
                username: 'ibrefresh@standardbank.co.za'
            },
            lastLoggedIn: '2014-01-27T08:14:35.000+0000',
            preferredName: 'Internet Banking User'
        },
        keyValueMetadata: [],
        stepUp: null
    };

    var userProfileWithNonSBSADefaultProfile = {
        bpId: false,
        channelProfiles: [
            {
                profileName: 'First',
                profileId: '59758',
                systemPrincipalIdentifiers: [
                    {
                        locale: null,
                        systemPrincipalId: '1',
                        systemPrincipalKey: 'SBSA_BANKING'
                    }
                ]
            },
            {
                profileName: 'Second',
                profileId: '43657',
                systemPrincipalIdentifiers: [
                    {
                        systemPrincipalId: '2',
                        systemPrincipalKey: 'SOMETHING_ELSE'
                    }
                ]
            },
            {
                profileName: 'Third',
                profileId: '43634',
                systemPrincipalIdentifiers: [
                    {
                        systemPrincipalId: '3',
                        systemPrincipalKey: 'SBSA_BANKING'
                    }
                ]
            }
        ],
        channelSettings: [],
        defaultProfileId: '43657',
        digitalId: {
            username: 'ibrefresh@standardbank.co.za'
        },
        lastLoggedIn: '2014-01-27T08:14:35.000+0000',
        preferredName: 'Internet Banking User'
    };

    var userProfileWithSEDProfile = {
        bpId: false,
        channelProfiles: [
            {
                profileName: 'SEDProfile',
                profileId: '43657',
                systemPrincipalIdentifiers: [
                    {
                        systemPrincipalId: '991122',
                        systemPrincipalKey: 'SED'
                    }
                ]
            }
        ],
        channelSettings: [],
        defaultProfileId: '43657',
        digitalId: {
            username: 'ibrefresh@standardbank.co.za'
        },
        lastLoggedIn: '2014-01-27T08:14:35.000+0000',
        preferredName: 'Internet Banking User'
    };

    var fourCardsResponse = [
        {
            cardNumber: '4451221116405778',
            personalFinanceManagementId: 9,
            systemPrincipalId: '9561',
            statusCode: '0000'
        },
        {
            cardNumber: '4451221116405778',
            personalFinanceManagementId: 9,
            systemPrincipalId: '9562',
            statusCode: '0000'
        },
        {
            cardNumber: '4451221116405778',
            personalFinanceManagementId: 9,
            systemPrincipalId: '2004',
            statusCode: '2004'
        },
        {
            cardNumber: '4451221116405778',
            personalFinanceManagementId: 9,
            systemPrincipalId: '911',
            statusCode: '0000'
        }
    ];
});

