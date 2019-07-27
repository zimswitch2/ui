angular.module('refresh.profileAndSettings.profileService', ['refresh.configuration'])
    .factory('ProfileService', function (ServiceEndpoint, $q) {
        var errorMessage = 'We are experiencing technical problems. Please try again later';
        return {
            deleteDashboard: function(profileId, cardNumber, cardStatus) {
                return ServiceEndpoint.deleteDashboard.makeRequest({
                    profileId: profileId,
                    cardNumber: cardNumber,
                    statusCode: cardStatus
                }).then(function(response){
                    if(response.headers('x-sbg-response-type') === 'ERROR'){
                        return $q.reject(errorMessage);
                    }
                }).catch(function(){
                    return $q.reject(errorMessage);
                });
            }
        };
});