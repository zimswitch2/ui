describe('Transaction', function () {
    var menu, location, flow;
    beforeEach(module('refresh.transaction', 'refresh.test', 'refresh.configuration', 'refresh.navigation', 'refresh.fixture'));

    beforeEach(inject(function (Menu, $rootScope, $location, Flow) {
        menu = Menu;
        location = $location;
        flow = Flow;
        $rootScope.$broadcast('loggedIn');
    }));

    it('should populate the main menu when user is authenticated', function () {
        var expected = {'title': 'Transact', 'url': '/transaction/dashboard' };

        expect(menu.items().length).toEqual(1);


        var actual = menu.items()[0];
        expect(actual.title).toEqual(expected.title);
        expect(actual.url).toEqual(expected.url);
    });

    it('should not highlight its menu item when it is not active', function () {
        expect(menu.items()[0].showIf()).toBeFalsy();
    });

    it('should activate the menu if the current page is the once-off-payment page ', function () {
        location.path('/payment/onceoff');
        expect(menu.items()[0].showIf()).toBeTruthy();
    });

    it('should activate the menu if the current page is transfers page ', function () {
        location.path('/transfers');
        expect(menu.items()[0].showIf()).toBeTruthy();
    });

    it('should activate the menu if the current page is prepaid page ', function () {
        location.path('/prepaid/recharge');
        expect(menu.items()[0].showIf()).toBeTruthy();
    });

    it('should activate the menu if the current page is the otp verify and in add beneficiary flow', function () {
        flow.create([], "Add beneficiary");
        location.path('/otp/verify');
        expect(menu.items()[0].showIf()).toBeTruthy();
    });

    it('should not activate the menu if the current page is the otp verify ', function () {
        location.path('/otp/verify');
        expect(menu.items()[0].showIf()).toBeFalsy();
    });

    it('should populate the main menu when user is authenticated', function () {
        var expected = {'title': 'Transact', 'url': '/transaction/dashboard' };

        expect(menu.items().length).toEqual(1);

        var actual = menu.items()[0];
        expect(actual.title).toEqual(expected.title);
        expect(actual.url).toEqual(expected.url);
    });

    it('should not highlight its menu item when it is not active', function () {
        expect(menu.items()[0].showIf()).toBeFalsy();
    });

    it('should activate the menu if the current page is the add beneficiaries page ', function () {
        location.path('/beneficiaries/add');
        expect(menu.items()[0].showIf()).toBeTruthy();
    });

    it('should activate the menu if the current page is the view group details page ', function () {
        location.path('/beneficiaries/groups/view/groupName');
        expect(menu.items()[0].showIf()).toBeTruthy();
    });

    it('should activate the menu if the current page is the view beneficiary details page', function () {
        location.path('/beneficiaries/groups/view/134324');
        expect(menu.items()[0].showIf()).toBeTruthy();
    });

    it('should activate the menu if the current page add beneficiaries group', function () {
        location.path('/beneficiaries/groups/add');
        expect(menu.items()[0].showIf()).toBeTruthy();
    });

    it('should activate the menu if the current page is the provisional statements page ', function () {
        location.path('/statements/provisional');
        expect(menu.items()[0].showIf()).toBeTruthy();
    });

    it('should activate the menu if the current page is payment confirmation history page ', function () {
        location.path('/payment-notification/history');
        expect(menu.items()[0].showIf()).toBeTruthy();
    });

    it('should activate the menu if the current page is formal statement', function () {
        location.path('/formal-statements');
        expect(menu.items()[0].showIf()).toBeTruthy();
    });
});
