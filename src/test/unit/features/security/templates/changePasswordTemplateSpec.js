describe('change password template', function () {
    'use strict';

    beforeEach(module('refresh.changePassword', 'refresh.mustEqual', 'ngMessages'));

    var scope, document, templateTestHelper,timeout;

    beforeEach(inject(function (_TemplateTest_, Fixture, $timeout) {
        templateTestHelper = _TemplateTest_;
        timeout = $timeout;
        scope = templateTestHelper.scope;
        var html = templateTestHelper.addRootNodeToDocument(Fixture.load('base/main/features/security/partials/changePassword.html'));
        document = templateTestHelper.compileTemplate(html);
    }));

    it('should link the old password field to the scope', function () {
        templateTestHelper.changeInputValueTo(document.find('#oldPassword'), 'someoldpassword');
        timeout.flush();
        scope.$digest();
        expect(scope.changePasswordModel.oldPassword).toBe('someoldpassword');
    });

    it('should link the new password field to the scope', function () {
        templateTestHelper.changeInputValueTo(document.find('#newPassword'), 'somenewPassword1');
        timeout.flush();
        scope.$digest();
        expect(scope.changePasswordModel.password).toBe('somenewPassword1');
    });

    it('should link the confirm password field to the scope', function () {
        templateTestHelper.changeInputValueTo(document.find('#newPassword'), 'somenewPassword2');
        templateTestHelper.changeInputValueTo(document.find('#confirmPassword'), 'somenewPassword2');
        timeout.flush();
        scope.$digest();
        expect(scope.changePasswordModel.confirmPassword).toBe('somenewPassword2');
    });

    it('should make sure we call the correct function when save button is clicked', function () {
        templateTestHelper.changeInputValueTo(document.find('#oldPassword'), 'password');
        templateTestHelper.changeInputValueTo(document.find('#newPassword'), 'Validpassword1');
        templateTestHelper.changeInputValueTo(document.find('#confirmPassword'), 'Validpassword1');


        var changePassword = jasmine.createSpy('changePassword');
        scope.changePassword = changePassword;
        document.find('#save-password').click();
        expect(changePassword).toHaveBeenCalled();
    });

    it('should not enable the next button when not valid', function () {
        templateTestHelper.changeInputValueTo(document.find('#oldPassword'), 'password');
        templateTestHelper.changeInputValueTo(document.find('#newPassword'), 'invalidpassword');
        templateTestHelper.changeInputValueTo(document.find('#confirmPassword'), 'invalidpassword');

        timeout.flush();
        scope.$digest();

        expect(document.find('#save-password').attr('disabled')).toBe('disabled');
        expect(visibleErrors()).toEqual(['Please enter a valid password']);

        templateTestHelper.changeInputValueTo(document.find('#newPassword'), 'Pro12345');
        scope.$digest();
        expect(document.find('#save-password').attr('disabled')).toBe('disabled');
        expect(visibleErrors()).toEqual(['The two passwords do not match']);

        templateTestHelper.changeInputValueTo(document.find('#confirmPassword'), 'Pro12345');
        scope.$digest();
        expect(document.find('#save-password').attr('disabled')).toBeUndefined();
        expect(visibleErrors()).toEqual([]);
    });

    function visibleErrors() {
        var visibleError = document.find('ng-messages').not('.ng-hide').find('ng-message.form-error');
        return _.map(visibleError, function (visibleError) { return visibleError.innerText; } );
    }
});
