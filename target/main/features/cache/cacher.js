'use strict';

(function (app) {
    app.factory('Cacher', function (DSCacheFactory, ServiceEndpoint, $q) {
        var shortLived = DSCacheFactory('shortLived', { deleteOnExpire: 'aggressive', maxAge: 60000 });
        var perennial = DSCacheFactory('perennial');

        var actionsForCache = function (cache, fetchCachePredicate) {
            return {
                fetch: function (endpoint, request, cacheKey) {
                    cacheKey = cacheKey || endpoint;
                    if (!cache.get(cacheKey)) {
                        return ServiceEndpoint[endpoint].makeRequest(request).then(function (response) {
                            if (fetchCachePredicate(response)) {
                                cache.put(cacheKey, response);
                                return _.cloneDeep(cache.get(cacheKey));
                            } else {
                                return $q.reject(response);
                            }
                        });
                    } else {
                        return $q.when(_.cloneDeep(cache.get(cacheKey)));
                    }
                },

                flushEndpoint: function (cacheKey) {
                    cache.remove(cacheKey);
                },

                flush: function () {
                    cache.removeAll();
                }
            };
        };

        return {
            shortLived: actionsForCache(shortLived, function () {
                return true;
            }),
            perennial: actionsForCache(perennial, function (response) {
                return response.headers('x-sbg-response-type') !== 'ERROR';
            })
        };
    });
})(angular.module('refresh.cache', ['refresh.configuration', 'angular-data.DSCacheFactory']));
