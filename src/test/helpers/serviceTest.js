(function (module) {
    module.factory('ServiceTest', function (ServiceEndpoint, mock, $rootScope) {
        return {
            spyOnEndpoint: function (endpointName) {
                return spyOn(ServiceEndpoint[endpointName], 'makeRequest');
            },
            stubResponse: function (endpointName, status, data, headers) {
                ServiceEndpoint[endpointName].makeRequest.and.returnValue(mock.response(data, status, headers));
            },
            //TODO remove status/header from reject
            stubRejection: function (endpointName, status, data, headers) {
                ServiceEndpoint[endpointName].makeRequest.and.returnValue(mock.reject(data, status, headers));
            },
            endpoint: function (endpointName) {
                return ServiceEndpoint[endpointName].makeRequest;
            },
            resolvePromise: function() {
                $rootScope.$digest();
            }
        };
    });
})(angular.module('refresh.test'));
