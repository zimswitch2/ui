var statementPreferences;

describe('Profiles and Settings Menu', function () {

    beforeEach(module('refresh.profileAndSettings.profileAndSettingsMenu'));

    describe('when the statementPreferences toggle is on', function () {

        beforeEach(function () {
            statementPreferences = true;
        });

        it('should add the product preference', inject(function (ProfilesAndSettingsMenu) {
            expect(ProfilesAndSettingsMenu.getMenu().length).toEqual(3);
        }));
    });

    describe('when the statementPreferences toggle is off', function () {
        beforeEach(function () {
            statementPreferences = false;
        });

        it('should only return the myprofile menu if statementPreferences is turned off', inject(function (ProfilesAndSettingsMenu) {
            expect(ProfilesAndSettingsMenu.getMenu().length).toEqual(2);
        }));
    });

    describe('securitySettings', function () {
        it('should add the product preference', inject(function (ProfilesAndSettingsMenu) {
            expect(ProfilesAndSettingsMenu.getMenu().length).toEqual(2);
        }));
    });

});
