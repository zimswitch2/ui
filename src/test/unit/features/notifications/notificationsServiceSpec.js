describe('Notification Service', function () {
    'use strict';

    beforeEach(module('refresh.notifications.service'));

    describe('Generic popup', function () {
        it('should set the error on the scope', inject(function ($rootScope, NotificationService) {
            NotificationService.displayGenericServiceError({status: 500, message: 'An Error Has Occured'});
            expect($rootScope.notificationError).toEqual('This service is currently unavailable. Please try again later, while we investigate');
        }));

        it('should set the default options and reload to account summary when user has a card', inject(function ($rootScope, NotificationService, Card) {
            Card.setCurrent('number', 'personalFinanceManagementId');
            NotificationService.displayGenericServiceError({status: 500, message: 'An Error Has Occured'});
            expect($rootScope.notificationOptions).toEqual({
                showLogoutAction: true,
                actions: {'Reload': '#/account-summary/'}
            });
        }));

        it('should set the default options and reload to account origination when user does not have a card', inject(function ($rootScope, NotificationService) {
            NotificationService.displayGenericServiceError({status: 500, message: 'An Error Has Occured'});
            expect($rootScope.notificationOptions).toEqual({
                showLogoutAction: true,
                actions: {'Reload': '#/apply/'}
            });
        }));

        it('should clear the error on a location change', inject(function ($rootScope, NotificationService) {
            NotificationService.displayGenericServiceError({status: 500, message: 'An Error Has Occured'});
            $rootScope.$broadcast('$routeChangeSuccess');
            expect($rootScope.notificationError).toBeUndefined();
        }));

        it('should not set the error on a 401 error', inject(function ($rootScope, NotificationService) {
            NotificationService.displayGenericServiceError({status: 401, message: 'An Error Has Occured'});
            expect($rootScope.notificationError).toBeUndefined();
        }));

        it('should not set the error on a 403 error', inject(function ($rootScope, NotificationService) {
            NotificationService.displayGenericServiceError({status: 403, message: 'An Error Has Occured'});
            expect($rootScope.notificationError).toBeUndefined();
        }));

        it('should not set the error on an otpError', inject(function ($rootScope, NotificationService) {
            NotificationService.displayGenericServiceError({otpError: true, message: 'An Error Has Occured'});
            expect($rootScope.notificationError).toBeUndefined();
        }));
    });

    describe('Custom popup', function () {
        it('should set the error on the scope', inject(function ($rootScope, NotificationService) {
            NotificationService.displayPopup('Error', 'An Error Has Occured');
            expect($rootScope.notificationTitle).toEqual('Error');
            expect($rootScope.notificationError).toEqual('An Error Has Occured');
        }));

        it('should set options on the scope', inject(function ($rootScope, NotificationService) {
            NotificationService.displayPopup('', '', {actions: {foo: 'bar'}});
            expect($rootScope.notificationOptions).toEqual({actions: {foo: 'bar'}});
        }));

        it('should default actions', inject(function ($rootScope, NotificationService) {
            NotificationService.displayPopup('', '', {foo: 'bar'});
            expect($rootScope.notificationOptions).toEqual({foo: 'bar', actions: {}});
        }));

        it('should clear the error on a location change', inject(function ($rootScope, $location, NotificationService) {
            NotificationService.displayPopup('', '', {foo: 'bar'});
            $rootScope.$broadcast('$routeChangeSuccess');
            expect($rootScope.notificationError).toBeUndefined();
            expect($rootScope.notificationOptions).toBeUndefined();
        }));
    });
});
