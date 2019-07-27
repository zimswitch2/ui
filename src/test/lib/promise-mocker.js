(function(){
    var module = angular.module('refresh.test', ['refresh.fixture']);

    module.factory('mock', function ($q) {
        var successful = function (status) {
            return parseInt(status / 100) === 2;
        };

        var resolved = function (callback) {
            return $q.when(callback);
        };

        var rejected = function (data) {
            return $q.reject(data);
        };

        return {
            resolve: function (data) {
                return resolved(data);
            },

            reject: function (error) {
                return rejected(error);
            },

            response: function (data, status, headers) {
                headers = headers || {};
                if (status === undefined) {
                    status = 200;
                }

                var response = {data: data, headers: function (header) {
                    return headers[header];
                }, status: status};

                return successful(status) ? resolved(response) : rejected(response);
            }
        };
    });
})();

