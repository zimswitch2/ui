describe('Paramters', function () {
    'use strict';

    var accountPreferencesService;

    beforeEach(module('refresh.profileAndSettings.preferences.formal'));

    beforeEach(inject(function (AccountPreferencesService) {
        accountPreferencesService = AccountPreferencesService;
    }));

    describe('adding statement preference', function () {
        it('should add a statement preference', function () {
            accountPreferencesService.addStatementPreference({someObject: 'an Object'});
            expect(accountPreferencesService.getStatementPreference()).toEqual({someObject: 'an Object'});
        });

        it('should clear the service', function () {
            accountPreferencesService.addStatementPreference({someObject: 'an Object'});
            accountPreferencesService.clear();
            expect(accountPreferencesService.getStatementPreference()).toEqual({});
        });
    });

    describe('account numbers with preferences,', function () {

        it('should be able to get the account numbers with preferences set', function () {
            var accountNumbersWithPreferences = ['some account number with preferences', 'another one'];
            accountPreferencesService.setAccountNumbersWithPreferences(accountNumbersWithPreferences);
            expect(accountPreferencesService.getAccountNumbersWithPreferences()).toBe(accountNumbersWithPreferences);
        });
    });
});
