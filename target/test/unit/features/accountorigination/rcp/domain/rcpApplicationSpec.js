describe('RCP Application Factory', function () {
    'use strict';

    var rcpApplication, offer;

    beforeEach(module('refresh.accountOrigination.rcp.domain.rcpApplication'));

    beforeEach(inject(function (_RcpApplication_) {
        rcpApplication = _RcpApplication_;
    }));

    describe('isNew', function () {
        beforeEach(function () {
            offer = {
                applicationNumber: 'SATMSYST 20140820141510001',
                offerDetails: {
                    approved: true,
                    maximumLoanAmount: 100000,
                    interestRate: 22.5,
                    repaymentFactor: 20.0,
                    productName: 'RCP',
                    productNumber: 8
                }
            };
        });

        it('should be falsy if not started', function () {
            expect(rcpApplication.isNew()).toBeFalsy();
        });

        it('should be truthy if started', function () {
            rcpApplication.start();
            expect(rcpApplication.isNew()).toBeTruthy();
        });
    });

    describe('select RCP application details', function () {
        var selection = {
            selectedBranch: {
                code: 5, name: 'Bollisa'
            },
            debitOrder: {
                account: {
                    number: "12345",
                    "branch": {name: 'Branch 113', code: '113'},
                    isStandardBank: false
                },

                repayment: {
                    day: 6,
                    amount: 1000
                },
                electronicConsent: true
            },
            requestedLimit: 300000
        };

        beforeEach(function () {
            rcpApplication.select(selection);
        });

        it('should return the selected options', function () {
            expect(rcpApplication.selection()).toEqual(selection);
        });
    });

    describe('decline Rcp offer', function () {
        beforeEach(function () {
            offer = {
                reason: 'DECLINED',
                message: 'Test Message'
            };

            rcpApplication.decline({offer: offer});
        });

        it('should set the offer to the declined offer', function () {

            expect(rcpApplication.offer()).toEqual(offer);
        });

        it('should return true for isDeclined', function () {
            expect(rcpApplication.isDeclined()).toBeTruthy();
        });
    });

    describe('continue Rcp application', function () {
        beforeEach(function () {
            rcpApplication.continue(offer);
        });

        it('should set the offer that was passed in', function () {
            var savedOffer = rcpApplication.offer();

            expect(offer).toEqual(savedOffer);
        });

        it('should indicate that pre-screening is completed', function () {
            expect(rcpApplication.isPreScreeningComplete).toBeTruthy();
        });

        it('should indicate application is pending', function () {
            expect(rcpApplication.isPending()).toBeTruthy();
        });
    });
});