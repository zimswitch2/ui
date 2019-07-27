describe('Unit Test - View Payment Notification History Template', function () {
    'use strict';

    var paymentNotificationItems = [
        {
            "paymentDate": '2014-06-24T22:00:00.000+0000',
            "amount": 12,
            "beneficiaryName": "911 TRUCK RENTALS",
            "beneficiaryReference": "TEST",
            "paymentConfirmationMethod": "Email",
            "recipientName": "Wen",
            "sentTo": "Www@qwy.co.za",
            "transactionNumber": 148054
        },
        {
            "paymentDate": '2014-05-24T22:00:00.000+0000',
            "amount": 1,
            "beneficiaryName": "WAYNE WAS HERE",
            "beneficiaryReference": "SDHJFGD",
            "paymentConfirmationMethod": "Fax",
            "recipientName": "wayne was here",
            "sentTo": "0787477220",
            "transactionNumber": 148051
        }
    ];


    beforeEach(module('refresh.payment-notification-history', 'refresh.test'));

    var templateTest, scope, document;
    beforeEach(inject(function (TemplateTest, $rootScope) {
        scope = $rootScope.$new();
        templateTest = TemplateTest;
        templateTest.allowTemplate('features/payment/partials/paymentNotificationHistory.html');
        templateTest.allowTemplate('features/goToAnchor/partials/scrollOnClick.html');
        templateTest.scope = scope;
        document = templateTest.compileTemplateInFile('features/payment/partials/paymentNotificationHistory.html');
    }));

    describe('when loaded', function () {
        it('should show arrow icon on payment date and beneficiary name column header', function () {
            var withArrow = document.find('.action-table .header .information .icon.icon-sort');
            expect(withArrow.length).toBe(2);
            expect(withArrow.first().parent().text()).toContain('Payment date');
            expect(withArrow.last().parent().text()).toContain('Beneficiary name');
        });
    });

    describe('when payment Notification History is empty', function () {
        it('should show empty message', function () {
            scope.paymentNotificationHistory = [];
            scope.$apply();
            var infoMessage = document.find('span.information.message');
            expect(infoMessage.length).toBe(1);
            expect(infoMessage.text()).toBe('There is no payment confirmation history for this account.');
        });
    });

    describe('when payment Notification History is not empty', function () {

        var paymentHeader, beneficiaryName;

        beforeEach(function () {
            paymentHeader = document.find('.action-table .header .information div').first();
            beneficiaryName = templateTest.elementAt(1, document.find('.action-table .header .information div'));

            scope.sortBy = function (column) {
                scope.sort = {criteria: column};
            };
            scope.paymentNotificationHistory = paymentNotificationItems;
            scope.$apply();
        });

        it('should hide empty message', function () {
            var infoMessage = document.find('span.information.message');
            expect(infoMessage.length).toBe(0);
        });

        it('should active arrow in payment date header when sort by payment date', function () {
            expect(paymentHeader.find('i').hasClass('active')).toBeFalsy();
            expect(beneficiaryName.find('i').hasClass('active')).toBeFalsy();
            paymentHeader.find('a').click();
            expect(paymentHeader.find('i').hasClass('active')).toBeTruthy();
            expect(beneficiaryName.find('i').hasClass('active')).toBeFalsy();
        });

        it('should active arrow in beneficiary name header when sort by beneficiary name', function () {
            expect(paymentHeader.find('i').hasClass('active')).toBeFalsy();
            expect(beneficiaryName.find('i').hasClass('active')).toBeFalsy();
            beneficiaryName.find('a').click();
            expect(paymentHeader.find('i').hasClass('active')).toBeFalsy();
            expect(beneficiaryName.find('i').hasClass('active')).toBeTruthy();
        });
    });
});
