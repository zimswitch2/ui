'use strict';
var hacks = angular.module('hacks', []);
hacks.config(['$provide', function ($provide) {
    $provide.decorator('$sniffer', ['$delegate', '$window', function ($sniffer, $window) {

        var _hasEvent = $sniffer.hasEvent;

        function getVersionNumber(regex) {
            return parseInt((regex.exec(angular.lowercase($window.navigator.userAgent)) || [])[1], 10);
        }

        $sniffer.hasEvent = function (event) {
            var msie = getVersionNumber(/msie (\d+)/);
            var rvie = getVersionNumber(/rv:(\d+)/);
            if (event === 'input' && msie === 10 || rvie === 11) {
                return false;
            }
            return _hasEvent.call(this, event);
        };

        return $sniffer;
    }]);
}]);
