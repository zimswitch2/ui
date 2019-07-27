(function(){
    'use strict';

    angular
        .module('refresh.messenger.suggestionBox')
        .config(function($routeProvider){
            $routeProvider.when('/messenger/suggestion-box', {
                templateUrl: 'features/messenger/suggestionBox/suggestionBox.html',
                controller: 'SuggestionBoxController',
                controllerAs: "vm"
            });
        });
})();