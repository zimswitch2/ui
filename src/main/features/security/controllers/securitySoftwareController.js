'use strict';
(function(app){
    app.config(function($routeProvider){
        $routeProvider.when('/security-software', {templateUrl: 'features/security/partials/securitySoftware.html', controller: 'SecuritySoftwareController'});
    });

    app.controller('SecuritySoftwareController',function($scope){

        $scope.platform = navigator.platform;
        $scope.securityDownloadLink  = function(){
            if($scope.platform.indexOf("Mac")!== -1){
                return "http://download.trusteer.com/Xybsry2Bk/leopard/Rapport.dmg";
            }
            else if($scope.platform.indexOf("Win")!== -1){
                return "http://download.trusteer.com/Xybsry2Bk/RapportSetup.exe";
            }
            else{
                return "#";
            }
        };
    });
})(angular.module('refresh.security-software.controller', []));
