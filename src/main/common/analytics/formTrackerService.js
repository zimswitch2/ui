(function(app) {
    'use strict';

    app.service('formTrackerService', function() {
        var triggerChange = function(element) {
            if(window.hasOwnProperty('formtracker')) {
                formtracker.trigger(element, 'change');
            }
        };

        return { 
            triggerChangeOn : triggerChange 
        };
    });
})(angular.module('refresh.formtracker',[]));
