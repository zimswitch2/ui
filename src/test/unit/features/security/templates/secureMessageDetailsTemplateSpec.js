describe('secure message details template', function () {
    'use strict';

    var scope, document, templateTestHelper;

    beforeEach(module('refresh.secure.message.details', 'refresh.notifications', 'refresh.sbInput'));

    beforeEach(inject(function (_TemplateTest_, Fixture) {
        templateTestHelper = _TemplateTest_;
        scope = templateTestHelper.scope;
        templateTestHelper.allowTemplate('common/flow/partials/flow.html');
        templateTestHelper.allowTemplate('common/sbform/partials/sbTextInput.html');
        var html = templateTestHelper.addRootNodeToDocument(Fixture.load('base/main/features/security/partials/secureMessageDetails.html'));
        document = templateTestHelper.compileTemplate(html);
    }));

    describe('home telephone number', function () {
        it('should be required when business number is empty', function () {
            scope.secureMessage = {};
            document.find('#homeTelephone').addClass('has-been-visited');
            scope.$digest();

            expect(document.find('sb-input[name="homeTelephone"] ng-message').text()).toEqual('Please enter at least one telephone number');
        });

        it('should not be required when business number is valid', function () {
            scope.secureMessage = { businessTelephone: '0212121212' };
            document.find('#homeTelephone').addClass('has-been-visited');
            scope.$digest();
            expect(document.find('sb-input[name="homeTelephone"] span.form-error:not(.ng-hide)').length).toBe(0);
        });
    });

    describe('business telephone number', function () {
        it('should be required when home number is empty', function () {
            scope.secureMessage = {};
            document.find('#businessTelephone').addClass('has-been-visited');
            scope.$digest();

            expect(document.find('sb-input[name="businessTelephone"] ng-message').text()).toEqual('Please enter at least one telephone number');
        });

        it('should not be required when home number is valid', function () {
            scope.secureMessage = { homeTelephone: '0212121212' };
            document.find('#businessTelephone').addClass('has-been-visited');
            scope.$digest();
            expect(document.find('sb-input[name="businessTelephone"] span.form-error:not(.ng-hide)').length).toBe(0);
        });
    });

    describe('cancel button', function () {
        it('should have a track click', function () {
            expect(document.find('#cancel').attr('track-click')).toBe('send secure message.cancel');
        });
    });

    describe('error message', function () {
        it('should be invisible if boolean is falsy', function () {
            scope.errorMessage = '';
            scope.$digest();
            expect(document.find('div.error').first().hasClass('ng-hide')).toBeTruthy();
        });

        it('should be visible if boolean is truthy', function () {
            scope.errorMessage = 'this is a error message';
            scope.$digest();
            expect(document.find('div.error').first().hasClass('ng-hide')).toBeFalsy();
            expect(document.find('div.error').first().text()).toBe('this is a error message');
        });
    });
});
