(function (app) {
    'use strict';

    app.provider('Menu', function () {
        var menuItems = [];

        this.$get = function () {
            return {
                add: function (menuItem) {
                    menuItems.unshift(menuItem);
                },

                items: function () {
                    return menuItems;
                },
                remove: function (title) {
                    for (var index = 0; index < menuItems.length; index++) {
                        if (menuItems[index].title === title) {
                            menuItems.splice(index, 1);
                        }
                    }
                }
            };
        };
    });

    app.controller('MenuController',
        function ($scope, Menu, AuthenticationService, $location, Card, $window, User, DigitalId, Flow, InvitationMenuService, ApplicationParameters) {
            $scope.menuItems = Menu.items();
            $scope.displayModal = false;
            $scope.showMenu = false;

            $scope.activeClass = function (menuItem) {

                if (menuItem.showIf && menuItem.showIf()) {
                    return "active";
                }

                if ($location.path() === menuItem.url || _.contains(menuItem.alternativeUrls, $location.path())) {
                    return "active";
                }
                return "";
            };

            $scope.activeSecureMessageItem = function () {
                return $scope.activeClass({
                    showIf: function () {
                        return Flow.getHeaderName() === 'Secure Message' && $location.path() === '/otp/verify';
                    },
                    alternativeUrls: [
                        '/secure-message',
                        '/secure-message/detail',
                        '/secure-message/confirm',
                        '/secure-message/results'
                    ]
                });
            };

            $scope.displayLinkToFullSiteModal = function () {
                $scope.displayModal = true;
                $scope.toggleBurgerMenu();
            };

            $scope.shouldDisplayMenu = function () {
                if(ApplicationParameters.getVariable('acceptInvitationRedirect') === '/account-sharing/accept-decline-invitation' && DigitalId.isAuthenticated()){
                    InvitationMenuService.setShowMenu();
                    return false;
                }
                else{
                    return true;
                }
            };
            $scope.shouldDisplayProfileDropdown = function () {
                if(DigitalId.isAuthenticated() && ApplicationParameters.getVariable('acceptInvitationRedirect') === undefined){
                    return InvitationMenuService.resetShowMenu();
                }
                else{
                    return  InvitationMenuService.setShowMenu();
                }

            };

            $scope.cancel = function () {
                $scope.displayModal = false;
            };

            $scope.confirm = function () {
                AuthenticationService.logout();
                $window.open('https://www.encrypt.standardbank.co.za/');
            };

            $scope.toggleBurgerMenu = function () {
                $scope.showMenu = !$scope.showMenu;
            };

            $scope.hasMultipleDashboards = function () {
                return Card.anySelected() && User.userProfile.dashboards.length > 1;
            };

            $scope.hasCard = function () {
                return Card.anySelected();
            };

            $scope.$on('$locationChangeStart', function () {
                $scope.showMenu = false;
            });
            $scope.isBusinessUser = function () {
                return Card.anySelected() && User.isCurrentDashboardSEDPrincipal();
            };
            $scope.displayMenu = function (){
                return InvitationMenuService.displayMenu();
            };
        });

    app.directive('mainMenu', [function () {
        return {
            controller: "MenuController",
            restrict: 'EA',
            scope: {},
            templateUrl: 'features/mainMenu/partials/mainMenu.html'
        };
    }]);
})(angular.module('refresh.navigation', ['refresh.card', 'refresh.digitalId', 'refresh.security.user', 'refresh.flow','refresh.invitationMenu']));
