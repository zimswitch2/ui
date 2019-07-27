describe('securitySettingsSubNav', function() {
    var template, element;

    beforeEach(module('refresh.profileAndSettings.securitySettingsSubNavDirective'));



    beforeEach(inject(function(_TemplateTest_) {
        template = _TemplateTest_;
        template.allowTemplate('features/profileAndSettings/partials/settingsSubNav.html');
    }));

    it('should compile the template', function() {
        element = template.compileTemplate('<security-Settings-Sub-Nav menu-items="\'securitySettingsMenuItems\'"></security-Settings-Sub-Nav>',false);
    });
});