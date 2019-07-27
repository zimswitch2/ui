describe('accordion', function () {
    'use strict';

    var scope, test, location, digitalId, menuItems, directive;

    beforeEach(module('refresh.accordion', 'refresh.digitalId'));

    beforeEach(inject(function (_TemplateTest_, $location, DigitalId, sbAccordionDirective) {
        scope = _TemplateTest_.scope;
        test = _TemplateTest_;
        location = $location;
        digitalId = DigitalId;
        directive = _.first(sbAccordionDirective);

        test.allowTemplate('features/accountorigination/currentaccount/screens/products/partials/consolidatorCurrentAccount.html');
        test.allowTemplate('features/accountorigination/currentaccount/screens/products/partials/eliteAccount.html');
        test.allowTemplate('features/accountorigination/currentaccount/screens/products/partials/graduateBanking.html');
        test.allowTemplate('features/accountorigination/currentaccount/screens/products/partials/prestigeBanking.html');
        test.allowTemplate('features/accountorigination/currentaccount/screens/products/partials/privateBanking.html');
        test.allowTemplate('features/profileAndSettings/partials/accountList.html');
        test.allowTemplate('features/profileAndSettings/partials/myProfile.html');

        scope.products = [
            {
                id: 'consolidator',
                name: 'Consolidator Current Account',
                partial: 'features/accountorigination/currentaccount/screens/products/partials/consolidatorCurrentAccount.html',
                description: "Simple Finance management for over 55's"
            },
            {
                id: 'elite',
                name: 'Elite Banking',
                partial: 'features/accountorigination/currentaccount/screens/products/partials/eliteAccount.html',
                description: "Banking that evolves with you"
            },
            {
                id: 'graduate',
                name: 'Graduate and Professional Banking',
                partial: 'features/accountorigination/currentaccount/screens/products/partials/graduateBanking.html',
                description: "Moving up in the world?"
            },
            {
                id: 'prestige',
                name: 'Prestige Banking',
                partial: 'features/accountorigination/currentaccount/screens/products/partials/prestigeBanking.html',
                description: "Comprehensive banking solutions"
            },
            {
                id: 'private',
                name: 'Private Banking',
                partial: 'features/accountorigination/currentaccount/screens/products/partials/privateBanking.html',
                description: 'Exclusive wealth management solutions, supported by your own Private Banker'
            }
        ];

        menuItems = [
            {
                id: 'profile',
                name: 'My Profile',
                tagLine: 'Moving up in the world',
                partial: 'features/profileAndSettings/partials/myProfile.html',
                url: ['/myProfileMenuPath', '/myProfileMenuPath2']
            },
            {
                id: 'preferences',
                name: 'Product Preferences',
                tagLine: 'Moving up in the world',
                partial: 'features/profileAndSettings/partials/accountList.html',
                url: ['/myPreferencesMenuPath']
            }
        ];

        scope.profileMenuItems = menuItems;

    }));

    function render(partial) {

        partial = partial || 'common/accordion/partials/accountOriginationAccordion.html';
        var template = '<sb-accordion items="products" partial=' + partial + '> </sb-accordion>';
        test.allowTemplate(partial);
        return test.compileTemplate(template);
    }

    function renderMultiExpandPartial(partial) {

        partial = partial || 'common/accordion/partials/accountOriginationAccordion.html';
        var template = '<sb-accordion items="products" partial="' + partial + '" multi-expand= "true"> </sb-accordion>';
        test.allowTemplate(partial);
        return test.compileTemplate(template);
    }

    it('should set the templateUrl based on the partial attribute', function () {
        var partial = 'common/accordion/partials/accountOriginationAccordion.html';
        expect(render(partial)).toBeTruthy();
    });


    it('should check if the current menu url is the same as the current location', function () {
        digitalId.authenticate('x', 'y', 'z');
        location.path('/myProfileMenuPath');
        var element = render();
        var scope = element.isolateScope();
        var response = scope.isCurrentLocation(['/myProfileMenuPath']);
        expect(response).toBeTruthy();
    });


    it('should change the arrow class when a menu item is clicked', function () {

        scope.products = scope.profileMenuItems;
        digitalId.authenticate('x', 'y', 'z');
        location.path('/myProfileMenuPath');
        var element = render('common/accordion/partials/profileAccordion.html');
        expect(element.find('#profile').text()).toContain('My Profile');
        expect(element.find('#profile i').attr('class')).toContain('icomoon-chevron-down');
        expect(element.find('#preferences i').attr('class')).toContain('icomoon-chevron-right');
        element.find('#preferences').trigger('click');
        expect(element.find('#preferences i').attr('class')).toContain('icomoon-chevron-down');
        expect(element.find('#profile i').attr('class')).toContain('icomoon-chevron-right');
    });


    it('should set "More Detail" and "Less Details" when element is clicked', function () {
        var element = render();
        expect(element.find('#prestige').text()).toContain('Details');
        element.find('#prestige').trigger('click');
        expect(element.find('#prestige').text()).toContain('Close');
    });

    it('should set isOpenTab to true when tab is open', function () {
        var element = render();
        var directiveScope = element.isolateScope();
        expect(directiveScope.isOpenTab('Prestige Banking')).toBeFalsy();
        element.find('#prestige').trigger('click');
        expect(directiveScope.isOpenTab('Prestige Banking')).toBeTruthy();
    });


    it('should open and close a tab when it is clicked', function () {
        var element = render();
        var directiveScope = element.isolateScope();
        expect(directiveScope.activeTabs).toEqual([]);
        directiveScope.openTab('Prestige Banking');
        expect(directiveScope.activeTabs).toEqual(['Prestige Banking']);
        directiveScope.openTab('Prestige Banking');
        expect(directiveScope.activeTabs).toEqual([]);
    });

    it('should open a tab and close any other tab that was open', function () {
        var element = render();
        var directiveScope = element.isolateScope();
        expect(directiveScope.activeTabs).toEqual([]);
        directiveScope.openTab('Prestige Banking');
        expect(directiveScope.activeTabs).toEqual(['Prestige Banking']);
        directiveScope.openTab('Elite Banking');
        expect(directiveScope.activeTabs).toEqual(['Elite Banking']);
    });

    it('should open a tab and not close any other tab that was open', function () {
        var element = renderMultiExpandPartial();
        var directiveScope = element.isolateScope();
        expect(directiveScope.activeTabs).toEqual([]);
        directiveScope.openTab('Prestige Banking');
        expect(directiveScope.activeTabs).toEqual(['Prestige Banking']);
        directiveScope.openTab('Elite Banking');
        expect(directiveScope.activeTabs).toEqual([ 'Prestige Banking', 'Elite Banking' ]);
    });

    describe('AccordionController', function () {
        var scope, location, controller;

        function initializeController() {
            controller('AccordionController', {$scope: scope, $location: location});
        }

        beforeEach(inject(function ($rootScope, $controller, $location) {
            scope = $rootScope.$new();
            location = $location;
            controller = $controller;
        }));

        it('should set the active tab to empty when there are no items', function () {
            initializeController();
            expect(scope.activeTabs).toEqual([]);
        });

        it('should set the active tab to selected tab if there items in the list', function () {
            scope.items = menuItems;
            digitalId.authenticate('x', 'y', 'z');
            location.path('/myProfileMenuPath');
            initializeController();
            expect(scope.activeTabs).toEqual(['My Profile']);
        });
    });
});
