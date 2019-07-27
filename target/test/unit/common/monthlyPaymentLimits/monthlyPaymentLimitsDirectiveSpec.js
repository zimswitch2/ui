describe('Monthly payment limits', function () {
    beforeEach(module('refresh.monthlyPaymentLimits.directives', function ($controllerProvider) {
        $controllerProvider.register('MonthlyPaymentLimitsController', function ($scope) {
            $scope.limits = {
                monthlyEAPLimit: 100,
                usedEAPLimit: 66,
                availableEAPLimit: 34
            };
        });
    }));

    describe('directive', function () {
        var template, element, scope, interval;
        beforeEach(inject(function ($rootScope, _TemplateTest_, $interval) {
            interval = $interval;
            template = _TemplateTest_;

            template.allowTemplate('common/monthlyPaymentLimits/partials/monthlyPaymentLimits.html');
            element = template.compileTemplate('<monthly-payment-limits></monthly-payment-limits>');
            scope = template.scope;
        }));

        it('should show the monthly limit', function () {
            expect(element.find('.monthly-eap-limit').text()).toBe('R 100.00');
        });

        it('should show the monthly available limit', function () {
            expect(element.find('.available-eap-limit').text()).toBe('R 34.00');
        });

        it('should show the monthly used limit', function () {
            expect(element.find('.used-eap-limit').text()).toBe('R 66.00');
        });

        it('should show a progress bar', function() {
            expect(element.find('.progress-bar').size()).toEqual(1);
        });
    });
});
