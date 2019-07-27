describe('main menu template', function () {
    'use strict';

    beforeEach(module('refresh.navigation', 'refresh.logout'));

    var isolatedScope, mainMenu;

    beforeEach(inject(function (TemplateTest) {
        var scope = TemplateTest.scope;
        TemplateTest.allowTemplate('features/mainMenu/partials/mainMenu.html');
        var html = '<div main-menu></div>';
        mainMenu = TemplateTest.compileTemplate(html);
        isolatedScope = mainMenu.isolateScope();
    }));

    describe('link to full site', function () {
        it('should not appear on mobile devices', function () {
            isolatedScope.hasCard = function () { return true; };
            isolatedScope.isMobileDevice = function () { return true; };
            isolatedScope.$digest();
            expect(mainMenu.find('#link-to-full-site').length).toBe(0);
        });

        it('should be included if there is a card on non-mobile device', function () {
            isolatedScope.hasCard = function () { return true; };
            isolatedScope.isMobileDevice = function () { return false; };
            isolatedScope.$digest();
            expect(mainMenu.find('#link-to-full-site')).toBeDefined();
        });

        it('should call displayLinkToFullSiteModal when the link is clicked', function () {
            isolatedScope.hasCard = function () { return true; };
            isolatedScope.displayLinkToFullSiteModal = jasmine.createSpy('displayLinkToFullSiteModal');
            isolatedScope.$digest();
            mainMenu.find('#link-to-full-site a').click();
            expect(isolatedScope.displayLinkToFullSiteModal).toHaveBeenCalled();
        });
    });

    describe('send secure message', function () {
        it('should not appear when there is no card', function () {
            isolatedScope.hasCard = function () { return false; };
            isolatedScope.$digest();
            expect(mainMenu.find('#send-secure-message').length).toBe(0);
        });

        it('should appear when there is a card', function () {
            isolatedScope.hasCard = function () { return true; };
            isolatedScope.$digest();
            expect(mainMenu.find('#send-secure-message').length).toBe(1);
        });

        it('should be active if is in secure message flow', function () {
            isolatedScope.hasCard = function () { return true; };
            isolatedScope.activeSecureMessageItem = function () {
                return 'activeIsTrue';
            };
            isolatedScope.$digest();
            expect(mainMenu.find('#sendSecureMessageSmallOnly').hasClass('activeIsTrue')).toBeTruthy();
        });
    });
});
