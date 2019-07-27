(function(){
    'use strict';
    angular
        .module('refresh.messenger.suggestionBox')
        .factory('MessagingService', function(ServiceEndpoint, ServiceError, User, $q){

            var getPeerList = function() {
                var peersPromise =
                    ServiceEndpoint
                        .getPeers
                        .makeRequest() //User.principal())
                        .then(function(response){
                            console.log(response);
                            console.log(response.data);
                            return response.data;
                        },
                        function(response){
                            return $q.reject(ServiceError.newInstance('Error getting peer list', {}));
                        });

                return $q.all({
                    peers: peersPromise
                }).then(function(results){
                    console.log(results);
                    console.log(results.peers);
                    return results.peers;
                });
            };

            return {
                getPeerList : getPeerList
            }
        });
})();
