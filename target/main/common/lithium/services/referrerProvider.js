(function(){
    'use strict';
    var module = angular.module('lithium.referrer', []);
    module.constant('Referrer', document.referrer);
})();