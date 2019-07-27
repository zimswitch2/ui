describe('profileAndSettingsSubNavDirective', function() {

    describe('directive', function() {
        var template, element;

        beforeEach(module('refresh.profileAndSettings.profileAndSettingsSubNavDirective'));

        beforeEach(inject(function(_TemplateTest_) {
            template = _TemplateTest_;
            template.allowTemplate('features/profileAndSettings/partials/settingsSubNav.html');

        }));

        it('should compile the template', function() {
            element = template.compileTemplate('<profile-and-settings-sub-nav menu-items="\'myProfileMenuItems\'"></profile-and-settings-sub-nav>',false);
        });
    });
});