describe('Dashboard', function () {
    'use strict';

    describe('isHotCarded', function () {
        var dashboard = new Dashboard({});

        using(['2003', '7509', '7510', '7513', '0000'], function (code) {
            it('should return false when the status code is not 2004, current code is '+ code, function () {
                dashboard.setCard({statusCode: code});
                expect(dashboard.isHotCarded()).toBeFalsy();
            });
        });

        it('should return true when card is status code 2004', function () {
            dashboard.setCard({statusCode: '2004'});
            expect(dashboard.isHotCarded()).toBeTruthy();
        });

    });

    describe('isBlocked', function () {
        var dashboard = new Dashboard({});
        it('should return false when there is no card error', function () {
            expect(dashboard.isBlocked()).toBeFalsy();
        });

        it('should return false when there is a card error not in the list of blocked codes or status 500', function () {
            dashboard.setCard({statusCode: '1234'});
            expect(dashboard.isBlocked()).toBeFalsy();
        });

        using(['2003', '2004', '7509', '7510', '7513'], function (value) {
            it('should return true when the card error code is ' + value, function () {
                dashboard.setCard({statusCode: value});
                expect(dashboard.isBlocked()).toBeTruthy();
            });
        });

        it('should return true when there is a card error with status 500', function () {
            dashboard.setCard({statusCode: 500});
            expect(dashboard.isBlocked()).toBeTruthy();
        });
    });

    describe('canBeActivated', function () {
        var dashboard = new Dashboard({});
        it('should return false when there is no card error', function () {
            expect(dashboard.canBeActivated()).toBeFalsy();
        });

        it('should return false when there is a card error not in the list of activate response codes', function () {
           dashboard.setCard({statusCode: 'not blocked'});
            expect(dashboard.canBeActivated()).toBeFalsy();
        });

        using(['7506', '7516', '7501', '7515'], function (value) {
            it('should return true when the card error code is ' + value, function () {
                dashboard.setCard({statusCode: value});
                expect(dashboard.canBeActivated()).toBeTruthy();
            });
        });
    });

    describe('requiresActivateOTP', function () {
        var dashboard = new Dashboard({});
        it('should return false when the response code is not in the list of activate OTP response codes', function () {
            dashboard.setCard({statusCode: 'not activate otp'});
            expect(dashboard.requiresActivateOTP()).toBeFalsy();
        });

        using(['7506', '7516', '7501'], function (value) {
            it('should return true when the response code is ' + value, function () {
                dashboard.setCard({statusCode: value});
                expect(dashboard.requiresActivateOTP()).toBeTruthy();
            });
        });
    });

    describe('requiresAmendAccessDirect', function () {
        var dashboard = new Dashboard({});
        it('should return false when the response code is not 7515', function () {
            dashboard.setCard({statusCode: 'not 7515'});
            expect(dashboard.requiresAmendAccessDirect()).toBeFalsy();
        });

        it('should return true when the response code is 7515', function () {
            dashboard.setCard({statusCode: '7515'});
            expect(dashboard.requiresAmendAccessDirect()).toBeTruthy();
        });
    });

    describe('cardStatus', function () {
        var dashboard = new Dashboard({});
        it('should return error message if no suitable status can be determined', function () {
            dashboard.setCard({statusCode: 'non-specific error'});
            expect(dashboard.cardStatus()).toBe('There was a problem retrieving this dashboard');
        });

        it('should return active if we have a card number', function () {
            dashboard.setCard({statusCode: '0000', cardNumber: '1234'});
            expect(dashboard.cardStatus()).toBe('Active');
        });

        using(['2003', '2004', '7509', '7510', '7513'], function (value) {
            it('should return Blocked when the card error code is ' + value, function () {
                dashboard.setCard({statusCode: value});
                expect(dashboard.cardStatus()).toBe('Blocked');
            });
        });

        using(['7506', '7516', '7501'], function (value) {
            it('should return Activate OTP when the card error code is ' + value, function () {
                dashboard.setCard({statusCode: value});
                expect(dashboard.cardStatus()).toBe('Activate OTP');
            });
        });

        it('should return Activate internet banking when the card error code is 7515', function () {
            dashboard.setCard({statusCode: '7515'});
            expect(dashboard.cardStatus()).toBe('Activate internet banking');
        });
    });

    describe('set card', function () {
        var dashboard = new Dashboard({});
        describe('for a valid card', function () {
            it('should set the customer SAP Bp Id',function(){
                dashboard.setCard({
                    sapBpId:'mofo'
                });

                expect(dashboard.customerSAPBPID).toEqual('mofo');
            });
            it('should set the card number', function () {
                dashboard.setCard({
                    cardNumber: 'card number',
                    statusCode: '0000'
                });
                expect(dashboard.card).toEqual('card number');
            });

            it('should mask a 9 digit card number', function () {
                dashboard.setCard({
                    cardNumber: '123456789',
                    statusCode: '0000'
                });
                expect(dashboard.cardNumber).toEqual('******123456789***');
            });

            it('should not mask a non-9 digit card number', function () {
                dashboard.setCard({
                    cardNumber: '1234567890',
                    statusCode: '0000'
                });
                expect(dashboard.cardNumber).toEqual('1234567890');
            });
            describe("for SED profiles", function () {
                it("should set the cardHolder", function () {
                    dashboard.systemPrincipalKey= 'SED';
                    dashboard.setCard({
                        cardNumber: 'card number',
                        statusCode: '0000',
                        isCardHolder: true
                    });
                    expect(dashboard.isCardHolder).toBeTruthy();

                });
            });

            describe('for a dashboard with an existing card', function () {
                it('should clear the card error', function () {
                    dashboard.cardError = '12345';
                    dashboard.setCard({
                        cardNumber: 'card number',
                        statusCode: '0000'
                    });
                    expect(dashboard.cardError).toBeUndefined();
                });
            });
        });

        describe('for an invalid card', function () {
            it('should set the cardError', function () {
                dashboard.setCard({
                    cardNumber: 'card number',
                    statusCode: '7515'
                });
                expect(dashboard.cardError).toEqual({
                    code: '7515',
                    message: 'Please activate your internet banking'
                });
            });

            it('should set the masked card number', function () {
                dashboard.setCard({
                    cardNumber: 'card number',
                    statusCode: '7515'
                });
                expect(dashboard.cardNumber).toEqual('card number');
            });

            it('should set the cardError if there is no card number', function () {
                dashboard.setCard({
                    statusCode: '0000'
                });
                expect(dashboard.cardError).toEqual({
                    code: '0000',
                    message: 'An error occurred, please try again later'
                });
            });

            describe('for a dashboard with an existing card', function () {
                it('should clear the card error', function () {
                    dashboard.card = '12345';
                    dashboard.setCard({
                        cardNumber: 'card number',
                        statusCode: '7515'
                    });
                    expect(dashboard.card).toBeUndefined();
                });
            });
        });

        describe('for a given card', function () {
            it('should set the unmasked card number for a non 9 digit card with a success status code ', function () {
                dashboard.setCard({
                    cardNumber: 'card number',
                    statusCode: '0000'
                });
                dashboard.setCard();

                expect(dashboard.card).toEqual('card number');
                expect(dashboard.cardNumber).toEqual('card number');
            });

            it('should set the unmasked card number for a non 9 digit card with a non success status code ', function () {
                dashboard.setCard({
                    cardNumber: 'card',
                    statusCode: '7515'
                });
                dashboard.setCard();

                expect(dashboard.cardError).toEqual({
                    code: '7515',
                    message: 'Please activate your internet banking'
                });
                expect(dashboard.cardNumber).toEqual('card');
            });

            it('should set the card number for a 9 digit card with a success status code ', function () {
                dashboard.setCard({
                    cardNumber: '123456789',
                    statusCode: '0000'
                });
                dashboard.setCard();

                expect(dashboard.card).toEqual('123456789');
                expect(dashboard.cardNumber).toEqual('******123456789***');
            });

            it('should set the card number for a 9 digit card with a non success status code', function () {
                dashboard.setCard({
                    cardNumber: '123456789',
                    statusCode: '7515'
                });
                dashboard.setCard();

                expect(dashboard.cardNumber).toEqual('******123456789***');
            });

            it('should mask only 9 digit card numbers', function (){
                dashboard.setCard({
                    cardNumber: '123456789'
                });
                dashboard.setCard();

                expect(dashboard.cardNumber).toEqual('******123456789***');
            });

            it('should not mask a card number which is not  9 digits long', function (){
                dashboard.setCard({
                    cardNumber: '12345678'
                });
                dashboard.setCard();

                expect(dashboard.cardNumber).toEqual('12345678');
            });
        });
    });

    describe('permissions', function () {

        var dashboard;

        beforeEach(function() {
            dashboard = new Dashboard({});
        });

        it ('should be an empty set by default', function () {
            var dashboard = new Dashboard({});
            expect(dashboard.permissions).toEqual([]);
        });

        it('should be able to accept a set of permisisons when being constructed', function () {
            var expectedPermissions = [{
                "accountReference": {
                    "id": "44",
                    "number": "70456321"
                },
                "permissionTypes": [{
                    "action": "Capture",
                    "activity": "Once-off Payment"
                }]
            }];
            var dashboard = new Dashboard({ permissions: expectedPermissions});

            expect(dashboard.permissions).toEqual(expectedPermissions);
        });
    });
});
