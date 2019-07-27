var personalFinanceManagementFeature = false;


(function (app) {
    app.factory('Fixture', function ($window) {
        var interceptUrlAndApplyToggles = function (url) {
            var toggledUrls = {
                'base/main/features/security/fixtures/cardNumberResponse.json': personalFinanceManagementFeature ? 'base/main/features/security/fixtures/cardNumberAndPersonIdResponse.json' : 'base/main/features/security/fixtures/cardNumberResponse.json'
            };
            if (toggledUrls.hasOwnProperty(url)) {
                url = toggledUrls[url];
            }
            return url;
        };

        return {
            load: function (url) {
                url = interceptUrlAndApplyToggles(url);
                var response = null;

                var xhr = new $window.XMLHttpRequest();
                xhr.onload = function () {
                    response = this.responseText;
                };
                xhr.open('GET', url, false);
                xhr.send();
                return response;
            }
        };
    });
})(angular.module('refresh.fixture', []));
