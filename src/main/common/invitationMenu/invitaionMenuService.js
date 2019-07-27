(function () {
    'use strict';

    angular.module('refresh.invitationMenu',[])
        .service('InvitationMenuService', function () {
            var serv = this;
            var showMenu = true;

            serv.displayMenu = function () {
                return showMenu;
            };
            serv.setShowMenu = function () {
                showMenu = false;
                return showMenu;
            };

            serv.resetShowMenu = function () {
                showMenu = true;
                return showMenu;
            };
        });
})();
