describe('Account Sharing Invite Operators Service', function() {
    'use strict';
    beforeEach(module('refresh.invitationMenu'));

    var invitationMenuService;

    beforeEach(inject(function(InvitationMenuService) {
        invitationMenuService = InvitationMenuService;
    }));

    it('should show the menu by default', function() {
        expect(invitationMenuService.displayMenu()).toBeTruthy();
    });

    it('should not show the menu when the user kicks off the invitation process ', function() {
        expect(invitationMenuService.setShowMenu()).toBeFalsy();
    });

    it('should reset the menu back to true', function() {
        expect(invitationMenuService.resetShowMenu()).toBeTruthy();
    });

});
