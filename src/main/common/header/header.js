(function (app) {
    'use strict';

    app.controller('HeaderController', function ($scope, Card, $location, $rootScope, DigitalId, User,InvitationMenuService, ApplicationParameters) {
        $scope.dropDown = false;
        $scope.platform = navigator.platform;
        $scope.preferredName = function () {
            return DigitalId.isAuthenticated() ? DigitalId.current().preferredName : '';
        };

        $scope.shouldDisplayProfileDropdown = function () {
            if(DigitalId.isAuthenticated() && ApplicationParameters.getVariable('acceptInvitationRedirect') === undefined){
                   return InvitationMenuService.resetShowMenu();
            }
            else{
               return  InvitationMenuService.setShowMenu();
            }

        };

        $scope.shouldShowDropDown = function(){
            if(ApplicationParameters.getVariable('acceptInvitationRedirect') === '/account-sharing/accept-decline-invitation' && !DigitalId.isAuthenticated()){
                InvitationMenuService.setShowMenu();
                return false;
            }
            else{
                return true;
            }

        };

        $scope.hasCard = function () {
            return Card.anySelected();
        };

        $scope.dashboardName = function () {
            if (Card.anySelected() ) {
                return  User.userProfile.dashboards.length > 1 ? User.userProfile.currentDashboard.dashboardName :' ';
            }
        };

        $scope.hasMultipleDashboards = function () {
            return Card.anySelected() && User.userProfile.dashboards.length > 1;
        };

        $scope.supportedPlatform = function () {
            return (($scope.platform.indexOf('Mac') !== -1) || ($scope.platform.indexOf('Win32') !== -1));
        };
        $scope.isBusinessUser = function() {
            return Card.anySelected()&& User.isCurrentDashboardSEDPrincipal();
        };
        $scope.displayMenu = function (){
            return InvitationMenuService.displayMenu();
        };

    });
})(angular.module('refresh.header', ['refresh.card', 'refresh.digitalId', 'refresh.security.user','refresh.invitationMenu']));
