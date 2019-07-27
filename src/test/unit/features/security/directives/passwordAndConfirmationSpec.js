'use strict';

describe('Password And Confirmation', function () {
    var scope, test, document;

    beforeEach(module('refresh.passwordAndConfirmation', 'refresh.sbInput'));

    beforeEach(inject(function (_TemplateTest_, Fixture) {
        scope = _TemplateTest_.scope;
        test = _TemplateTest_;
        test.allowTemplate('common/sbform/partials/sbTextInput.html');
        test.allowTemplate('features/registration/partials/password.html');
        document = test.compileTemplate('<form><password-and-confirmation passwordLabel="pwd" passwordConfirmationLabel="pwd confirmation"></password-and-confirmation></form>');
    }));

    it('should have two passwords', function () {
        expect(document.find('input').length).toBe(2);
    });

    it('should show password and confirmation label', function() {
        expect(document.find('label[for=password]').text()).toBe('pwd');
        expect(document.find('label[for=confirmPassword]').text()).toBe('pwd confirmation');
    });

    it('should show password and confirmation label as default value if not set', function() {
        var defaultDocument = test.compileTemplate('<form><password-and-confirmation></password-and-confirmation></form>');
        expect(defaultDocument.find('label[for=password]').text()).toBe('Password');
        expect(defaultDocument.find('label[for=confirmPassword]').text()).toBe('Confirm password');
    });
});
