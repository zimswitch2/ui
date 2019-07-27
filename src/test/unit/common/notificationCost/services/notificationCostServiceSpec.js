'use strict';

describe('Notification Cost Service', function () {
    beforeEach(module('refresh.notificationCostService'));

    var service;
    beforeEach(inject(function (_NotificationCostService_) {
        service = _NotificationCostService_;
    }));

    describe('get notification cost', function() {
        it('get Email cost', function() {
            expect(service.getCost('Email')).toBe(0.7);
        });

        it('get SMS cost', function() {
            expect(service.getCost('SMS')).toBe(0.9);
        });

        it('get Fax cost', function() {
            expect(service.getCost('Fax')).toBe(3.2);
        });
    });
});
