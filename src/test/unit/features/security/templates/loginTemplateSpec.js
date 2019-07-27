describe('login template', function () {
    'use strict';

    beforeEach(module('refresh.login.controller', 'refresh.sbInput'));

    var scope, element, templateTestHelper;

    beforeEach(inject(function (_TemplateTest_, Fixture) {
        templateTestHelper = _TemplateTest_;
        scope = templateTestHelper.scope;
        templateTestHelper.stubTemplate('common/sbform/partials/sbTextInput.html', '');
        templateTestHelper.allowTemplate('features/security/partials/enhancedLoginForm.html');
        templateTestHelper.allowTemplate('features/security/partials/loginForm.html');
        templateTestHelper.allowTemplate('features/security/partials/loginFormWithSimplifiedMobileView.html');
        var html = templateTestHelper.addRootNodeToDocument(Fixture.load('base/main/features/security/partials/login.html'));
        element = templateTestHelper.compileTemplate(html);
    }));

    var button;
    beforeEach(function () {
         button = element.find('#sign-in-mobile');
    });

    describe('the "continue to sign in" button', function () {
        it('should be in a div that is only visible on small screens', function () {
            expect(button.text()).toContain('Sign in');
        });

        it('should disappear when clicked', function () {
            button.click();
            expect(button.hasClass('ng-hide')).toBeTruthy();
        });
    });

    describe('login form', function () {
        it('should not be visible before the "continue to sign in" button is clicked', function () {
            expect(element.find('section#login-details').hasClass('hide-for-small-only')).toBeTruthy();
        });

        it('should be visible when the "continue to sign in" button is clicked', function () {
            button.click();
            expect(element.find('section#login-details').hasClass('hide-for-small-only')).toBeFalsy();
        });
    });
});
