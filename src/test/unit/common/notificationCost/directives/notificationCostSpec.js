'use strict';

describe('Payment Notification', function () {
    var scope, test;

    beforeEach(module('refresh.notificationCost'));

    beforeEach(inject(function (_TemplateTest_) {
        scope = _TemplateTest_.scope;
        test = _TemplateTest_;
    }));

    it('should render the payment notification cost according to the ngModel', function () {
        scope.beneficiary = {
            paymentConfirmation: {
                confirmationType: "Email"
            }
        };
        var element = test.compileTemplate('<notification-cost ng-model="beneficiary.paymentConfirmation.confirmationType"></notification-cost>');

        scope.$digest();
        expect(element.find('#notification-cost').hasClass('ng-hide')).toBeFalsy();
        expect(element.find('#notification-cost').text()).toBe('(Email fee: R 0.70)');

        scope.beneficiary = {
            paymentConfirmation: {
                confirmationType: "SMS"
            }
        };

        scope.$digest();
        expect(element.find('#notification-cost').text()).toBe('(SMS fee: R 0.90)');
    });

    it('should not render the payment notification cost', function () {
        scope.beneficiary = {
            paymentConfirmation: {
                confirmationType: undefined
            }
        };
        var element = test.compileTemplate('<notification-cost ng-model="beneficiary.paymentConfirmation.confirmationType"></notification-cost>');
        expect(element.find('#notification-cost').hasClass('ng-hide')).toBeTruthy();
    });

});
