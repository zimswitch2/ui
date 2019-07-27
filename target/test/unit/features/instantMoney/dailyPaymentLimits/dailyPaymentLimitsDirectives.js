describe('Daily payment limits', function () {
    beforeEach(module('refresh.dailyPaymentLimits.directives', function ($controllerProvider) {
        $controllerProvider.register('InstantMoneyDetailsController', function ($scope) {
            $scope.dailyWithdrawalLimit = 1000;
        });
    }));

    describe('directive', function () {
        var template, element, scope, interval;
        beforeEach(inject(function ($rootScope, _TemplateTest_, $interval) {
            interval = $interval;
            template = _TemplateTest_;

            template.allowTemplate('features/instantMoney/dailyPaymentLimits/partials/dailyPaymentLimits.html');
            element = template.compileTemplate('<div ng-controller="InstantMoneyDetailsController"><daily-payment-limits limit="dailyWithdrawalLimit"></daily-payment-limits></div>');
            scope = template.scope;
        }));

        it('should show the monthly limit', function () {
            expect(element.find('.withdrawal-limit').text()).toBe('R 1 000.00');
        });

    });
});
