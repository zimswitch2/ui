describe('Overview menu', function () {
    'use strict';

    beforeEach(module('refresh.overview'));

    describe('menu', function () {
        var scope, menu, location;
        beforeEach(inject(function ($rootScope, Menu, $location) {
            scope = $rootScope.$new();
            menu = Menu;
            location = $location;
        }));

        it('should populate the main menu when user is authenticated', function () {
            var expected = {'title': 'Overview', 'url': '/overview'};

            expect(menu.items().length).toEqual(1);

            var actual = menu.items()[0];
            expect(actual.title).toEqual(expected.title);
            expect(actual.url).toEqual(expected.url);
        });

        it('should not highlight its menu item when it is not active', function () {
            location.path('/beneficiaries');
            expect(menu.items()[0].showIf()).toBeFalsy();
        });

        it('should activate the menu if the current page is the overview page ', function () {
            location.path('/overview');
            expect(menu.items()[0].showIf()).toBeTruthy();
        });
    });
});
   