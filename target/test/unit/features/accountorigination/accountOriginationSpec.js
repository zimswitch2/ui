var rcp = false;
{
    rcp = true;
}


describe('Account Origination', function () {
    'use strict';

    beforeEach(module('refresh.accountOrigination'));

    describe('Apply for Account', function () {
        var menu, location;

        beforeEach(inject(function ($rootScope, $controller,Menu, $location) {
            menu = Menu;
            location = $location;
            $rootScope.$broadcast('loggedIn');
        }));

        describe('menu', function () {
            it('should populate the main menu when user is authenticated', function () {

                var expected;
                if (rcp) {
                    expected = {'title': 'Apply for Account', 'url': '/apply' };
                } else {
                    expected = {'title': 'Apply for Account', 'url': '/apply/current-account' };
                }

                expect(menu.items().length).toEqual(1);

                var actual = menu.items()[0];
                expect(actual.title).toEqual(expected.title);
                expect(actual.url).toEqual(expected.url);
            });

            it('should not highlight its menu item when it is not active', function () {
                location.path('/beneficiaries');
                expect(menu.items()[0].showIf()).toBeFalsy();
            });

            it('should activate the menu if the current page is the account origination products', function () {
                location.path('/apply/products');
                expect(menu.items()[0].showIf()).toBeTruthy();
            });

            it('should activate the menu if the current page is the customer information page', function () {
                location.path('/apply/current-account/profile');
                expect(menu.items()[0].showIf()).toBeTruthy();
            });

            it('should activate the menu if the current page is the account origination offers', function () {
                location.path('/apply/current-account/offer');
                expect(menu.items()[0].showIf()).toBeTruthy();
            });

        });
    });
});
