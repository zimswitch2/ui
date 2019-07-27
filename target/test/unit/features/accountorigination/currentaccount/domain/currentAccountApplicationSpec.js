describe('Current Account Application Factory', function () {
    'use strict';

    var currentAccountApplication, offer;
    beforeEach(module('refresh.accountOrigination.currentAccount.domain.currentAccountApplication'));

    beforeEach(inject(function(CurrentAccountApplication) {
        currentAccountApplication = CurrentAccountApplication;
    }));

    it('prescreening should report that it has not been completed by default', function(){
        expect(currentAccountApplication.isPreScreeningComplete()).toBeFalsy();
    });

    describe('isNew', function () {
        it('should be falsy if not started', function () {
            expect(currentAccountApplication.isNew()).toBeFalsy();
        });

        it('should be truthy if started', function () {
            currentAccountApplication.start();
            expect(currentAccountApplication.isNew()).toBeTruthy();
        });
    });

    describe('isPending', function () {
        it('should be falsy if not continued', function () {
            expect(currentAccountApplication.isPending()).toBeFalsy();
        });

        it('should be truthy if continued', function () {
            currentAccountApplication.continue({ applicationNumber: '1' });
            expect(currentAccountApplication.isPending()).toBeTruthy();
        });
    });

    describe('isInProgress', function () {
        it('should be falsy if product is not selected', function () {
            expect(currentAccountApplication.isInProgress()).toBeFalsy();
        });

        it('should be truthy if product is selected', function () {
            currentAccountApplication.select({ applicationNumber: '1' });
            expect(currentAccountApplication.isInProgress()).toBeTruthy();
        });
    });

    describe('when customer is under debt review', function(){
        beforeEach(function(){
            currentAccountApplication.preScreening.debtReview = true;
        });

        it ('customer should not be able to apply for overdraft', function(){
            expect(currentAccountApplication.canApplyForOverdraft()).toBeFalsy();
        });
    });

    describe('when pre-screening is completed', function(){
        beforeEach(function(){
            currentAccountApplication.completePreScreening();
        });

        it ('customer should not be able to apply for overdraft', function(){
            expect(currentAccountApplication.isPreScreeningComplete()).toBeTruthy();
        });
    });

    describe('decline Current account offer', function () {
        beforeEach(function () {
            offer = {
                reason: 'DECLINED',
                message: 'Test Message'
            };

            currentAccountApplication.decline({offer: offer});
        });

        it('should set the offer to the declined offer', function () {

            expect(currentAccountApplication.offer()).toEqual(offer);
        });

        it('should return true for isDeclined', function () {
            expect(currentAccountApplication.isDeclined()).toBeTruthy();
        });
    });
});
