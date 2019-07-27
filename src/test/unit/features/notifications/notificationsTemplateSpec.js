'use strict';

describe('notifications template', function () {
    var scope, element, NotificationService;

    beforeEach(module('refresh.notifications'));
    beforeEach(module('refresh.logout'));

    beforeEach(inject(function (TemplateTest, _NotificationService_, Card) {
        Card.setCurrent('number', 9);
        scope = TemplateTest.scope;
        scope.shouldDisplayLogoutOption = function() { return true; };
        NotificationService = _NotificationService_;
        element = TemplateTest.compileTemplateInFile('features/notifications/partials/errorNotification.html');
    }));

    describe('generic error', function() {
        it('should show logout button', function () {
            NotificationService.displayGenericServiceError({ status: 500, message: 'foo' });
            scope.$digest();
            expect(element.find('button.logout_button').length).toEqual(1);
        });
        
        it('should show account summary action', function(){
            NotificationService.displayGenericServiceError({ status: 500, message: 'foo' });
            scope.$digest();
            expect(element.find('.actions a[href="#/account-summary/"]').length).toEqual(1);
        });
    });

    describe('popup', function() {
        it('should show logout button', function () {
            NotificationService.displayPopup('foo', { showLogoutAction: true });
            scope.$digest();
            expect(element.find('button.logout_button').length).toEqual(1);
        });

        it('should not show logout button', function () {
            NotificationService.displayPopup('foo', {});
            scope.$digest();
            expect(element.find('button').hasClass('ng-hide')).toBeTruthy();
        });

        it('should show custom actions', function () {
            NotificationService.displayPopup('foo', 'foo', { actions: { foo: 'foo/bar', fuu: 'fuu/bur' }});
            scope.$digest();
            var actions = element.find('.actions a');
            expect(actions.length).toEqual(2);
            expect(actions[0].innerHTML).toEqual('foo');
            expect(actions[0].href).toContain('foo/bar');
            expect(actions[1].innerHTML).toEqual('fuu');
            expect(actions[1].href).toContain('fuu/bur');
        });

        it('should show close button', function () {
            NotificationService.displayPopup('foo', 'foo', { showOkAction: true });
            scope.$digest();
            expect(element.find('button.ok_button').length).toEqual(1);
        });

        it('should close', function () {
            NotificationService.displayPopup('foo', 'foo', { showOkAction: true });
            scope.$digest();
            element.find('button.ok_button').click();
            scope.$digest();
            expect(scope.notificationError).toBeUndefined();
            expect(scope.notificationOptions).toBeUndefined();
        });
    });
});
