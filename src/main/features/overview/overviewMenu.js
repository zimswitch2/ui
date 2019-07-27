var overviewPageFeature = false;
if (feature.overviewPage) {
    overviewPageFeature = true;
}

if (overviewPageFeature) {
    (function (app) {
        'use strict';

        app.run(function ($rootScope, Menu, $location) {
            var overviewHighlightedItems = ['/overview'];
            var overviewMenuItem = {
                title: 'Overview',
                url: '/overview',
                position: 1,
                showIf: function () {
                    var isShown = false;
                    overviewHighlightedItems.forEach(function (item) {
                        if ($location.path().indexOf(item) > -1) {
                            isShown = true;
                        }
                    });
                    return isShown;
                }
            };
            Menu.add(overviewMenuItem);
        });
    })(angular.module('refresh.overview', ['refresh.navigation']));
} else {
    angular.module('refresh.overview', []);
}
