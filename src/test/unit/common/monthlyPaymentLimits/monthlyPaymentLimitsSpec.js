'use strict';

describe('Monthly payment limits', function () {

    beforeEach(module('refresh.monthlyPaymentLimits'));

    describe('MonthlyPaymentLimitsController', function () {
        var scope, accountsService, user;
        beforeEach(inject(function ($rootScope, $controller, mock) {
            scope = $rootScope.$new();

            accountsService = jasmine.createSpyObj('accountsService', ['getEAPLimit']);
            accountsService.getEAPLimit.and.returnValue(mock.resolve({
                monthlyEAPLimit: {amount: 10000, currency: "ZAR"},
                usedEAPLimit: {amount: 4000, currency: "ZAR"},
                remainingEAP: {amount: 6000, currency: "ZAR"}
            }));

            user = {
                userProfile: {
                    currentDashboard: {
                        card: '123456788'
                    }
                }
            };

            $controller('MonthlyPaymentLimitsController', {
                $scope: scope,
                AccountsService: accountsService,
                User: user
            });
        }));

        describe('progress bar', function () {
            beforeEach(function () {
                scope.$digest();
            });

            it('should return the percentage of limits', function () {
                expect(scope.progressPercentage()).toEqual(40);
            });

            it('should default to 100% when progress is more than 100', function () {
                scope.limits.usedEAPLimit = 20;
                scope.limits.monthlyEAPLimit = 1;

                scope.$digest();

                expect(scope.progressPercentage()).toEqual(100);
            });

            it('should default used limit to 0 if no limits have been received from the service yet', function () {
                scope.limits = undefined;

                scope.$digest();
                expect(scope.progressPercentage()).toEqual(0);
            });
        });

        it('should pass the current card to the account service', function () {
            var currentCard = user.userProfile.currentDashboard.card;
            expect(accountsService.getEAPLimit).toHaveBeenCalledWith(currentCard);
        });

        it('should know the current monthly EAP limit', function () {
            scope.$digest();
            expect(scope.limits.monthlyEAPLimit).toEqual(10000);
        });

        it('should know the current used monthly EAP limit', function () {
            scope.$digest();
            expect(scope.limits.usedEAPLimit).toEqual(4000);
        });

        it('should calculate the available monthly EAP limit', function () {
            scope.$digest();
            expect(scope.limits.availableEAPLimit).toEqual(6000);
        });
    });
});
